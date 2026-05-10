// Unsupported scenario entries for categories where Lawly has no verified legal library loaded.
// These entries tell Lawly what it CAN do (organize, not advise) and which sources to suggest.
// Never cite laws, deadlines, forms, or procedures from these entries.

import { TrustedResource, trustedResources } from "./housing";

export type UnsupportedScenarioId =
  | "unsupported_work"
  | "unsupported_consumer"
  | "unsupported_government_notice"
  | "unsupported_family"
  | "unsupported_immigration"
  | "unsupported_criminal"
  | "unsupported_debt"
  | "unsupported_school"
  | "unsupported_unknown";

export type UnsupportedEntry = {
  category: string;
  title: string;
  whatLawlyCanDo: string[];
  documentsToGather: string[];
  questionsToAsk: string[];
  trustedSources: TrustedResource[];
  disclaimer: string;
};

const COMMON_WHAT_LAWLY_CAN_DO = [
  "Organize your facts into a clear timeline",
  "Identify documents to gather before seeking help",
  "Prepare questions to ask a lawyer or legal clinic",
  "Suggest trusted Quebec sources to check",
];

const COMMON_DOCUMENTS = [
  "Contracts, notices, letters, or official forms",
  "Screenshots or copies of written messages",
  "Receipts, invoices, or proof of payment",
  "A written timeline of events with dates",
  "Names and contact information of people involved",
];

const COMMON_QUESTIONS = [
  "What official process handles this type of issue in Quebec?",
  "What deadline applies to my situation?",
  "What evidence should I keep or attach?",
  "Is there a free or low-cost legal clinic that can review this?",
  "What should I avoid doing before getting professional advice?",
];

const COMMON_DISCLAIMER =
  "Lawly is not a lawyer. This is organization support, not legal advice.";

export const unsupportedEntries: Record<UnsupportedScenarioId, UnsupportedEntry> = {
  unsupported_work: {
    category: "work",
    title: "This sounds like a work or employment issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "Employment contract or offer letter",
      "Pay stubs and records of hours worked",
      "Emails or messages with your employer",
      "Termination letter or notice, if any",
      "Record of dates — start date, last day, pay period",
    ],
    questionsToAsk: [
      ...COMMON_QUESTIONS,
      "What is the deadline to file a complaint with CNESST?",
      "Do I qualify for wrongful dismissal protection?",
    ],
    trustedSources: [
      trustedResources.cnesst,
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_consumer: {
    category: "consumer",
    title: "This sounds like a consumer protection issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "Receipt or proof of purchase",
      "Contract or terms of sale",
      "Product warranty information",
      "Photos or evidence of the defect or problem",
      "Emails or messages with the business",
      "Any refund or replacement refusal in writing",
    ],
    questionsToAsk: [
      ...COMMON_QUESTIONS,
      "Does Quebec's Consumer Protection Act apply to my purchase?",
      "Can I file a complaint with the OPC (Office de la protection du consommateur)?",
      "Is this eligible for small claims court?",
    ],
    trustedSources: [
      trustedResources.opc,
      trustedResources.educaloi,
      trustedResources.quebecSmallClaims,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_government_notice: {
    category: "government_notice",
    title: "This sounds like a government notice or administrative issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "The official notice or letter (keep the envelope too, for the postmark date)",
      "The name of the issuing government body",
      "Any deadline mentioned in the notice",
      "Any appeal or review instructions in the notice",
      "Previous correspondence related to this matter",
    ],
    questionsToAsk: [
      ...COMMON_QUESTIONS,
      "What is the appeal or objection deadline for this notice?",
      "Which government body issued this and who can I contact?",
      "Is there a free appeal or review process available?",
    ],
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_family: {
    category: "family",
    title: "This sounds like a family law issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "Marriage certificate or proof of civil union, if applicable",
      "Separation or divorce agreement, if any",
      "Documents related to custody or support arrangements",
      "Any court orders or official letters",
      "Financial records if support or property division is involved",
    ],
    questionsToAsk: COMMON_QUESTIONS,
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_immigration: {
    category: "immigration",
    title: "This sounds like an immigration or permit issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "Your current immigration document (visa, permit, status paper)",
      "Any notice or letter received from IRCC or MIDI",
      "Deadlines mentioned in any official correspondence",
      "Proof of your current status in Canada",
    ],
    questionsToAsk: COMMON_QUESTIONS,
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_criminal: {
    category: "criminal",
    title: "This may involve a criminal, ticket, or police matter",
    whatLawlyCanDo: [
      "Help you organize the facts of what happened",
      "Identify documents to gather before speaking to a lawyer",
      "Suggest trusted sources to find a criminal defence lawyer",
      "Remind you of your right to remain silent and your right to counsel",
    ],
    documentsToGather: [
      "Any ticket, summons, charge, or notice you received",
      "Date, time, and location of the incident",
      "Names of any witnesses",
      "Your own notes written as soon as possible after the event",
    ],
    questionsToAsk: [
      "Do I have the right to remain silent?",
      "What is my right to counsel?",
      "Is there a court date — what is the deadline?",
      "Can I get a free or low-cost criminal lawyer?",
    ],
    trustedSources: [
      trustedResources.barreau,
      trustedResources.educaloi,
    ],
    disclaimer:
      "Criminal matters can have serious consequences. Lawly is not a lawyer. Contact a lawyer or legal aid immediately. This is not legal advice.",
  },

  unsupported_debt: {
    category: "debt",
    title: "This sounds like a debt or collection issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "The original contract or loan agreement",
      "Statements showing the amount owed",
      "Any collection letters or notices received",
      "Proof of payments already made",
      "Dates of all communications with collectors",
    ],
    questionsToAsk: COMMON_QUESTIONS,
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_school: {
    category: "school",
    title: "This sounds like a school or university issue",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: [
      "The official notice or letter from the institution",
      "The relevant section of the student policy or academic code",
      "Any written communications with faculty or administration",
      "Evidence supporting your position (emails, assignments, grades)",
      "Appeal deadlines stated in the notice",
    ],
    questionsToAsk: COMMON_QUESTIONS,
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },

  unsupported_unknown: {
    category: "unknown",
    title: "Lawly could not classify this situation",
    whatLawlyCanDo: COMMON_WHAT_LAWLY_CAN_DO,
    documentsToGather: COMMON_DOCUMENTS,
    questionsToAsk: COMMON_QUESTIONS,
    trustedSources: [
      trustedResources.educaloi,
      trustedResources.barreau,
    ],
    disclaimer: COMMON_DISCLAIMER,
  },
};
