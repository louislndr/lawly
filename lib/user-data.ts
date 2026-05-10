import type { UserProfile, SavedCase, AnalysisResult } from "@/types/lawly";

const STORAGE_KEY = "lawly_saved_cases";

function parseSavedCases(raw: string | null): SavedCase[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return [];
  }

  return [];
}

export function getStoredCases(): SavedCase[] {
  if (typeof window === "undefined") return [];
  return parseSavedCases(window.localStorage.getItem(STORAGE_KEY));
}

export function getPersistedCases(): SavedCase[] {
  const stored = getStoredCases();
  const merged = [...FAKE_USER.cases, ...stored];
  const seen = new Set<string>();

  return merged.filter((caseItem) => {
    if (seen.has(caseItem.id)) return false;
    seen.add(caseItem.id);
    return true;
  });
}

export function getPersistedCaseById(id: string): SavedCase | undefined {
  return getPersistedCases().find((caseItem) => caseItem.id === id);
}

export function createSavedCase(problem: string, analysis: AnalysisResult): SavedCase {
  const date = new Date().toISOString().slice(0, 10);

  return {
    id: `case_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    problem,
    category: analysis.category ?? "Legal Issue",
    createdAt: date,
    lastModified: date,
    status: "active",
    analysis,
  };
}

export function saveCaseToStorage(caseItem: SavedCase): void {
  if (typeof window === "undefined") return;
  const current = getStoredCases();
  const index = current.findIndex((existing) => existing.id === caseItem.id);

  if (index >= 0) {
    current[index] = caseItem;
  } else {
    current.push(caseItem);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

// Sample cases for demo — uses the updated response shapes
export const FAKE_USER: UserProfile = {
  id: "user_louis_001",
  name: "Louis Landreau",
  email: "landreaulouis02@gmail.com",
  createdAt: "2026-05-09",
  avatar: "https://ui-avatars.com/api/?name=Louis+Landreau&background=162f70&color=fff",
  cases: [
    {
      id: "case_001",
      problem: "My landlord refused to return my security deposit after I moved out",
      category: "housing",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "active",
      analysis: {
        supported: true,
        scenarioId: "housing_deposit",
        category: "housing",
        title: "Security deposit or money demanded by landlord",
        explanation:
          "In Quebec, a landlord cannot require any amount of money other than rent — this includes security deposits, damage deposits, and key deposits. If your landlord kept a deposit, the verified rule (CCQ art. 1904) is on your side.",
        rightsExplanation:
          "You have the right to the return of any deposit paid, since collecting it was illegal under Quebec residential tenancy law.",
        citations: [
          {
            label: "Civil Code of Québec — Art. 1904",
            sourceName: "Civil Code of Québec",
            articleOrPage: "Article 1904 C.C.Q.",
            sourceUrl:
              "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1904",
            exactExcerpt:
              "Nor may he exact any amount of money other than the rent, in the form of a deposit or otherwise",
            plainRule:
              "A Quebec residential landlord cannot require a deposit or any other amount of money beyond rent.",
          },
        ],
        timeline: [
          {
            title: "Gather proof",
            description:
              "Keep the lease, proof of payment, messages, photos, and any written reason the landlord gave.",
            timingLabel: "Today",
            urgency: "high",
            stepType: "practical_next_step",
          },
          {
            title: "Send formal notice",
            description:
              "Send a formal written demand asking for the return of the deposit and keep proof of delivery.",
            timingLabel: "As soon as possible",
            urgency: "high",
            stepType: "practical_next_step",
          },
          {
            title: "Verify the correct filing path",
            description:
              "If there is no response, contact a tenant association or legal clinic and confirm the correct forum and process before filing anything official.",
            timingLabel: "If no response by deadline",
            urgency: "medium",
            stepType: "needs_verification",
          },
        ],
        availableDocuments: ["formal_notice", "filing_prep_packet"],
        missingInformation: [
          "Exact amount of deposit paid",
          "Date deposit was paid",
          "Landlord's written reason for keeping it",
        ],
        keyFacts: [
          "Gather proof of the payment, lease, messages, and move-out condition.",
          "Send a formal notice demanding return of the deposit.",
          "If there is no response, verify the correct filing path before filing.",
        ],
        trustedResources: [
          {
            name: "Tribunal administratif du logement",
            url: "https://www.tal.gouv.qc.ca/en/",
            description: "Quebec's housing tribunal and official housing forms.",
          },
          {
            name: "Éducaloi",
            url: "https://educaloi.qc.ca/en/",
            description: "Plain-language legal information for people in Quebec.",
          },
        ],
        disclaimer:
          "Lawly is not a lawyer. This is legal information, not legal advice. Verify deadlines, forms, and the correct filing path before taking action.",
      },
    },
    {
      id: "case_002",
      problem: "I was fired from my job without any notice or reason",
      category: "work",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "active",
      analysis: {
        supported: false,
        category: "work",
        title: "This sounds like a work or employment issue",
        plainLanguageSummary:
          "Lawly recognized the type of issue, but does not yet have verified Quebec legal content loaded for this exact situation.",
        whatLawlyCanDo: [
          "Organize your facts into a clear timeline",
          "Identify documents to gather before seeking help",
          "Prepare questions to ask a lawyer or legal clinic",
          "Suggest trusted Quebec sources to check",
        ],
        documentsToGather: [
          "Employment contract or offer letter",
          "Pay stubs and records of hours worked",
          "Termination letter or notice, if any",
          "Emails or messages with your employer",
          "Record of dates — start date, last day, pay period",
        ],
        questionsToAsk: [
          "What is the deadline to file a complaint with CNESST?",
          "Do I qualify for wrongful dismissal protection?",
          "What official process handles this type of issue in Quebec?",
          "Is there a free or low-cost legal clinic that can review this?",
        ],
        trustedSources: [
          {
            name: "CNESST",
            url: "https://www.cnesst.gouv.qc.ca/",
            description: "Quebec labour standards, workplace rights, and pay-related resources.",
          },
          {
            name: "Éducaloi",
            url: "https://educaloi.qc.ca/en/",
            description: "Plain-language legal information for people in Quebec.",
          },
        ],
        disclaimer: "Lawly is not a lawyer. This is organization support, not legal advice.",
      },
    },
    {
      id: "case_003",
      problem: "My landlord sent a rent increase notice and I want to refuse it",
      category: "housing",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "resolved",
      analysis: {
        supported: true,
        scenarioId: "housing_rent_increase",
        category: "housing",
        title: "Rent increase or lease modification notice",
        explanation:
          "This looks like a rent increase or lease modification issue. The verified rules Lawly can rely on are that the landlord must give notice within the required period, and a tenant who objects must notify the landlord within one month after receiving the notice.",
        rightsExplanation:
          "You have the right to refuse a rent increase. If you object, you must notify the landlord in writing within one month after receiving the notice (CCQ art. 1945).",
        citations: [
          {
            label: "Civil Code of Québec — Art. 1945",
            sourceName: "Civil Code of Québec",
            articleOrPage: "Article 1945 C.C.Q.",
            sourceUrl:
              "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1945",
            exactExcerpt: "within one month after receiving the notice of modification of the lease",
            plainRule:
              "A tenant who objects to a proposed lease modification must notify the landlord within one month after receiving the notice.",
          },
        ],
        timeline: [
          {
            title: "Check the date you received the notice",
            description:
              "Write down the exact date you received the rent increase notice. The one-month objection deadline starts from this date.",
            timingLabel: "Today — 1-month clock starts now",
            urgency: "high",
            stepType: "source_based",
          },
          {
            title: "Send written objection within one month",
            description:
              "If you object, notify the landlord in writing within one month after receiving the notice and keep proof of delivery.",
            timingLabel: "Within 1 month of receiving notice",
            urgency: "high",
            stepType: "source_based",
          },
        ],
        availableDocuments: ["formal_notice", "filing_prep_packet"],
        missingInformation: ["Date notice was received", "Current rent amount", "Proposed new rent"],
        keyFacts: [
          "Write down the exact date you received the notice.",
          "If you object, respond in writing within one month after receiving the notice.",
          "Keep proof of your response.",
        ],
        trustedResources: [
          {
            name: "Tribunal administratif du logement",
            url: "https://www.tal.gouv.qc.ca/en/",
            description: "Quebec's housing tribunal and official housing forms.",
          },
        ],
        disclaimer:
          "Lawly is not a lawyer. This is legal information, not legal advice. Verify deadlines, forms, and the correct filing path before taking action.",
      },
    },
  ],
};

export function getFakeUser(): UserProfile {
  return FAKE_USER;
}

export function getUserCases(): SavedCase[] {
  return FAKE_USER.cases;
}

export function getCaseById(id: string): SavedCase | undefined {
  return FAKE_USER.cases.find((c) => c.id === id);
}

export function getActiveCases(): SavedCase[] {
  return FAKE_USER.cases.filter((c) => c.status === "active");
}

export function getResolvedCases(): SavedCase[] {
  return FAKE_USER.cases.filter((c) => c.status === "resolved");
}

export function getArchivedCases(): SavedCase[] {
  return FAKE_USER.cases.filter((c) => c.status === "archived");
}
