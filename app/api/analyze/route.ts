import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { classifyScenario } from "@/lib/scenario-classifier";
import { housingScenarios } from "@/lib/legal-content";
import { getFallbackGuidance } from "@/lib/fallback-guidance";
import { buildSupportedScenarioPrompt, buildUnsupportedScenarioPrompt } from "@/lib/prompts";
import type { SupportedScenarioId } from "@/lib/legal-content";

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
      data.scenarioId = classification.scenarioId;
      data.keyFacts = scenario.approvedLegalStepsEn;
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/analyze]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
