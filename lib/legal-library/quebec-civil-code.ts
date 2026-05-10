// Verified Civil Code of Québec (CCQ) articles loaded into Lawly.
// Source: Légis Québec — official Quebec statutes (legisquebec.gouv.qc.ca)
// Each entry is manually verified against the official source page.
// Do NOT add articles here without checking the official LegisQuébec text.

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

export const CCQ_ARTICLES: Record<string, VerifiedCitation> = {
  art_1904: {
    id: "ccq_1904",
    sourceName: "Civil Code of Québec",
    articleOrPage: "Article 1904 C.C.Q.",
    title: "Money other than rent / deposit prohibition",
    sourceUrl:
      "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1904",
    verifiedFrom: "Official LegisQuébec article 1904 page",
    authorityType: "principal",
    exactExcerptEn:
      "Nor may he exact any amount of money other than the rent, in the form of a deposit or otherwise",
    exactExcerptFr:
      "Il ne peut, non plus, exiger une somme d'argent autre que le loyer, sous forme de dépôt ou autrement",
    approvedPlainRuleEn:
      "A Quebec residential landlord cannot require a deposit or any other amount of money beyond rent.",
    approvedPlainRuleFr:
      "Un propriétaire au Québec ne peut pas exiger un dépôt ou une autre somme en plus du loyer.",
  },

  art_1854: {
    id: "ccq_1854",
    sourceName: "Civil Code of Québec",
    articleOrPage: "Article 1854 C.C.Q.",
    title: "Lessor's basic obligations — good state of repair",
    sourceUrl:
      "https://legisquebec.gouv.qc.ca/en/showversion/cs/CCQ-1991?code=se%3A1854",
    verifiedFrom: "Official LegisQuébec article 1854 page",
    authorityType: "principal",
    exactExcerptEn:
      "deliver the leased property to the lessee in a good state of repair in all respects",
    approvedPlainRuleEn:
      "The landlord must deliver the leased property in good repair and provide peaceable enjoyment.",
    approvedPlainRuleFr:
      "Le propriétaire doit délivrer le logement en bon état de réparation et assurer la jouissance paisible.",
  },

  art_1910: {
    id: "ccq_1910",
    sourceName: "Civil Code of Québec",
    articleOrPage: "Article 1910 C.C.Q.",
    title: "Dwelling must be in good habitable condition",
    sourceUrl:
      "https://legisquebec.gouv.qc.ca/en/showversion/cs/CCQ-1991?code=se%3A1910",
    verifiedFrom: "Official LegisQuébec article 1910 page",
    authorityType: "principal",
    exactExcerptEn:
      "A lessor is bound to deliver a dwelling in good habitable condition",
    exactExcerptFr:
      "Le locateur est tenu de délivrer un logement en bon état d'habitabilité",
    approvedPlainRuleEn:
      "The landlord must deliver and maintain the dwelling in good habitable condition.",
    approvedPlainRuleFr:
      "Le propriétaire doit délivrer et maintenir le logement en bon état d'habitabilité.",
  },

  art_1942: {
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
      "For a lease of 12 months or more, the landlord's modification notice must generally be 3 to 6 months before the end of the lease.",
    approvedPlainRuleFr:
      "Pour un bail de 12 mois ou plus, l'avis de modification doit généralement être donné de 3 à 6 mois avant la fin du bail.",
  },

  art_1945: {
    id: "ccq_1945",
    sourceName: "Civil Code of Québec",
    articleOrPage: "Article 1945 C.C.Q.",
    title: "Tenant objection deadline — one month",
    sourceUrl:
      "https://www.legisquebec.gouv.qc.ca/en/version/cs/ccq-1991?code=se%3A1945",
    verifiedFrom: "Official LegisQuébec article 1945 page",
    authorityType: "principal",
    exactExcerptEn:
      "within one month after receiving the notice of modification of the lease",
    approvedPlainRuleEn:
      "A tenant who objects to a proposed lease modification must notify the landlord within one month after receiving the notice.",
    approvedPlainRuleFr:
      "Le locataire qui refuse la modification proposée doit aviser le propriétaire dans le mois suivant la réception de l'avis.",
  },

  art_1957: {
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
      "A landlord-owner may repossess a dwelling for themselves or certain close family or support relationships defined by law.",
    approvedPlainRuleFr:
      "Un propriétaire peut reprendre un logement pour lui-même ou certaines personnes proches prévues par la loi.",
  },

  art_1960: {
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
      "For a fixed-term lease longer than six months, the landlord must generally give at least six months' notice before the lease ends.",
    approvedPlainRuleFr:
      "Pour un bail à durée fixe de plus de six mois, le propriétaire doit généralement donner un avis au moins six mois avant la fin du bail.",
  },
};
