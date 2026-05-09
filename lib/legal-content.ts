// /lib/legal-content.ts
// Lawly verified legal library for MVP.
// Source of truth: this file, NOT Gemini.
// Gemini/Vertex AI must ONLY explain, format, and personalize this content.

export type Language = "en" | "fr";

export type SupportedScenarioId =
  | "housing_deposit"
  | "housing_repairs"
  | "housing_rent_increase"
  | "housing_eviction_notice";

export type UnsupportedScenarioId =
  | "unsupported_work"
  | "unsupported_consumer"
  | "unsupported_government"
  | "unsupported_family"
  | "unsupported_immigration"
  | "unsupported_criminal"
  | "unsupported_debt"
  | "unsupported_school"
  | "unsupported_unknown";

export type ScenarioId = SupportedScenarioId | UnsupportedScenarioId;

export type LegalCategory =
  | "housing"
  | "work"
  | "consumer"
  | "government"
  | "family"
  | "immigration"
  | "criminal"
  | "debt"
  | "school"
  | "unknown";

export type VerifiedCitation = {
  id: string;
  sourceName: string;
  articleOrPage: string;
  title: string;
  sourceUrl: string;
  verifiedFrom: string;
  authorityType: "principal" | "supporting";
  exactExcerptEn: string;
  exactExcerptFr?: string;
  approvedPlainRuleEn: string;
  approvedPlainRuleFr: string;
};

export type TimelineStep = {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  timingLabelEn?: string;
  timingLabelFr?: string;
  urgency: "low" | "medium" | "high";
};

export type TrustedResource = {
  name: string;
  url: string;
  descriptionEn: string;
  descriptionFr: string;
};

export type LegalScenario = {
  id: SupportedScenarioId;
  category: "housing";
  supported: true;
  titleEn: string;
  titleFr: string;
  userProblemExamples: string[];
  keywords: string[];
  requiredFacts: string[];
  approvedSummaryEn: string;
  approvedSummaryFr: string;
  approvedLegalStepsEn: string[];
  approvedLegalStepsFr: string[];
  allowedCitations: VerifiedCitation[];
  timelineSteps: TimelineStep[];
  availableDocuments: Array<"formal_notice" | "filing_prep_packet">;
  trustedResources: TrustedResource[];
  disclaimerEn: string;
  disclaimerFr: string;
};

export const DEFAULT_DISCLAIMER_EN =
  "Lawly is not a lawyer. This is legal information, not legal advice. Verify deadlines, forms, and the correct filing path before taking action.";

export const DEFAULT_DISCLAIMER_FR =
  "Lawly n’est pas un avocat. Ceci est de l’information juridique, pas un avis juridique. Vérifiez les délais, les formulaires et le bon recours avant d’agir.";

export const trustedResources: Record<string, TrustedResource> = {
  educaloi: {
    name: "Éducaloi",
    url: "https://educaloi.qc.ca/en/",
    descriptionEn: "Plain-language legal information for people in Quebec.",
    descriptionFr: "Information juridique en langage clair pour les personnes au Québec."
  },
  tal: {
    name: "Tribunal administratif du logement",
    url: "https://www.tal.gouv.qc.ca/en/",
    descriptionEn: "Quebec’s housing tribunal and official housing forms/resources.",
    descriptionFr: "Tribunal du logement au Québec et formulaires/ressources officiels."
  },
  rclalq: {
    name: "RCLALQ",
    url: "https://rclalq.qc.ca/",
    descriptionEn: "Network of tenant associations and housing committees in Quebec.",
    descriptionFr: "Regroupement de comités logement et d’associations de locataires au Québec."
  },
  quebecSmallClaims: {
    name: "Québec Small Claims",
    url: "https://www.quebec.ca/en/justice-and-civil-status/small-claims",
    descriptionEn: "Official Quebec information about small claims.",
    descriptionFr: "Information officielle du Québec sur les petites créances."
  },
  cnesst: {
    name: "CNESST",
    url: "https://www.cnesst.gouv.qc.ca/",
    descriptionEn: "Quebec labour standards, workplace rights, and pay-related resources.",
    descriptionFr: "Normes du travail, droits au travail et ressources sur le salaire au Québec."
  },
  opc: {
    name: "Office de la protection du consommateur",
    url: "https://www.opc.gouv.qc.ca/",
    descriptionEn: "Quebec consumer protection information and complaint guidance.",
    descriptionFr: "Information et recours en matière de protection du consommateur au Québec."
  },
  barreau: {
    name: "Barreau du Québec",
    url: "https://www.barreau.qc.ca/en/general-public/access-justice/access-justice-resources/",
    descriptionEn: "Access-to-justice resources and ways to find legal help.",
    descriptionFr: "Ressources d’accès à la justice et moyens de trouver de l’aide juridique."
  }
};

export const housingScenarios: Record<SupportedScenarioId, LegalScenario> = {
  housing_deposit: {
    id: "housing_deposit",
    category: "housing",
    supported: true,
    titleEn: "Security deposit or money demanded by landlord",
    titleFr: "Dépôt ou somme demandée par le propriétaire",
    userProblemExamples: [
      "My landlord kept my security deposit.",
      "I paid a damage deposit and want it back.",
      "My landlord asked for first and last month rent.",
      "My landlord asked me for a key deposit."
    ],
    keywords: [
      "deposit", "security deposit", "damage deposit", "key deposit", "first and last",
      "landlord kept", "dépôt", "caution", "premier et dernier mois", "dépôt de garantie"
    ],
    requiredFacts: [
      "tenantName", "tenantAddress", "landlordName", "landlordAddress",
      "unitAddress", "depositAmount", "datePaid", "moveOutDate",
      "landlordReason", "proofAvailable"
    ],
    approvedSummaryEn:
      "This looks like a Quebec residential lease deposit issue. The verified rule Lawly can rely on is that a lessor cannot require an amount of money other than rent, whether as a deposit or otherwise. Lawly can help prepare a formal notice asking for the return of the amount paid.",
    approvedSummaryFr:
      "Cela ressemble à un problème de dépôt dans un bail résidentiel au Québec. La règle vérifiée utilisée par Lawly est que le locateur ne peut pas exiger une somme d’argent autre que le loyer, sous forme de dépôt ou autrement. Lawly peut aider à préparer une mise en demeure demandant le remboursement de la somme payée.",
    approvedLegalStepsEn: [
      "Gather proof of the payment, lease, messages, and move-out condition.",
      "Send a formal notice demanding return of the deposit.",
      "Give a clear response deadline in the notice.",
      "If there is no response, contact a tenant association or legal clinic and verify the correct filing path before filing."
    ],
    approvedLegalStepsFr: [
      "Rassembler la preuve de paiement, le bail, les messages et l’état du logement au départ.",
      "Envoyer une mise en demeure demandant le remboursement du dépôt.",
      "Indiquer un délai clair de réponse dans la mise en demeure.",
      "S’il n’y a pas de réponse, contacter un comité logement ou une clinique juridique et vérifier le bon recours avant de déposer une demande."
    ],
    allowedCitations: [
      {
        id: "ccq_1904",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1904 C.C.Q.",
        title: "Money other than rent / deposit",
        sourceUrl:
          "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1904",
        verifiedFrom: "Official LegisQuébec article 1904 page",
        authorityType: "principal",
        exactExcerptEn:
          "Nor may he exact any amount of money other than the rent, in the form of a deposit or otherwise",
        exactExcerptFr:
          "Il ne peut, non plus, exiger une somme d’argent autre que le loyer, sous forme de dépôt ou autrement",
        approvedPlainRuleEn:
          "A Quebec residential landlord cannot require a deposit or other amount of money beyond rent.",
        approvedPlainRuleFr:
          "Un propriétaire au Québec ne peut pas exiger un dépôt ou une autre somme en plus du loyer."
      }
    ],
    timelineSteps: [
      {
        id: "gather-proof",
        titleEn: "Gather proof",
        titleFr: "Rassemblez vos preuves",
        descriptionEn:
          "Keep the lease, proof of payment, messages, photos, and any written reason the landlord gave.",
        descriptionFr:
          "Gardez le bail, la preuve de paiement, les messages, les photos et toute raison écrite donnée par le propriétaire.",
        timingLabelEn: "Today — start now",
        timingLabelFr: "Aujourd’hui",
        urgency: "high"
      },
      {
        id: "send-notice",
        titleEn: "Send formal notice",
        titleFr: "Envoyez une mise en demeure",
        descriptionEn:
          "Send a formal written demand asking for the return of the deposit and keep proof of delivery.",
        descriptionFr:
          "Envoyez une demande écrite officielle demandant le remboursement du dépôt et gardez une preuve d’envoi.",
        timingLabelEn: "As soon as possible",
        timingLabelFr: "Dès que possible",
        urgency: "high"
      },
      {
        id: "wait-deadline",
        titleEn: "Wait for the deadline",
        titleFr: "Attendez l’échéance",
        descriptionEn:
          "Lawly’s template uses a clear deadline. Verify strategy before filing anything.",
        descriptionFr:
          "Le modèle Lawly utilise un délai clair. Vérifiez la stratégie avant tout dépôt officiel.",
        timingLabelEn: "Allow 10–15 days",
        timingLabelFr: "Prévoir 10–15 jours",
        urgency: "medium"
      },
      {
        id: "verify-file",
        titleEn: "Verify next filing path",
        titleFr: "Vérifiez le bon recours",
        descriptionEn:
          "If there is no response, contact a tenant association or legal clinic and confirm the correct forum/process.",
        descriptionFr:
          "S’il n’y a pas de réponse, contactez un comité logement ou une clinique juridique et confirmez le bon recours/processus.",
        timingLabelEn: "If no response by deadline",
        timingLabelFr: "Si aucune réponse",
        urgency: "medium"
      }
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [trustedResources.tal, trustedResources.educaloi, trustedResources.rclalq, trustedResources.quebecSmallClaims],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR
  },

  housing_repairs: {
    id: "housing_repairs",
    category: "housing",
    supported: true,
    titleEn: "Repairs, unsafe conditions, or habitability problem",
    titleFr: "Réparations, conditions dangereuses ou problème d’habitabilité",
    userProblemExamples: [
      "My apartment has mould.",
      "The landlord will not fix the heat.",
      "There is a serious water leak.",
      "The dwelling is unsafe."
    ],
    keywords: [
      "repair", "mold", "mould", "heat", "heating", "leak", "water damage",
      "infestation", "unsafe", "uninhabitable", "réparation", "moisissure",
      "chauffage", "fuite", "insalubre"
    ],
    requiredFacts: [
      "tenantName", "landlordName", "unitAddress", "problemDescription",
      "dateProblemStarted", "landlordNotified", "proofAvailable", "urgency"
    ],
    approvedSummaryEn:
      "This looks like a Quebec housing repair or habitability issue. The verified rules Lawly can rely on are that a lessor must deliver the leased property in good repair and maintain a dwelling in good habitable condition.",
    approvedSummaryFr:
      "Cela ressemble à un problème de réparation ou d’habitabilité au Québec. Les règles vérifiées utilisées par Lawly indiquent que le locateur doit délivrer le bien en bon état de réparation et maintenir le logement en bon état d’habitabilité.",
    approvedLegalStepsEn: [
      "Document the issue with dates, photos, videos, and messages.",
      "Notify the landlord in writing and keep proof.",
      "If the issue is urgent or not addressed, contact a tenant association, legal clinic, or the TAL for process-specific guidance."
    ],
    approvedLegalStepsFr: [
      "Documenter le problème avec dates, photos, vidéos et messages.",
      "Aviser le propriétaire par écrit et conserver une preuve.",
      "Si le problème est urgent ou non réglé, contacter un comité logement, une clinique juridique ou le TAL pour connaître la procédure."
    ],
    allowedCitations: [
      {
        id: "ccq_1854",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1854 C.C.Q.",
        title: "Lessor’s basic obligations",
        sourceUrl:
          "https://legisquebec.gouv.qc.ca/en/showversion/cs/CCQ-1991?code=se%3A1854",
        verifiedFrom: "Official LegisQuébec article 1854 page",
        authorityType: "principal",
        exactExcerptEn:
          "deliver the leased property to the lessee in a good state of repair in all respects",
        approvedPlainRuleEn:
          "The landlord must deliver the leased property in good repair and provide peaceable enjoyment.",
        approvedPlainRuleFr:
          "Le propriétaire doit délivrer le logement en bon état de réparation et assurer la jouissance paisible."
      },
      {
        id: "ccq_1910",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1910 C.C.Q.",
        title: "Good habitable condition",
        sourceUrl:
          "https://legisquebec.gouv.qc.ca/en/showversion/cs/CCQ-1991?code=se%3A1910",
        verifiedFrom: "Official LegisQuébec article 1910 page",
        authorityType: "principal",
        exactExcerptEn:
          "A lessor is bound to deliver a dwelling in good habitable condition",
        exactExcerptFr:
          "Le locateur est tenu de délivrer un logement en bon état d’habitabilité",
        approvedPlainRuleEn:
          "The landlord must deliver and maintain the dwelling in good habitable condition.",
        approvedPlainRuleFr:
          "Le propriétaire doit délivrer et maintenir le logement en bon état d’habitabilité."
      }
    ],
    timelineSteps: [
      {
        id: "document-problem",
        titleEn: "Document the problem",
        titleFr: "Documentez le problème",
        descriptionEn:
          "Take photos/videos, save messages, write dates, and describe how the problem affects the dwelling.",
        descriptionFr:
          "Prenez des photos/vidéos, gardez les messages, notez les dates et décrivez l’impact sur le logement.",
        timingLabelEn: "Today — dates matter",
        timingLabelFr: "Aujourd’hui — les dates comptent",
        urgency: "high"
      },
      {
        id: "notify-landlord",
        titleEn: "Notify landlord in writing",
        titleFr: "Avisez le propriétaire par écrit",
        descriptionEn:
          "Clearly describe the problem, ask for repair, and keep proof of delivery.",
        descriptionFr:
          "Décrivez clairement le problème, demandez une réparation et gardez une preuve d’envoi.",
        timingLabelEn: "In writing this week",
        timingLabelFr: "Par écrit cette semaine",
        urgency: "high"
      },
      {
        id: "escalate-repairs",
        titleEn: "Escalate if unresolved",
        titleFr: "Passez à l’étape suivante si non réglé",
        descriptionEn:
          "If the problem is not fixed or is urgent, get help from a tenant association, legal clinic, or TAL.",
        descriptionFr:
          "Si le problème n’est pas réglé ou est urgent, demandez de l’aide à un comité logement, une clinique juridique ou au TAL.",
        timingLabelEn: "If not fixed promptly",
        timingLabelFr: "Si non réglé rapidement",
        urgency: "medium"
      }
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [trustedResources.tal, trustedResources.educaloi, trustedResources.rclalq],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR
  },

  housing_rent_increase: {
    id: "housing_rent_increase",
    category: "housing",
    supported: true,
    titleEn: "Rent increase or lease modification",
    titleFr: "Hausse de loyer ou modification du bail",
    userProblemExamples: [
      "My landlord increased my rent.",
      "I got a lease modification notice.",
      "I want to refuse a rent increase."
    ],
    keywords: [
      "rent increase", "increase my rent", "lease modification", "renewal",
      "refuse increase", "hausse de loyer", "augmentation de loyer",
      "modification du bail", "renouvellement"
    ],
    requiredFacts: [
      "tenantName", "landlordName", "unitAddress", "noticeReceivedDate",
      "leaseEndDate", "currentRent", "newRent", "tenantResponse"
    ],
    approvedSummaryEn:
      "This looks like a rent increase or lease modification issue. The verified rules Lawly can rely on are that the landlord must give notice within the required period, and a tenant who objects must notify the landlord within one month after receiving the notice.",
    approvedSummaryFr:
      "Cela ressemble à une hausse de loyer ou une modification du bail. Les règles vérifiées utilisées par Lawly indiquent que le propriétaire doit donner l’avis dans les délais prévus, et qu’un locataire qui refuse doit aviser le propriétaire dans le mois suivant la réception de l’avis.",
    approvedLegalStepsEn: [
      "Find the date you received the notice.",
      "Compare the notice timing with the end date of your lease.",
      "If you object, respond in writing within one month after receiving the notice.",
      "Keep proof of your response."
    ],
    approvedLegalStepsFr: [
      "Trouver la date de réception de l’avis.",
      "Comparer le délai de l’avis avec la date de fin du bail.",
      "Si vous refusez, répondre par écrit dans le mois suivant la réception de l’avis.",
      "Conserver une preuve de votre réponse."
    ],
    allowedCitations: [
      {
        id: "ccq_1942",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1942 C.C.Q.",
        title: "Notice period for lease modification",
        sourceUrl:
          "https://www.legisquebec.gouv.qc.ca/fr/version/lc/CCQ-1991?code=se%3A1942&langCont=en",
        verifiedFrom: "Official LegisQuébec article 1942 page",
        authorityType: "principal",
        exactExcerptEn:
          "not less than three months nor more than six months before term",
        approvedPlainRuleEn:
          "For a lease of 12 months or more, the landlord’s modification notice must generally be 3 to 6 months before the end of the lease.",
        approvedPlainRuleFr:
          "Pour un bail de 12 mois ou plus, l’avis de modification doit généralement être donné de 3 à 6 mois avant la fin du bail."
      },
      {
        id: "ccq_1945",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1945 C.C.Q.",
        title: "Tenant objection deadline",
        sourceUrl:
          "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1945",
        verifiedFrom: "Official LegisQuébec article 1945 page",
        authorityType: "principal",
        exactExcerptEn:
          "within one month after receiving the notice of modification of the lease",
        approvedPlainRuleEn:
          "A tenant who objects to the proposed modification must notify the landlord within one month after receiving the notice.",
        approvedPlainRuleFr:
          "Le locataire qui refuse la modification proposée doit aviser le propriétaire dans le mois suivant la réception de l’avis."
      }
    ],
    timelineSteps: [
      {
        id: "check-notice-date",
        titleEn: "Check when you received the notice",
        titleFr: "Vérifiez quand vous avez reçu l’avis",
        descriptionEn:
          "Write down the exact date you received the rent increase or lease modification notice.",
        descriptionFr:
          "Notez la date exacte de réception de l’avis de hausse ou de modification.",
        timingLabelEn: "Today — 1-month clock starts now",
        timingLabelFr: "Aujourd’hui — le délai d’un mois commence",
        urgency: "high"
      },
      {
        id: "send-response",
        titleEn: "Send written response",
        titleFr: "Envoyez une réponse écrite",
        descriptionEn:
          "If you object, notify the landlord within one month after receiving the notice and keep proof.",
        descriptionFr:
          "Si vous refusez, avisez le propriétaire dans le mois suivant la réception de l’avis et gardez une preuve.",
        timingLabelEn: "Within 1 month",
        timingLabelFr: "Dans le mois",
        urgency: "high"
      }
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [trustedResources.tal, trustedResources.educaloi, trustedResources.rclalq],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR
  },

  housing_eviction_notice: {
    id: "housing_eviction_notice",
    category: "housing",
    supported: true,
    titleEn: "Eviction or repossession notice",
    titleFr: "Avis d’éviction ou de reprise",
    userProblemExamples: [
      "My landlord says they want to repossess the apartment.",
      "I got an eviction notice.",
      "My landlord wants me to leave so family can move in."
    ],
    keywords: [
      "eviction", "evict", "repossession", "repossess", "notice to leave",
      "landlord wants to move in", "éviction", "reprise", "avis de quitter",
      "reprendre le logement"
    ],
    requiredFacts: [
      "tenantName", "landlordName", "unitAddress", "noticeReceivedDate",
      "leaseEndDate", "reasonGiven", "whoWillLiveThere"
    ],
    approvedSummaryEn:
      "This looks like a repossession or eviction notice issue. The verified rules Lawly can rely on include who a landlord may repossess a dwelling for, and minimum notice periods for repossession or eviction. Because eviction/repo situations can be high-stakes, Lawly should recommend getting help quickly.",
    approvedSummaryFr:
      "Cela ressemble à un problème d’avis de reprise ou d’éviction. Les règles vérifiées utilisées par Lawly incluent les personnes pour lesquelles un propriétaire peut reprendre un logement et les délais minimaux d’avis. Comme ces situations peuvent être graves, Lawly devrait recommander de demander de l’aide rapidement.",
    approvedLegalStepsEn: [
      "Do not ignore the notice.",
      "Save the notice and write down the date you received it.",
      "Check the stated reason and the proposed move-out date.",
      "Contact a tenant association, legal clinic, or the TAL quickly before responding or moving."
    ],
    approvedLegalStepsFr: [
      "N’ignorez pas l’avis.",
      "Gardez l’avis et notez la date de réception.",
      "Vérifiez la raison indiquée et la date proposée.",
      "Contactez rapidement un comité logement, une clinique juridique ou le TAL avant de répondre ou de déménager."
    ],
    allowedCitations: [
      {
        id: "ccq_1957",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1957 C.C.Q.",
        title: "Persons for whom a landlord may repossess",
        sourceUrl:
          "https://www.legisquebec.gouv.qc.ca/en/version/cs/CCQ-1991?code=se%3A1957",
        verifiedFrom: "Official LegisQuébec article 1957 page",
        authorityType: "supporting",
        exactExcerptEn:
          "may repossess it as a residence for himself or herself or for ascendants or descendants",
        approvedPlainRuleEn:
          "A landlord-owner may repossess a dwelling for themselves or certain close family/support relationships.",
        approvedPlainRuleFr:
          "Un propriétaire peut reprendre un logement pour lui-même ou certaines personnes proches prévues par la loi."
      },
      {
        id: "ccq_1960",
        sourceName: "Civil Code of Québec",
        articleOrPage: "Article 1960 C.C.Q.",
        title: "Notice period for repossession or eviction",
        sourceUrl:
          "https://www.legisquebec.gouv.qc.ca/fr/version/lc/ccq-1991?code=se%3A1960&langCont=en",
        verifiedFrom: "Official LegisQuébec article 1960 page",
        authorityType: "principal",
        exactExcerptEn:
          "at least six months before the expiry of the lease in the case of a lease with a fixed term",
        approvedPlainRuleEn:
          "For a fixed-term lease longer than six months, the landlord must generally give at least six months’ notice before the lease ends.",
        approvedPlainRuleFr:
          "Pour un bail à durée fixe de plus de six mois, le propriétaire doit généralement donner un avis au moins six mois avant la fin du bail."
      }
    ],
    timelineSteps: [
      {
        id: "save-notice",
        titleEn: "Save the notice",
        titleFr: "Gardez l’avis",
        descriptionEn:
          "Keep the notice and write down the exact date you received it.",
        descriptionFr:
          "Conservez l’avis et notez la date exacte de réception.",
        timingLabelEn: "Immediately",
        timingLabelFr: "Immédiatement",
        urgency: "high"
      },
      {
        id: "check-reason",
        titleEn: "Check the reason and deadline",
        titleFr: "Vérifiez la raison et le délai",
        descriptionEn:
          "Look at who the landlord says will use the dwelling and the date they want possession.",
        descriptionFr:
          "Vérifiez qui, selon le propriétaire, utilisera le logement et la date demandée.",
        timingLabelEn: "Today — deadlines are strict",
        timingLabelFr: "Aujourd’hui — les délais sont stricts",
        urgency: "high"
      },
      {
        id: "get-help",
        titleEn: "Get help before responding",
        titleFr: "Demandez de l’aide avant de répondre",
        descriptionEn:
          "Repossession/eviction can be high-stakes. Contact a tenant association, legal clinic, or TAL before deciding what to do.",
        descriptionFr:
          "Une reprise/éviction peut être importante. Contactez un comité logement, une clinique juridique ou le TAL avant de décider quoi faire.",
        timingLabelEn: "Before any deadline passes",
        timingLabelFr: "Avant tout délai",
        urgency: "high"
      }
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [trustedResources.tal, trustedResources.educaloi, trustedResources.rclalq],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR
  }
};
