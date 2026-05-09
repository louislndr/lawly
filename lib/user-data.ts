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

// Fake user data with sample cases
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
      category: "Housing & Tenant Rights",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "active",
      analysis: {
        supported: true,
        scenarioId: "housing_deposit",
        category: "Housing & Tenant Rights",
        plainLanguageSummary:
          "In Quebec, landlords must return security deposits within 30 days or provide written reasons for deductions. If your landlord is withholding your full deposit without justification, you have legal recourse.",
        rightsExplanation:
          "You have the right to a full return of your security deposit if your rental unit is in good condition (normal wear and tear excepted). Landlords can only deduct for damages beyond normal use.",
        citations: [
          {
            label: "Civil Code of Quebec",
            sourceName: "Quebec Civil Code",
            articleOrPage: "Article 1942-1948",
            sourceUrl: "https://laws-lois.justice.gc.ca",
            exactExcerpt: "The lessor shall return the sum deposited...",
            plainRule: "Landlord must return deposit within 30 days",
          },
        ],
        nextSteps: [
          {
            title: "Send formal demand letter",
            description: "Send a certified letter requesting the return of your deposit with 10 days to respond",
            timingLabel: "Within 2 weeks",
            urgency: "high",
          },
          {
            title: "File complaint with Tribunal",
            description: "If not resolved, file a complaint with the rental tribunal",
            timingLabel: "Within 1 month of demand",
            urgency: "high",
          },
        ],
        availableDocuments: [
          "Lease agreement",
          "Photos of property condition",
          "Proof of payment (deposit check/receipt)",
          "Correspondence with landlord",
        ],
        missingInformation: ["Documentation of property condition upon move-out", "Landlord's written response"],
        keyFacts: [
          "Deposit was $1,200",
          "Moved out on May 5, 2026",
          "No written explanation provided",
        ],
        trustedResources: [
          {
            name: "Regie du logement du Quebec",
            url: "https://www.reviseur.qc.ca",
            description: "Official Quebec rental tribunal",
          },
          {
            name: "Community Legal Clinic",
            url: "https://www.legal-aid.qc.ca",
            description: "Free legal aid services",
          },
        ],
        disclaimer: "This is legal information, not legal advice. Consult with a lawyer for your specific situation.",
      },
    },
    {
      id: "case_002",
      problem: "I was wrongfully terminated from my job without notice or severance",
      category: "Employment Rights",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "active",
      analysis: {
        supported: true,
        scenarioId: "employment_termination",
        category: "Employment Rights",
        plainLanguageSummary:
          "In Quebec, employers must provide proper notice or pay severance when terminating employment. Wrongful termination claims require showing the dismissal was without cause and without proper procedures.",
        rightsExplanation:
          "You have the right to either notice period (usually 2 weeks) or severance pay equal to at least 2 weeks of wages. If terminated without cause and without notice, you may claim damages.",
        citations: [
          {
            label: "Quebec Labor Standards",
            sourceName: "An Act respecting Labour Standards",
            articleOrPage: "Section 82",
            sourceUrl: "https://legisquebec.gouv.qc.ca",
            exactExcerpt: "An employer shall give written notice...",
            plainRule: "Two weeks notice required for termination",
          },
        ],
        nextSteps: [
          {
            title: "Gather documentation",
            description: "Collect all termination documents, employment contract, pay stubs, and communications",
            timingLabel: "Immediately",
            urgency: "high",
          },
          {
            title: "Consult employment lawyer",
            description: "Get a free consultation to assess your case",
            timingLabel: "Within 2 weeks",
            urgency: "high",
          },
        ],
        availableDocuments: [
          "Employment contract",
          "Termination letter",
          "Pay stubs",
          "Email communications",
        ],
        missingInformation: [
          "Medical reports (if health-related)",
          "Performance evaluations",
          "Witness statements",
        ],
        keyFacts: ["Employed for 3 years", "No written cause provided", "No severance offered"],
        trustedResources: [
          {
            name: "Quebec Commission des normes, de l'équité...",
            url: "https://www.cnt.gouv.qc.ca",
            description: "Labor standards authority",
          },
          {
            name: "Pro Bono Lawyers Network",
            url: "https://www.barreau.qc.ca",
            description: "Find legal assistance",
          },
        ],
        disclaimer: "Employment law is complex. This information is not a substitute for legal advice.",
      },
    },
    {
      id: "case_003",
      problem: "I received a discrimination complaint at my workplace",
      category: "Discrimination & Harassment",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "resolved",
      analysis: {
        supported: true,
        scenarioId: "workplace_discrimination",
        category: "Discrimination & Harassment",
        plainLanguageSummary:
          "Workplace discrimination based on protected grounds (age, race, gender, disability, etc.) is illegal in Quebec. You have the right to file a complaint and seek remedies.",
        rightsExplanation:
          "The Quebec Human Rights Commission protects individuals from discrimination. Both employers and employees can file complaints alleging discriminatory conduct.",
        citations: [
          {
            label: "Quebec Charter of Human Rights",
            sourceName: "Charter of human rights and freedoms",
            articleOrPage: "Articles 10-16",
            sourceUrl: "https://legisquebec.gouv.qc.ca",
            exactExcerpt: "Every person has a right to...",
            plainRule: "Protection against discrimination in employment",
          },
        ],
        nextSteps: [
          {
            title: "Document all incidents",
            description: "Create detailed record of discriminatory behavior with dates and witnesses",
            timingLabel: "Ongoing",
            urgency: "high",
          },
          {
            title: "Report to HR",
            description: "File formal complaint with your employer's human resources",
            timingLabel: "Within 2 weeks",
            urgency: "high",
          },
        ],
        availableDocuments: [
          "Incident log",
          "Emails and messages",
          "Witness contact information",
          "HR policies",
        ],
        missingInformation: [
          "Formal responses from HR",
          "Investigation report",
          "Legal analysis of discrimination claims",
        ],
        keyFacts: ["Multiple incidents over 6 months", "Affects work performance", "Other employees affected"],
        trustedResources: [
          {
            name: "Quebec Human Rights Commission",
            url: "https://www.cdpdj.qc.ca",
            description: "Official agency for human rights complaints",
          },
          {
            name: "Worker Advocacy Center",
            url: "https://www.caj.ca",
            description: "Support for workers facing discrimination",
          },
        ],
        disclaimer: "Discrimination law is specialized. Professional legal guidance is recommended.",
      },
    },
    {
      id: "case_004",
      problem: "Neighbor's tree branches hanging over my property - causing damage",
      category: "Property Rights",
      createdAt: "2026-05-09",
      lastModified: "2026-05-09",
      status: "active",
      analysis: {
        supported: false,
        category: "Property Rights",
        plainLanguageSummary:
          "While property disputes over encroaching trees are common, Quebec property law addresses this through different mechanisms. Here's what you need to know.",
        safeOrientation:
          "Tree disputes often require both legal and practical solutions. Document the damage and try negotiation first.",
        nextSteps: [
          {
            title: "Take photographs of damage",
            description: "Document all damage caused by the branches and overhanging foliage",
            urgency: "medium",
          },
          {
            title: "Send formal written notice",
            description: "Write to your neighbor requesting they trim the branches within 30 days",
            urgency: "medium",
          },
        ],
        documentsToGather: [
          "Property deed or certificate",
          "Photos of damage",
          "Repair estimates",
          "Records of prior complaints",
        ],
        questionsToAsk: [
          "Is the neighbor willing to negotiate?",
          "What is the extent of the damage?",
          "When did this problem start?",
          "Have you attempted to communicate?",
        ],
        trustedResources: [
          {
            name: "Quebec Property Law Guide",
            url: "https://legisquebec.gouv.qc.ca",
            description: "Civil code provisions on property",
          },
          {
            name: "Mediation Services",
            url: "https://www.mediation.qc.ca",
            description: "Alternative dispute resolution",
          },
        ],
        documentOptions: [
          "Property survey",
          "Arborist assessment",
          "Contractor quotes for repairs",
        ],
        disclaimer:
          "Property disputes can become complex. Consider mediation before pursuing legal action.",
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
