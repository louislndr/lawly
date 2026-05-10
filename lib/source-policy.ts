// Lawly source policy.
// Every legal statement in a Lawly response must map to a source in this hierarchy.
// If no source here supports a rule, citation, deadline, form, or procedure — do not state it.

export type SourceAuthority = "official" | "quasi_official" | "access_to_justice";

export type TrustedSourceSpec = {
  name: string;
  domain: string;
  authority: SourceAuthority;
  useFor: string;
  priority: number; // 1 = highest authority
};

export const SOURCE_HIERARCHY: TrustedSourceSpec[] = [
  {
    name: "Légis Québec",
    domain: "legisquebec.gouv.qc.ca",
    authority: "official",
    useFor: "Exact article text from official Quebec statutes and regulations",
    priority: 1,
  },
  {
    name: "Tribunal administratif du logement",
    domain: "tal.gouv.qc.ca",
    authority: "official",
    useFor: "Housing tribunal procedures, official notices, and forms",
    priority: 2,
  },
  {
    name: "Québec.ca",
    domain: "quebec.ca",
    authority: "official",
    useFor: "Government guidance, small claims, formal notice, administrative process",
    priority: 3,
  },
  {
    name: "Éducaloi",
    domain: "educaloi.qc.ca",
    authority: "access_to_justice",
    useFor: "Plain-language explanations and access-to-justice resources",
    priority: 4,
  },
  {
    name: "CanLII",
    domain: "canlii.org",
    authority: "quasi_official",
    useFor: "Quebec legislation and case law — verify against official sources before relying on",
    priority: 5,
  },
];

export const POLICY_RULES = {
  mustHaveCitation:
    "Every legal statement must map to an item loaded in the verified legal library.",
  noCitationNoRule:
    "If no citation in the library supports a legal rule, do not state the rule.",
  noInventedData:
    "Never invent article numbers, court names, deadlines, forms, or procedures not present in the library.",
  timelineStepTypes: {
    source_based:
      "Step is directly derived from a verified source loaded in the library.",
    practical_next_step:
      "Practical recommendation — not cited in a specific law article.",
    needs_verification:
      "Step involves a filing, procedure, or deadline — the user must verify the correct process before acting.",
  },
  filingDisclaimer:
    "Filing paths must always instruct the user to verify the correct process before filing, unless the library contains explicit procedural content for that exact step.",
} as const;

export function isAllowedSource(sourceName: string): boolean {
  return SOURCE_HIERARCHY.some(
    (s) => s.name.toLowerCase() === sourceName.toLowerCase()
  );
}

export function isAllowedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return SOURCE_HIERARCHY.some((s) => hostname.includes(s.domain));
  } catch {
    return false;
  }
}
