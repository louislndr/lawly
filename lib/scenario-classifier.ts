// Lightweight deterministic classifier.
// Determines whether Lawly can answer from verified library content or must use the safe fallback.

import { SupportedScenarioId, UnsupportedScenarioId, LegalCategory, housingScenarios } from "./legal-library";

export type ClassificationResult = {
  scenarioId: SupportedScenarioId | UnsupportedScenarioId;
  category: LegalCategory;
  supported: boolean;
  confidence: number;
  reason: string;
};

function containsAny(input: string, terms: string[]) {
  return terms.some((term) => input.includes(term.toLowerCase()));
}

export function classifyScenario(userInput: string): ClassificationResult {
  const input = userInput.toLowerCase();

  for (const scenario of Object.values(housingScenarios)) {
    if (containsAny(input, scenario.keywords)) {
      return {
        scenarioId: scenario.id,
        category: "housing",
        supported: true,
        confidence: 0.9,
        reason: `Matched verified scenario keywords for ${scenario.id}.`,
      };
    }
  }

  if (
    containsAny(input, [
      "landlord", "tenant", "rent", "lease", "apartment", "dwelling", "housing",
      "propriétaire", "locataire", "loyer", "bail", "logement",
    ])
  ) {
    return {
      scenarioId: "unsupported_unknown",
      category: "housing",
      supported: false,
      confidence: 0.55,
      reason: "Housing-related issue, but not one of the verified Lawly scenarios.",
    };
  }

  if (
    containsAny(input, [
      "fired", "employer", "salary", "wage", "work", "job", "boss", "unpaid",
      "congédié", "salaire", "employeur", "travail",
    ])
  ) {
    return {
      scenarioId: "unsupported_work",
      category: "work",
      supported: false,
      confidence: 0.8,
      reason: "Work issue detected — no verified labour law library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "refund", "defective", "subscription", "store", "purchase", "warranty",
      "remboursement", "produit", "magasin", "garantie",
    ])
  ) {
    return {
      scenarioId: "unsupported_consumer",
      category: "consumer",
      supported: false,
      confidence: 0.8,
      reason: "Consumer issue detected — no verified consumer law library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "government", "notice", "benefit", "form", "deadline", "tax", "letter",
      "gouvernement", "avis", "formulaire", "impôt",
    ])
  ) {
    return {
      scenarioId: "unsupported_government_notice",
      category: "government_notice",
      supported: false,
      confidence: 0.75,
      reason: "Government notice issue detected — no verified government-process library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "divorce", "custody", "child support", "separation", "family",
      "garde", "pension alimentaire", "séparation",
    ])
  ) {
    return {
      scenarioId: "unsupported_family",
      category: "family",
      supported: false,
      confidence: 0.8,
      reason: "Family law issue detected — no verified family law library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "visa", "immigration", "permit", "asylum", "refugee",
      "permis", "réfugié",
    ])
  ) {
    return {
      scenarioId: "unsupported_immigration",
      category: "immigration",
      supported: false,
      confidence: 0.8,
      reason: "Immigration issue detected — no verified immigration library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "police", "arrested", "criminal", "charge", "ticket", "court date", "accused",
      "arrêté", "criminel", "accusation",
    ])
  ) {
    return {
      scenarioId: "unsupported_criminal",
      category: "criminal",
      supported: false,
      confidence: 0.8,
      reason: "Criminal or ticket issue detected — Lawly does not give specific criminal legal guidance.",
    };
  }

  if (
    containsAny(input, [
      "debt", "collection", "loan", "credit", "owe",
      "dette", "recouvrement", "crédit", "prêt",
    ])
  ) {
    return {
      scenarioId: "unsupported_debt",
      category: "debt",
      supported: false,
      confidence: 0.75,
      reason: "Debt issue detected — no verified debt law library loaded yet.",
    };
  }

  if (
    containsAny(input, [
      "university", "school", "student discipline", "academic misconduct", "grade appeal",
      "suspension", "université", "école", "plagiat",
    ])
  ) {
    return {
      scenarioId: "unsupported_school",
      category: "school",
      supported: false,
      confidence: 0.75,
      reason: "School or university issue detected — no verified school policy library loaded yet.",
    };
  }

  return {
    scenarioId: "unsupported_unknown",
    category: "unknown",
    supported: false,
    confidence: 0.2,
    reason: "No verified scenario matched.",
  };
}
