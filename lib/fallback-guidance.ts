// /lib/fallback-guidance.ts
// Safe guidance for unsupported scenarios.
// This is intentionally general and does not cite law.

import { TrustedResource, trustedResources } from "./legal-content";

export type FallbackGuidance = {
  supported: false;
  category: string;
  title: string;
  plainLanguageSummary: string;
  safeOrientation: string;
  nextSteps: {
    title: string;
    description: string;
    urgency: "low" | "medium" | "high";
  }[];
  documentsToGather: string[];
  questionsToAsk: string[];
  trustedResources: TrustedResource[];
  disclaimer: string;
};

export function getFallbackGuidance(category: string): FallbackGuidance {
  const commonDocuments = [
    "Contracts, notices, letters, or forms",
    "Screenshots or written messages",
    "Receipts, invoices, payment records, or proof of loss",
    "Important dates and deadlines",
    "Names and contact information of people involved"
  ];

  const commonQuestions = [
    "What official process handles this type of issue?",
    "What deadline applies to my situation?",
    "What evidence should I keep or attach?",
    "Is there a free or low-cost legal clinic that can review this?",
    "What should I avoid doing before getting advice?"
  ];

  const base: FallbackGuidance = {
    supported: false,
    category,
    title: "Lawly can help you organize this, but this category is not verified yet",
    plainLanguageSummary:
      "This sounds like a legal or administrative issue, but Lawly does not yet have verified hardcoded legal content for this exact situation. To avoid hallucinations, Lawly will not give a specific legal answer.",
    safeOrientation:
      "You can still use Lawly to organize the facts, preserve documents, identify questions, and find a trusted resource to contact.",
    nextSteps: [
      {
        title: "Save all documents",
        description:
          "Keep notices, messages, contracts, receipts, photos, and any document showing dates or amounts.",
        urgency: "high"
      },
      {
        title: "Write a short timeline",
        description:
          "List what happened in order, with dates, names, amounts, and deadlines.",
        urgency: "medium"
      },
      {
        title: "Contact a trusted resource",
        description:
          "Before filing or sending anything official, confirm the correct process with a legal clinic, government body, or lawyer.",
        urgency: "medium"
      }
    ],
    documentsToGather: commonDocuments,
    questionsToAsk: commonQuestions,
    trustedResources: [trustedResources.educaloi, trustedResources.barreau],
    disclaimer:
      "Lawly is not a lawyer. This is general organization support, not legal advice."
  };

  if (category === "work") {
    return {
      ...base,
      title: "This sounds like a work issue",
      trustedResources: [trustedResources.cnesst, trustedResources.educaloi, trustedResources.barreau],
      safeOrientation:
        "For workplace problems, keep pay records, contracts, schedules, emails, and dates. CNESST is a key Quebec resource for labour standards and pay-related issues."
    };
  }

  if (category === "consumer") {
    return {
      ...base,
      title: "This sounds like a consumer problem",
      trustedResources: [trustedResources.opc, trustedResources.educaloi, trustedResources.barreau],
      safeOrientation:
        "For consumer problems, keep receipts, contracts, emails, warranty information, and proof that you asked the business to fix the issue."
    };
  }

  if (category === "government") {
    return {
      ...base,
      title: "This sounds like a government notice or form issue",
      safeOrientation:
        "For government notices, identify the issuing organization, the deadline, the requested action, and any appeal/review instructions."
    };
  }

  if (category === "criminal") {
    return {
      ...base,
      title: "This may involve a criminal or ticket issue",
      safeOrientation:
        "Criminal and ticket-related issues can have serious consequences. Do not rely on Lawly for specific guidance. Contact a lawyer or legal clinic quickly, especially if there is a court date or deadline.",
      trustedResources: [trustedResources.barreau, trustedResources.educaloi]
    };
  }

  return base;
}
