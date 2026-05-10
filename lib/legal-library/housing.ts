// Verified Quebec housing law scenarios loaded into Lawly.
// Source hierarchy: Civil Code of Québec (LegisQuébec) → TAL → Québec.ca → Éducaloi
// Gemini must only use content in this file. It may never add citations, rules,
// deadlines, forms, court names, or procedures that are not explicitly listed here.

import { VerifiedCitation, CCQ_ARTICLES } from "./quebec-civil-code";

export type TimelineStepType =
  | "source_based"        // directly derived from a verified legal source
  | "practical_next_step" // recommended action, not cited in a law article
  | "needs_verification"; // involves a filing or procedure — confirm before acting

export type TimelineStep = {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  timingLabelEn?: string;
  timingLabelFr?: string;
  urgency: "low" | "medium" | "high";
  stepType: TimelineStepType;
};

export type TrustedResource = {
  name: string;
  url: string;
  descriptionEn: string;
  descriptionFr: string;
};

export type SupportedScenarioId =
  | "housing_deposit"
  | "housing_repairs"
  | "housing_rent_increase"
  | "housing_eviction_notice";

export type LegalCategory =
  | "housing"
  | "work"
  | "consumer"
  | "government_notice"
  | "family"
  | "immigration"
  | "criminal"
  | "debt"
  | "school"
  | "unknown";

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
  "Lawly n'est pas un avocat. Ceci est de l'information juridique, pas un avis juridique. Vérifiez les délais, les formulaires et le bon recours avant d'agir.";

export const trustedResources: Record<string, TrustedResource> = {
  educaloi: {
    name: "Éducaloi",
    url: "https://educaloi.qc.ca/en/",
    descriptionEn: "Plain-language legal information for people in Quebec.",
    descriptionFr:
      "Information juridique en langage clair pour les personnes au Québec.",
  },
  tal: {
    name: "Tribunal administratif du logement",
    url: "https://www.tal.gouv.qc.ca/en/",
    descriptionEn:
      "Quebec's housing tribunal and official housing forms and resources.",
    descriptionFr:
      "Tribunal du logement au Québec et formulaires/ressources officiels.",
  },
  rclalq: {
    name: "RCLALQ",
    url: "https://rclalq.qc.ca/",
    descriptionEn:
      "Network of tenant associations and housing committees in Quebec.",
    descriptionFr:
      "Regroupement de comités logement et d'associations de locataires au Québec.",
  },
  quebecSmallClaims: {
    name: "Québec Small Claims",
    url: "https://www.quebec.ca/en/justice-and-civil-status/small-claims",
    descriptionEn: "Official Quebec information about small claims.",
    descriptionFr:
      "Information officielle du Québec sur les petites créances.",
  },
  cnesst: {
    name: "CNESST",
    url: "https://www.cnesst.gouv.qc.ca/",
    descriptionEn:
      "Quebec labour standards, workplace rights, and pay-related resources.",
    descriptionFr:
      "Normes du travail, droits au travail et ressources sur le salaire au Québec.",
  },
  opc: {
    name: "Office de la protection du consommateur",
    url: "https://www.opc.gouv.qc.ca/",
    descriptionEn:
      "Quebec consumer protection information and complaint guidance.",
    descriptionFr:
      "Information et recours en matière de protection du consommateur au Québec.",
  },
  barreau: {
    name: "Barreau du Québec",
    url: "https://www.barreau.qc.ca/en/general-public/access-justice/access-justice-resources/",
    descriptionEn: "Access-to-justice resources and ways to find legal help.",
    descriptionFr:
      "Ressources d'accès à la justice et moyens de trouver de l'aide juridique.",
  },
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
      "My landlord asked me for a key deposit.",
    ],
    keywords: [
      "deposit",
      "security deposit",
      "damage deposit",
      "key deposit",
      "first and last",
      "landlord kept",
      "dépôt",
      "caution",
      "premier et dernier mois",
      "dépôt de garantie",
    ],
    requiredFacts: [
      "tenantName",
      "tenantAddress",
      "landlordName",
      "landlordAddress",
      "unitAddress",
      "depositAmount",
      "datePaid",
      "moveOutDate",
      "landlordReason",
      "proofAvailable",
    ],
    approvedSummaryEn:
      "This looks like a Quebec residential lease deposit issue. The verified rule Lawly can rely on is that a lessor cannot require an amount of money other than rent, whether as a deposit or otherwise. Lawly can help prepare a formal notice asking for the return of the amount paid.",
    approvedSummaryFr:
      "Cela ressemble à un problème de dépôt dans un bail résidentiel au Québec. La règle vérifiée utilisée par Lawly est que le locateur ne peut pas exiger une somme d'argent autre que le loyer, sous forme de dépôt ou autrement. Lawly peut aider à préparer une mise en demeure demandant le remboursement de la somme payée.",
    approvedLegalStepsEn: [
      "Gather proof of the payment, lease, messages, and move-out condition.",
      "Send a formal notice demanding return of the deposit.",
      "Give a clear response deadline in the notice.",
      "If there is no response, contact a tenant association or legal clinic and verify the correct filing path before filing.",
    ],
    approvedLegalStepsFr: [
      "Rassembler la preuve de paiement, le bail, les messages et l'état du logement au départ.",
      "Envoyer une mise en demeure demandant le remboursement du dépôt.",
      "Indiquer un délai clair de réponse dans la mise en demeure.",
      "S'il n'y a pas de réponse, contacter un comité logement ou une clinique juridique et vérifier le bon recours avant de déposer une demande.",
    ],
    allowedCitations: [CCQ_ARTICLES.art_1904],
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
        timingLabelFr: "Aujourd'hui",
        urgency: "high",
        stepType: "practical_next_step",
      },
      {
        id: "send-notice",
        titleEn: "Send formal notice",
        titleFr: "Envoyez une mise en demeure",
        descriptionEn:
          "Send a formal written demand asking for the return of the deposit and keep proof of delivery.",
        descriptionFr:
          "Envoyez une demande écrite officielle demandant le remboursement du dépôt et gardez une preuve d'envoi.",
        timingLabelEn: "As soon as possible",
        timingLabelFr: "Dès que possible",
        urgency: "high",
        stepType: "practical_next_step",
      },
      {
        id: "wait-deadline",
        titleEn: "Wait for the deadline",
        titleFr: "Attendez l'échéance",
        descriptionEn:
          "Lawly's template uses a clear deadline. Verify the correct process before filing anything.",
        descriptionFr:
          "Le modèle Lawly utilise un délai clair. Vérifiez la stratégie avant tout dépôt officiel.",
        timingLabelEn: "Allow 10–15 days",
        timingLabelFr: "Prévoir 10–15 jours",
        urgency: "medium",
        stepType: "practical_next_step",
      },
      {
        id: "verify-filing",
        titleEn: "Verify the correct filing path",
        titleFr: "Vérifiez le bon recours",
        descriptionEn:
          "If there is no response, contact a tenant association or legal clinic and confirm the correct forum and process before filing anything official.",
        descriptionFr:
          "S'il n'y a pas de réponse, contactez un comité logement ou une clinique juridique et confirmez le bon recours et la bonne procédure avant tout dépôt officiel.",
        timingLabelEn: "If no response by deadline",
        timingLabelFr: "Si aucune réponse",
        urgency: "medium",
        stepType: "needs_verification",
      },
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [
      trustedResources.tal,
      trustedResources.educaloi,
      trustedResources.rclalq,
      trustedResources.quebecSmallClaims,
    ],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR,
  },

  housing_repairs: {
    id: "housing_repairs",
    category: "housing",
    supported: true,
    titleEn: "Repairs, unsafe conditions, or habitability problem",
    titleFr: "Réparations, conditions dangereuses ou problème d'habitabilité",
    userProblemExamples: [
      "My apartment has mould.",
      "The landlord will not fix the heat.",
      "There is a serious water leak.",
      "The dwelling is unsafe.",
    ],
    keywords: [
      "repair",
      "mold",
      "mould",
      "heat",
      "heating",
      "leak",
      "water damage",
      "infestation",
      "unsafe",
      "uninhabitable",
      "réparation",
      "moisissure",
      "chauffage",
      "fuite",
      "insalubre",
    ],
    requiredFacts: [
      "tenantName",
      "landlordName",
      "unitAddress",
      "problemDescription",
      "dateProblemStarted",
      "landlordNotified",
      "proofAvailable",
      "urgency",
    ],
    approvedSummaryEn:
      "This looks like a Quebec housing repair or habitability issue. The verified rules Lawly can rely on are that a lessor must deliver the leased property in good repair and maintain a dwelling in good habitable condition.",
    approvedSummaryFr:
      "Cela ressemble à un problème de réparation ou d'habitabilité au Québec. Les règles vérifiées indiquent que le locateur doit délivrer le bien en bon état de réparation et maintenir le logement en bon état d'habitabilité.",
    approvedLegalStepsEn: [
      "Document the issue with dates, photos, videos, and messages.",
      "Notify the landlord in writing and keep proof.",
      "If the issue is urgent or not addressed, contact a tenant association, legal clinic, or the TAL for process-specific guidance.",
    ],
    approvedLegalStepsFr: [
      "Documenter le problème avec dates, photos, vidéos et messages.",
      "Aviser le propriétaire par écrit et conserver une preuve.",
      "Si le problème est urgent ou non réglé, contacter un comité logement, une clinique juridique ou le TAL pour connaître la procédure.",
    ],
    allowedCitations: [CCQ_ARTICLES.art_1854, CCQ_ARTICLES.art_1910],
    timelineSteps: [
      {
        id: "document-problem",
        titleEn: "Document the problem",
        titleFr: "Documentez le problème",
        descriptionEn:
          "Take photos and videos, save messages, write down dates, and describe how the problem affects your dwelling.",
        descriptionFr:
          "Prenez des photos/vidéos, gardez les messages, notez les dates et décrivez l'impact sur le logement.",
        timingLabelEn: "Today — dates matter",
        timingLabelFr: "Aujourd'hui — les dates comptent",
        urgency: "high",
        stepType: "practical_next_step",
      },
      {
        id: "notify-landlord",
        titleEn: "Notify landlord in writing",
        titleFr: "Avisez le propriétaire par écrit",
        descriptionEn:
          "Clearly describe the problem, request repair, set a reasonable deadline, and keep proof of delivery.",
        descriptionFr:
          "Décrivez clairement le problème, demandez une réparation, fixez un délai raisonnable et gardez une preuve d'envoi.",
        timingLabelEn: "In writing this week",
        timingLabelFr: "Par écrit cette semaine",
        urgency: "high",
        stepType: "practical_next_step",
      },
      {
        id: "escalate-repairs",
        titleEn: "Verify next steps if unresolved",
        titleFr: "Vérifiez les prochaines étapes si non réglé",
        descriptionEn:
          "If the problem is not fixed or is urgent, verify the correct process before filing. Contact a tenant association, legal clinic, or the TAL.",
        descriptionFr:
          "Si le problème n'est pas réglé ou est urgent, vérifiez la bonne procédure avant tout dépôt. Contactez un comité logement, une clinique juridique ou le TAL.",
        timingLabelEn: "If not fixed promptly",
        timingLabelFr: "Si non réglé rapidement",
        urgency: "medium",
        stepType: "needs_verification",
      },
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [
      trustedResources.tal,
      trustedResources.educaloi,
      trustedResources.rclalq,
    ],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR,
  },

  housing_rent_increase: {
    id: "housing_rent_increase",
    category: "housing",
    supported: true,
    titleEn: "Rent increase or lease modification notice",
    titleFr: "Avis de hausse de loyer ou de modification du bail",
    userProblemExamples: [
      "My landlord increased my rent.",
      "I got a lease modification notice.",
      "I want to refuse a rent increase.",
    ],
    keywords: [
      "rent increase",
      "increase my rent",
      "lease modification",
      "renewal",
      "refuse increase",
      "hausse de loyer",
      "augmentation de loyer",
      "modification du bail",
      "renouvellement",
    ],
    requiredFacts: [
      "tenantName",
      "landlordName",
      "unitAddress",
      "noticeReceivedDate",
      "leaseEndDate",
      "currentRent",
      "newRent",
      "tenantResponse",
    ],
    approvedSummaryEn:
      "This looks like a rent increase or lease modification issue. The verified rules Lawly can rely on are that the landlord must give notice within the required period, and a tenant who objects must notify the landlord within one month after receiving the notice.",
    approvedSummaryFr:
      "Cela ressemble à une hausse de loyer ou une modification du bail. Les règles vérifiées indiquent que le propriétaire doit donner l'avis dans les délais prévus, et qu'un locataire qui refuse doit aviser le propriétaire dans le mois suivant la réception de l'avis.",
    approvedLegalStepsEn: [
      "Write down the exact date you received the notice.",
      "Compare the notice timing against the end date of your lease.",
      "If you object, respond in writing within one month after receiving the notice.",
      "Keep proof of your response.",
    ],
    approvedLegalStepsFr: [
      "Notez la date exacte de réception de l'avis.",
      "Comparez le délai de l'avis avec la date de fin du bail.",
      "Si vous refusez, répondez par écrit dans le mois suivant la réception de l'avis.",
      "Conservez une preuve de votre réponse.",
    ],
    allowedCitations: [CCQ_ARTICLES.art_1942, CCQ_ARTICLES.art_1945],
    timelineSteps: [
      {
        id: "check-notice-date",
        titleEn: "Check the date you received the notice",
        titleFr: "Vérifiez la date de réception de l'avis",
        descriptionEn:
          "Write down the exact date you received the rent increase or lease modification notice. The one-month objection deadline (CCQ art. 1945) starts from this date.",
        descriptionFr:
          "Notez la date exacte de réception de l'avis de hausse ou de modification. Le délai d'un mois pour refuser (CCQ art. 1945) commence à cette date.",
        timingLabelEn: "Today — 1-month clock starts now",
        timingLabelFr: "Aujourd'hui — le délai d'un mois commence",
        urgency: "high",
        stepType: "source_based",
      },
      {
        id: "send-response",
        titleEn: "Send written objection within one month",
        titleFr: "Envoyez un refus écrit dans le mois",
        descriptionEn:
          "If you object, notify the landlord in writing within one month after receiving the notice (CCQ art. 1945) and keep proof of delivery.",
        descriptionFr:
          "Si vous refusez, avisez le propriétaire par écrit dans le mois suivant la réception de l'avis (CCQ art. 1945) et gardez une preuve d'envoi.",
        timingLabelEn: "Within 1 month of receiving notice",
        timingLabelFr: "Dans le mois suivant l'avis",
        urgency: "high",
        stepType: "source_based",
      },
      {
        id: "verify-process",
        titleEn: "Verify next steps",
        titleFr: "Vérifiez les prochaines étapes",
        descriptionEn:
          "For what happens after your objection, verify the correct process before filing. Contact a tenant association or the TAL.",
        descriptionFr:
          "Pour la suite après votre refus, vérifiez la bonne procédure avant tout dépôt. Contactez un comité logement ou le TAL.",
        timingLabelEn: "After sending your objection",
        timingLabelFr: "Après envoi de votre refus",
        urgency: "medium",
        stepType: "needs_verification",
      },
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [
      trustedResources.tal,
      trustedResources.educaloi,
      trustedResources.rclalq,
    ],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR,
  },

  housing_eviction_notice: {
    id: "housing_eviction_notice",
    category: "housing",
    supported: true,
    titleEn: "Eviction or repossession notice",
    titleFr: "Avis d'éviction ou de reprise de logement",
    userProblemExamples: [
      "My landlord says they want to repossess the apartment.",
      "I got an eviction notice.",
      "My landlord wants me to leave so family can move in.",
    ],
    keywords: [
      "eviction",
      "evict",
      "repossession",
      "repossess",
      "notice to leave",
      "landlord wants to move in",
      "éviction",
      "reprise",
      "avis de quitter",
      "reprendre le logement",
    ],
    requiredFacts: [
      "tenantName",
      "landlordName",
      "unitAddress",
      "noticeReceivedDate",
      "leaseEndDate",
      "reasonGiven",
      "whoWillLiveThere",
    ],
    approvedSummaryEn:
      "This looks like a repossession or eviction notice issue. The verified rules Lawly can rely on include who a landlord may repossess a dwelling for, and minimum notice periods. Because eviction and repossession situations can be high-stakes, Lawly recommends getting help quickly.",
    approvedSummaryFr:
      "Cela ressemble à un problème d'avis de reprise ou d'éviction. Les règles vérifiées incluent les personnes pour lesquelles un propriétaire peut reprendre un logement et les délais minimaux d'avis. Ces situations pouvant être importantes, Lawly recommande de demander de l'aide rapidement.",
    approvedLegalStepsEn: [
      "Do not ignore the notice.",
      "Save the notice and write down the exact date you received it.",
      "Check the stated reason and the proposed move-out date.",
      "Contact a tenant association, legal clinic, or the TAL quickly before responding or moving.",
    ],
    approvedLegalStepsFr: [
      "N'ignorez pas l'avis.",
      "Gardez l'avis et notez la date exacte de réception.",
      "Vérifiez la raison indiquée et la date proposée.",
      "Contactez rapidement un comité logement, une clinique juridique ou le TAL avant de répondre ou de déménager.",
    ],
    allowedCitations: [CCQ_ARTICLES.art_1957, CCQ_ARTICLES.art_1960],
    timelineSteps: [
      {
        id: "save-notice",
        titleEn: "Save the notice immediately",
        titleFr: "Conservez l'avis immédiatement",
        descriptionEn:
          "Keep the notice and write down the exact date you received it. Do not ignore it.",
        descriptionFr:
          "Conservez l'avis et notez la date exacte de réception. Ne l'ignorez pas.",
        timingLabelEn: "Immediately",
        timingLabelFr: "Immédiatement",
        urgency: "high",
        stepType: "practical_next_step",
      },
      {
        id: "check-reason",
        titleEn: "Check the reason and the notice period",
        titleFr: "Vérifiez la raison et le délai d'avis",
        descriptionEn:
          "Look at who the landlord says will use the dwelling (CCQ art. 1957) and confirm the date of possession they are requesting. For a fixed-term lease over six months, the landlord must generally give at least six months' notice (CCQ art. 1960).",
        descriptionFr:
          "Vérifiez qui, selon le propriétaire, utilisera le logement (CCQ art. 1957) et confirmez la date de reprise demandée. Pour un bail à durée fixe de plus de six mois, le propriétaire doit généralement donner un avis au moins six mois à l'avance (CCQ art. 1960).",
        timingLabelEn: "Today — deadlines are strict",
        timingLabelFr: "Aujourd'hui — les délais sont stricts",
        urgency: "high",
        stepType: "source_based",
      },
      {
        id: "get-help",
        titleEn: "Get help and verify the process before responding",
        titleFr: "Demandez de l'aide et vérifiez la procédure avant de répondre",
        descriptionEn:
          "Repossession and eviction can be high-stakes. Verify the correct process before filing or responding. Contact a tenant association, legal clinic, or the TAL.",
        descriptionFr:
          "Une reprise ou éviction peut être importante. Vérifiez la bonne procédure avant de déposer ou de répondre. Contactez un comité logement, une clinique juridique ou le TAL.",
        timingLabelEn: "Before any deadline passes",
        timingLabelFr: "Avant tout délai",
        urgency: "high",
        stepType: "needs_verification",
      },
    ],
    availableDocuments: ["formal_notice", "filing_prep_packet"],
    trustedResources: [
      trustedResources.tal,
      trustedResources.educaloi,
      trustedResources.rclalq,
    ],
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
    disclaimerFr: DEFAULT_DISCLAIMER_FR,
  },
};
