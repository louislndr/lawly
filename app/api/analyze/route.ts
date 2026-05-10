import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { classifyScenario } from "@/lib/scenario-classifier";
import { housingScenarios, unsupportedEntries } from "@/lib/legal-library";
import { getFallbackGuidance } from "@/lib/fallback-guidance";
import { buildSupportedScenarioPrompt, buildUnsupportedScenarioPrompt } from "@/lib/prompts";
import type { SupportedScenarioId, UnsupportedScenarioId } from "@/lib/legal-library";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problem } = body;

    if (!problem || typeof problem !== "string" || problem.trim().length < 10) {
      return NextResponse.json(
        { error: "Please describe your problem in more detail." },
        { status: 400 }
      );
    }

    const classification = classifyScenario(problem.trim());
    const ai = getGeminiClient();

    let prompt: string;

    if (classification.supported) {
      const scenario = housingScenarios[classification.scenarioId as SupportedScenarioId];
      prompt = buildSupportedScenarioPrompt({
        userInput: problem.trim(),
        scenarioJson: JSON.stringify(scenario, null, 2),
        language: "en",
      });
    } else {
      const fallback = getFallbackGuidance(classification.category);
      prompt = buildUnsupportedScenarioPrompt({
        userInput: problem.trim(),
        fallbackJson: JSON.stringify(fallback, null, 2),
        language: "en",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    });

    const data = parseJsonObject(response.text ?? "");

    if (classification.supported) {
      const scenario = housingScenarios[classification.scenarioId as SupportedScenarioId];
      // Enforce authoritative fields — Gemini must not override these
      data.supported = true;
      data.scenarioId = classification.scenarioId;
      data.category = scenario.category;
      data.title = scenario.titleEn;
      data.keyFacts = scenario.approvedLegalStepsEn;
    } else {
      // Enforce unsupported shape
      data.supported = false;
      data.category = classification.category;
      const entry = unsupportedEntries[classification.scenarioId as UnsupportedScenarioId]
        ?? unsupportedEntries.unsupported_unknown;
      data.title = data.title || entry.title;
      // The plainLanguageSummary is fixed per spec — do not let Gemini vary it
      data.plainLanguageSummary =
        "Lawly recognized the type of issue, but does not yet have verified Quebec legal content loaded for this exact situation.";
      data.whatLawlyCanDo = data.whatLawlyCanDo?.length
        ? data.whatLawlyCanDo
        : entry.whatLawlyCanDo;
      data.disclaimer =
        "Lawly is not a lawyer. This is organization support, not legal advice.";
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/analyze]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
