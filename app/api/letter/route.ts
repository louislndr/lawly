import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { housingScenarios } from "@/lib/legal-library";
import type { DocumentSlots } from "@/lib/document-templates";
import type { SupportedScenarioId } from "@/lib/legal-library";

function todayFormatted(): string {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

function parseJsonObject(raw: string) {
  const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonText =
    jsonStart >= 0 && jsonEnd > jsonStart
      ? cleaned.slice(jsonStart, jsonEnd + 1)
      : cleaned;

  try {
    return JSON.parse(jsonText);
  } catch {
    const withoutTrailingCommas = jsonText.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(withoutTrailingCommas);
  }
}

function buildExtractionPrompt(
  problem: string,
  summary: string,
  scenario: object,
  scenarioId: string,
  today: string
): string {
  const scenarioHint: Record<string, string> = {
    housing_deposit:
      "Focus on: deposit amount paid, date paid, move-out date, landlord's reason for keeping deposit, evidence.",
    housing_repairs:
      "Focus on: description of the repair issue or problem, date the problem started, date the landlord was notified, evidence available.",
    housing_rent_increase:
      "Focus on: current monthly rent, proposed new rent amount, date the rent notice was received, lease end date.",
    housing_eviction_notice:
      "Focus on: date the eviction/repossession notice was received, date the landlord wants possession (vacate date), reason given for eviction or repossession, lease end date.",
  };

  const hint = scenarioHint[scenarioId] ?? "Extract all facts the user provides about their situation.";

  return `You are extracting structured facts from a tenant's description to prefill a Lawly document.

SCENARIO TYPE: ${scenarioId}
${hint}

VERIFIED SCENARIO (source of truth for legal content — do not add citations outside this):
${JSON.stringify(scenario, null, 2)}

USER'S SITUATION:
${problem}

ANALYSIS SUMMARY:
${summary}

Today's date: ${today}

INSTRUCTIONS:
- Extract ONLY facts explicitly stated by the user. Do not invent names, addresses, dates, or amounts.
- If a field is not stated by the user, return an empty string "".
- For money amounts: use dollar format (e.g. "$850").
- For factsParagraph: write 2–3 neutral third-person sentences based strictly on what the user stated.

Return EXACTLY valid JSON:
{
  "tenantName": "",
  "tenantAddress": "",
  "tenantCity": "",
  "tenantPhone": "",
  "tenantEmail": "",
  "landlordName": "",
  "landlordAddress": "",
  "unitAddress": "",
  "factsParagraph": "",
  "proofAvailable": "",
  "landlordReason": "",
  "issueDate": "${today}",
  "deadlineDate": "",
  "depositAmount": "",
  "datePaid": "",
  "moveOutDate": "",
  "repairDescription": "",
  "problemStartDate": "",
  "notifiedDate": "",
  "currentRent": "",
  "newRent": "",
  "noticeReceivedDate": "",
  "leaseEndDate": "",
  "vacateDate": "",
  "evictionReason": ""
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation.`;
}

export async function POST(req: NextRequest) {
  try {
    const { problem, analysis } = await req.json();

    if (!problem || !analysis) {
      return NextResponse.json({ error: "Missing case data." }, { status: 400 });
    }

    if (!analysis.supported) {
      return NextResponse.json(
        { error: "Documents are not available for this type of case." },
        { status: 400 }
      );
    }

    const scenarioId = analysis.scenarioId as SupportedScenarioId;
    const scenario = housingScenarios[scenarioId];
    if (!scenario) {
      return NextResponse.json({ error: "Unknown scenario." }, { status: 400 });
    }

    const ai = getGeminiClient();
    const today = todayFormatted();

    const prompt = buildExtractionPrompt(
      problem,
      analysis.explanation ?? analysis.plainLanguageSummary ?? "",
      scenario,
      scenarioId,
      today
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    });

    let extracted: Partial<DocumentSlots> = {};
    try {
      extracted = parseJsonObject(response.text ?? "{}");
    } catch {
      // fallback: all fields empty, renderer substitutes placeholders
    }

    const amountFallback = (() => {
      const moneyMatch = problem.match(/\$\s?\d{1,3}(?:[\d,\.]*\d)?|\d{1,3}(?:[\d,\.]*\d)?\s?(?:dollars|\$)/i);
      if (!moneyMatch) return "";
      const raw = moneyMatch[0].trim();
      if (raw.startsWith("$")) return raw.replace(/\s+/g, "");
      const numeric = raw.replace(/[^\d\.]/g, "");
      return numeric ? `$${numeric}` : "";
    })();

    const slots: DocumentSlots = {
      scenarioId,
      tenantName: extracted.tenantName || "",
      tenantAddress: extracted.tenantAddress || "",
      tenantCity: extracted.tenantCity || "",
      tenantPhone: extracted.tenantPhone || "",
      tenantEmail: extracted.tenantEmail || "",
      landlordName: extracted.landlordName || "",
      landlordAddress: extracted.landlordAddress || "",
      unitAddress: extracted.unitAddress || "",
      factsParagraph: extracted.factsParagraph || "",
      proofAvailable: extracted.proofAvailable || "",
      landlordReason: extracted.landlordReason || "",
      issueDate: extracted.issueDate || today,
      deadlineDate: extracted.deadlineDate || "",
      depositAmount: extracted.depositAmount || amountFallback || "",
      datePaid: extracted.datePaid || "",
      moveOutDate: extracted.moveOutDate || "",
      repairDescription: extracted.repairDescription || "",
      problemStartDate: extracted.problemStartDate || "",
      notifiedDate: extracted.notifiedDate || "",
      currentRent: extracted.currentRent || "",
      newRent: extracted.newRent || "",
      noticeReceivedDate: extracted.noticeReceivedDate || "",
      leaseEndDate: extracted.leaseEndDate || "",
      vacateDate: extracted.vacateDate || "",
      evictionReason: extracted.evictionReason || "",
    };

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[/api/letter]", error);
    return NextResponse.json(
      { error: "Document generation failed. Please try again." },
      { status: 500 }
    );
  }
}
