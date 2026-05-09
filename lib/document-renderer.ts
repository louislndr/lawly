import type { DocumentType, DocumentSlots } from "./document-templates";
import { PLACEHOLDER } from "./document-templates";

// ── Section types ─────────────────────────────────────────────────────────────

interface BaseSection {
  id: string;
  label?: string;
}
interface AddressesSection extends BaseSection {
  type: "addresses";
  content: [string, string, string]; // [sender block, date, recipient block]
}
interface TextSection extends BaseSection {
  type: "subject" | "salutation" | "paragraph" | "notice" | "closing" | "signature";
  content: string;
}
// Each row: [displayLabel, displayValue, optionalSlotKey]
interface InfoRowsSection extends BaseSection {
  type: "info-rows";
  content: Array<[string, string, (keyof DocumentSlots)?]>;
}
interface ListSection extends BaseSection {
  type: "checklist" | "steps";
  content: string[];
}

export type DocumentSection =
  | AddressesSection
  | TextSection
  | InfoRowsSection
  | ListSection;

export interface RenderedDocument {
  type: DocumentType;
  title: string;
  subtitle: string;
  sections: DocumentSection[];
  issueDate: string;
  deadline: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function addBusinessDays(start: Date, days: number): Date {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

function s(slots: DocumentSlots, key: keyof DocumentSlots): string {
  return slots[key] || PLACEHOLDER[key];
}

function senderBlock(slots: DocumentSlots): string {
  return `${s(slots, "tenantName")}\n${s(slots, "tenantAddress")}\n${s(slots, "tenantCity")}\n${s(slots, "tenantPhone")}\n${s(slots, "tenantEmail")}`;
}

function recipientBlock(slots: DocumentSlots): string {
  return `${s(slots, "landlordName")}\n${s(slots, "landlordAddress")}`;
}

// ── Deposit: Formal Notice ────────────────────────────────────────────────────

function renderDepositFormalNotice(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));

  const backgroundFacts = [
    `I was a tenant of the residential dwelling located at ${s(slots, "unitAddress")}.`,
    slots.datePaid
      ? `On or about ${slots.datePaid}, you required and collected from me a security deposit in the amount of ${s(slots, "depositAmount")}.`
      : `At the commencement of the tenancy, you required and collected from me a security deposit in the amount of ${s(slots, "depositAmount")}.`,
    slots.moveOutDate
      ? `On or about ${slots.moveOutDate}, I vacated the premises and returned possession of the unit to you.`
      : `I have since vacated the premises and returned possession of the unit to you.`,
    slots.landlordReason
      ? `You have refused to return the deposit, citing: ${slots.landlordReason}.`
      : `Despite my departure, you have failed to return this deposit.`,
  ].join(" ");

  const evidenceParagraph = slots.proofAvailable
    ? `In support of this demand, I have retained the following evidence: ${slots.proofAvailable}. I am prepared to present this evidence before any competent tribunal.`
    : `I have retained all relevant supporting documents, including the signed lease agreement, proof of deposit payment, and records of the condition of the unit at move-out.`;

  const sections: DocumentSection[] = [
    { id: "addresses", type: "addresses", content: [senderBlock(slots), issueDate, recipientBlock(slots)] },
    { id: "subject", type: "subject", content: `Demand for Return of Security Deposit — ${s(slots, "unitAddress")}` },
    { id: "salutation", type: "salutation", content: `Dear ${s(slots, "landlordName")},` },
    { id: "background", type: "paragraph", label: "I. BACKGROUND", content: backgroundFacts },
    {
      id: "legal-basis", type: "paragraph", label: "II. LEGAL BASIS",
      content: `Article 1904 of the Civil Code of Québec expressly prohibits a lessor from requiring any deposit of money or any advance payment beyond the first period of rent. Any security deposit collected is therefore illegal and must be returned in full.`,
    },
    {
      id: "demand", type: "paragraph", label: "III. FORMAL DEMAND",
      content: `By this formal notice (mise en demeure), I hereby demand that you immediately return to me the full amount of ${s(slots, "depositAmount")}, representing the security deposit illegally required and collected at the commencement of the tenancy.`,
    },
    {
      id: "deadline", type: "paragraph", label: "IV. DEADLINE",
      content: `You are required to comply with this demand and remit the full amount of ${s(slots, "depositAmount")} no later than ${deadline} (ten business days from the date of this notice).`,
    },
    { id: "evidence", type: "paragraph", label: "V. EVIDENCE", content: evidenceParagraph },
    {
      id: "no-response", type: "paragraph", label: "VI. IF THERE IS NO RESPONSE",
      content: `Should you fail to comply by the specified deadline, I will, without further notice, file an application before the Tribunal administratif du logement or the Québec Small Claims Division seeking full reimbursement, interest, and any additional indemnity provided by law.`,
    },
    { id: "closing", type: "closing", content: `I trust that you will address this matter promptly.\n\nYours sincerely,` },
    { id: "signature", type: "signature", content: senderBlock(slots) },
    {
      id: "your-details", type: "info-rows", label: "YOUR DETAILS",
      content: [
        ["Your name", s(slots, "tenantName"), "tenantName"],
        ["Your address", s(slots, "tenantAddress"), "tenantAddress"],
        ["City / Postal code", s(slots, "tenantCity"), "tenantCity"],
        ["Phone", s(slots, "tenantPhone"), "tenantPhone"],
        ["Email", s(slots, "tenantEmail"), "tenantEmail"],
        ["Landlord name", s(slots, "landlordName"), "landlordName"],
        ["Landlord address", s(slots, "landlordAddress"), "landlordAddress"],
        ["Unit address", s(slots, "unitAddress"), "unitAddress"],
        ["Deposit amount", s(slots, "depositAmount"), "depositAmount"],
        ["Date deposit paid", s(slots, "datePaid"), "datePaid"],
        ["Move-out date", s(slots, "moveOutDate"), "moveOutDate"],
        ["Document date", issueDate, "issueDate"],
        ["Landlord's stated reason", s(slots, "landlordReason"), "landlordReason"],
        ["Evidence available", s(slots, "proofAvailable"), "proofAvailable"],
      ],
    },
  ];

  return {
    type: "formal_notice",
    title: "FORMAL NOTICE — DEMAND FOR RETURN OF SECURITY DEPOSIT",
    subtitle: "Mise en demeure · Article 1904 C.C.Q.",
    sections,
    issueDate,
    deadline,
  };
}

// ── Repairs: Formal Notice ────────────────────────────────────────────────────

function renderRepairsFormalNotice(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));

  const notifiedLine = slots.notifiedDate
    ? `I notified you in writing on or about ${slots.notifiedDate}, but the issue has not been resolved.`
    : `I have previously notified you of this issue, but it has not been resolved.`;

  const evidenceLine = slots.proofAvailable
    ? `I have retained the following evidence: ${slots.proofAvailable}.`
    : `I have documented the issue with dates, photos, and records.`;

  const sections: DocumentSection[] = [
    { id: "addresses", type: "addresses", content: [senderBlock(slots), issueDate, recipientBlock(slots)] },
    { id: "subject", type: "subject", content: `Demand for Repairs — ${s(slots, "unitAddress")}` },
    { id: "salutation", type: "salutation", content: `Dear ${s(slots, "landlordName")},` },
    {
      id: "background", type: "paragraph", label: "I. BACKGROUND",
      content: `I am a tenant of the residential dwelling located at ${s(slots, "unitAddress")}. Since ${s(slots, "problemStartDate")}, the following condition has affected the habitability and safe use of the premises: ${s(slots, "repairDescription")}. ${notifiedLine}`,
    },
    {
      id: "legal-basis", type: "paragraph", label: "II. LEGAL BASIS",
      content: `Under Articles 1854 and 1910 of the Civil Code of Québec, you are obligated to deliver and maintain the leased property in good repair and in good habitable condition throughout the term of the lease. Failure to carry out necessary repairs is a breach of these obligations.`,
    },
    {
      id: "demand", type: "paragraph", label: "III. FORMAL DEMAND",
      content: `By this formal notice (mise en demeure), I hereby demand that you carry out all necessary repairs to address the above-described condition no later than ${deadline} (ten business days from the date of this notice).`,
    },
    { id: "evidence", type: "paragraph", label: "IV. EVIDENCE", content: evidenceLine },
    {
      id: "no-response", type: "paragraph", label: "V. IF THERE IS NO RESPONSE",
      content: `Should you fail to carry out the required repairs by the specified deadline, I will, without further notice, exercise all remedies available to me before the Tribunal administratif du logement, including an application for a reduction in rent or an order to carry out the repairs.`,
    },
    { id: "closing", type: "closing", content: `I trust that you will address this matter promptly.\n\nYours sincerely,` },
    { id: "signature", type: "signature", content: senderBlock(slots) },
    {
      id: "your-details", type: "info-rows", label: "YOUR DETAILS",
      content: [
        ["Your name", s(slots, "tenantName"), "tenantName"],
        ["Your address", s(slots, "tenantAddress"), "tenantAddress"],
        ["City / Postal code", s(slots, "tenantCity"), "tenantCity"],
        ["Phone", s(slots, "tenantPhone"), "tenantPhone"],
        ["Email", s(slots, "tenantEmail"), "tenantEmail"],
        ["Landlord name", s(slots, "landlordName"), "landlordName"],
        ["Landlord address", s(slots, "landlordAddress"), "landlordAddress"],
        ["Unit address", s(slots, "unitAddress"), "unitAddress"],
        ["Problem description", s(slots, "repairDescription"), "repairDescription"],
        ["Problem started", s(slots, "problemStartDate"), "problemStartDate"],
        ["Date landlord notified", s(slots, "notifiedDate"), "notifiedDate"],
        ["Evidence available", s(slots, "proofAvailable"), "proofAvailable"],
        ["Document date", issueDate, "issueDate"],
      ],
    },
  ];

  return {
    type: "formal_notice",
    title: "FORMAL NOTICE — DEMAND FOR REPAIRS",
    subtitle: "Mise en demeure · Articles 1854 & 1910 C.C.Q.",
    sections,
    issueDate,
    deadline,
  };
}

// ── Rent Increase: Formal Notice ──────────────────────────────────────────────

function renderRentIncreaseFormalNotice(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));

  const sections: DocumentSection[] = [
    { id: "addresses", type: "addresses", content: [senderBlock(slots), issueDate, recipientBlock(slots)] },
    { id: "subject", type: "subject", content: `Objection to Proposed Rent Modification — ${s(slots, "unitAddress")}` },
    { id: "salutation", type: "salutation", content: `Dear ${s(slots, "landlordName")},` },
    {
      id: "background", type: "paragraph", label: "I. BACKGROUND",
      content: `I am a tenant of the residential dwelling located at ${s(slots, "unitAddress")}. On or about ${s(slots, "noticeReceivedDate")}, I received a notice proposing a modification to the lease, including a rent increase from ${s(slots, "currentRent")} to ${s(slots, "newRent")}, effective at the lease renewal.`,
    },
    {
      id: "legal-basis", type: "paragraph", label: "II. LEGAL BASIS",
      content: `Under Article 1945 of the Civil Code of Québec, a tenant who objects to a proposed lease modification must notify the landlord within one month after receiving the notice. I am exercising this right to object within the prescribed period.`,
    },
    {
      id: "objection", type: "paragraph", label: "III. FORMAL OBJECTION",
      content: `By this formal notice, I hereby object to the proposed rent increase and any other proposed modifications set out in your notice dated ${s(slots, "noticeReceivedDate")}. I wish to continue my tenancy at ${s(slots, "unitAddress")} under the current terms, or to negotiate an acceptable modification.`,
    },
    {
      id: "next-steps", type: "paragraph", label: "IV. NEXT STEPS",
      content: `If we cannot reach an agreement on the proposed modification, I understand that either party may apply to the Tribunal administratif du logement to determine the matter. I remain open to discussions.`,
    },
    { id: "closing", type: "closing", content: `Please confirm receipt of this notice.\n\nYours sincerely,` },
    { id: "signature", type: "signature", content: senderBlock(slots) },
    {
      id: "your-details", type: "info-rows", label: "YOUR DETAILS",
      content: [
        ["Your name", s(slots, "tenantName"), "tenantName"],
        ["Your address", s(slots, "tenantAddress"), "tenantAddress"],
        ["City / Postal code", s(slots, "tenantCity"), "tenantCity"],
        ["Phone", s(slots, "tenantPhone"), "tenantPhone"],
        ["Email", s(slots, "tenantEmail"), "tenantEmail"],
        ["Landlord name", s(slots, "landlordName"), "landlordName"],
        ["Landlord address", s(slots, "landlordAddress"), "landlordAddress"],
        ["Unit address", s(slots, "unitAddress"), "unitAddress"],
        ["Current rent", s(slots, "currentRent"), "currentRent"],
        ["Proposed new rent", s(slots, "newRent"), "newRent"],
        ["Notice received", s(slots, "noticeReceivedDate"), "noticeReceivedDate"],
        ["Lease end date", s(slots, "leaseEndDate"), "leaseEndDate"],
        ["Document date", issueDate, "issueDate"],
      ],
    },
  ];

  return {
    type: "formal_notice",
    title: "FORMAL NOTICE — OBJECTION TO RENT MODIFICATION",
    subtitle: "Avis d'objection · Article 1945 C.C.Q.",
    sections,
    issueDate,
    deadline,
  };
}

// ── Eviction: Formal Notice ───────────────────────────────────────────────────

function renderEvictionFormalNotice(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));

  const sections: DocumentSection[] = [
    { id: "addresses", type: "addresses", content: [senderBlock(slots), issueDate, recipientBlock(slots)] },
    { id: "subject", type: "subject", content: `Response to Eviction/Repossession Notice — ${s(slots, "unitAddress")}` },
    { id: "salutation", type: "salutation", content: `Dear ${s(slots, "landlordName")},` },
    {
      id: "acknowledgment", type: "paragraph", label: "I. ACKNOWLEDGMENT OF NOTICE",
      content: `I am a tenant of the residential dwelling located at ${s(slots, "unitAddress")}. I acknowledge receipt of your notice dated ${s(slots, "noticeReceivedDate")}, requesting that I vacate the premises by ${s(slots, "vacateDate")}. The reason stated in the notice is: ${s(slots, "evictionReason")}.`,
    },
    {
      id: "legal-basis", type: "paragraph", label: "II. LEGAL CONTEXT",
      content: `Under the Civil Code of Québec, a landlord may only repossess a dwelling for certain persons and must respect minimum notice periods (Article 1960 C.C.Q.). For a fixed-term lease longer than six months, the notice must generally be given at least six months before the end of the lease. I am reviewing my rights in this regard.`,
    },
    {
      id: "position", type: "paragraph", label: "III. TENANT'S POSITION",
      content: `I am seeking legal guidance regarding the validity of this notice and my rights as a tenant. I am not yet in a position to confirm whether I will comply with this notice. I reserve all rights available to me under the Civil Code of Québec.`,
    },
    {
      id: "request", type: "paragraph", label: "IV. REQUEST",
      content: `I request that you confirm in writing the legal basis for this repossession or eviction, including the identity and relationship of the person who will occupy the dwelling, as required by law. Please respond no later than ${deadline}.`,
    },
    { id: "closing", type: "closing", content: `I trust that you will respond promptly.\n\nYours sincerely,` },
    { id: "signature", type: "signature", content: senderBlock(slots) },
    {
      id: "your-details", type: "info-rows", label: "YOUR DETAILS",
      content: [
        ["Your name", s(slots, "tenantName"), "tenantName"],
        ["Your address", s(slots, "tenantAddress"), "tenantAddress"],
        ["City / Postal code", s(slots, "tenantCity"), "tenantCity"],
        ["Phone", s(slots, "tenantPhone"), "tenantPhone"],
        ["Email", s(slots, "tenantEmail"), "tenantEmail"],
        ["Landlord name", s(slots, "landlordName"), "landlordName"],
        ["Landlord address", s(slots, "landlordAddress"), "landlordAddress"],
        ["Unit address", s(slots, "unitAddress"), "unitAddress"],
        ["Notice received", s(slots, "noticeReceivedDate"), "noticeReceivedDate"],
        ["Requested vacate date", s(slots, "vacateDate"), "vacateDate"],
        ["Lease end date", s(slots, "leaseEndDate"), "leaseEndDate"],
        ["Reason given", s(slots, "evictionReason"), "evictionReason"],
        ["Document date", issueDate, "issueDate"],
      ],
    },
  ];

  return {
    type: "formal_notice",
    title: "FORMAL NOTICE — RESPONSE TO EVICTION/REPOSSESSION NOTICE",
    subtitle: "Articles 1957 & 1960 C.C.Q.",
    sections,
    issueDate,
    deadline,
  };
}

// ── Filing Prep Packets ───────────────────────────────────────────────────────

function renderDepositFilingPrep(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));
  const factsText = slots.factsParagraph ||
    `The applicant was a tenant at ${s(slots, "unitAddress")} and paid a security deposit of ${s(slots, "depositAmount")} at the commencement of the tenancy. The applicant vacated the unit on or about ${s(slots, "moveOutDate")}. The landlord has refused to return the deposit without lawful justification.`;

  const sections: DocumentSection[] = [
    { id: "notice", type: "notice", content: "This is not the official court form. It is a preparation document to help you organize your case. Do not submit this to any tribunal or court." },
    { id: "summary", type: "paragraph", label: "CASE SUMMARY", content: `Claim for return of a security deposit of ${s(slots, "depositAmount")} paid at ${s(slots, "unitAddress")}. Under Article 1904 C.C.Q., security deposits in residential leases are prohibited and must be returned in full.` },
    { id: "tenant-info", type: "info-rows", label: "APPLICANT / TENANT", content: [["Full name", s(slots, "tenantName"), "tenantName"], ["Mailing address", s(slots, "tenantAddress"), "tenantAddress"], ["City / Postal code", s(slots, "tenantCity"), "tenantCity"], ["Phone", s(slots, "tenantPhone"), "tenantPhone"], ["Email", s(slots, "tenantEmail"), "tenantEmail"]] },
    { id: "landlord-info", type: "info-rows", label: "LANDLORD / DEFENDANT", content: [["Full name or company", s(slots, "landlordName"), "landlordName"], ["Mailing address", s(slots, "landlordAddress"), "landlordAddress"]] },
    { id: "dwelling-info", type: "info-rows", label: "DWELLING", content: [["Unit address", s(slots, "unitAddress"), "unitAddress"], ["Deposit paid on", s(slots, "datePaid"), "datePaid"], ["Tenant vacated on", s(slots, "moveOutDate"), "moveOutDate"], ["Landlord's reason for refusal", slots.landlordReason || "None provided", "landlordReason"]] },
    { id: "amount", type: "info-rows", label: "AMOUNT CLAIMED", content: [["Security deposit (unlawfully collected)", s(slots, "depositAmount"), "depositAmount"], ["Interest (Art. 1617 C.C.Q.)", "To be calculated at filing"], ["Estimated total minimum", `${s(slots, "depositAmount")} + interest`]] },
    { id: "facts", type: "paragraph", label: "FACTS OF THE CLAIM", content: factsText },
    { id: "legal-basis", type: "paragraph", label: "LEGAL BASIS", content: `Article 1904 C.C.Q. prohibits a lessor from requiring a security deposit in a residential lease. Any such deposit must be returned in full. Interest applies under Art. 1617 C.C.Q. The general prescription period is 3 years (Art. 2925 C.C.Q.).` },
    { id: "evidence", type: "checklist", label: "EVIDENCE CHECKLIST", content: ["Copy of the signed lease agreement", "Receipt or proof of deposit payment", "Photographs or video of the unit at move-out", "Written communication from landlord refusing to return the deposit", "Copy of the formal notice with proof of delivery", "Proof of address change confirming you vacated"] },
    { id: "steps", type: "steps", label: "NEXT STEPS", content: ["Send the formal notice to your landlord by registered mail and keep a copy.", `Wait until ${deadline} (10 business days) for the landlord's response.`, "If no response, identify the correct forum: TAL or Québec Small Claims Division.", "Complete the official filing form and submit it with the applicable fee.", "Attend your hearing with all evidence and the formal notice delivery proof."] },
    { id: "disclaimer", type: "paragraph", label: "DISCLAIMER", content: "This is a preparation tool only. Not legal advice. Verify deadlines, forms, and the correct filing path before acting." },
  ];

  return { type: "filing_prep_packet", title: "FILING PREP PACKET — SECURITY DEPOSIT RECOVERY", subtitle: "Preparation document only — Not an official court form", sections, issueDate, deadline };
}

function renderRepairsFilingPrep(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));
  const factsText = slots.factsParagraph ||
    `The applicant is a tenant at ${s(slots, "unitAddress")}. Since ${s(slots, "problemStartDate")}, the following condition has affected the dwelling: ${s(slots, "repairDescription")}. The landlord was notified on ${s(slots, "notifiedDate")} and has not carried out the necessary repairs.`;

  const sections: DocumentSection[] = [
    { id: "notice", type: "notice", content: "This is not the official court form. It is a preparation document to help you organize your case. Do not submit this to any tribunal or court." },
    { id: "summary", type: "paragraph", label: "CASE SUMMARY", content: `Claim regarding failure to carry out repairs at ${s(slots, "unitAddress")}. Under Articles 1854 and 1910 C.C.Q., the landlord is obligated to deliver and maintain the dwelling in good habitable condition.` },
    { id: "tenant-info", type: "info-rows", label: "APPLICANT / TENANT", content: [["Full name", s(slots, "tenantName"), "tenantName"], ["Mailing address", s(slots, "tenantAddress"), "tenantAddress"], ["City / Postal code", s(slots, "tenantCity"), "tenantCity"], ["Phone", s(slots, "tenantPhone"), "tenantPhone"], ["Email", s(slots, "tenantEmail"), "tenantEmail"]] },
    { id: "landlord-info", type: "info-rows", label: "LANDLORD / RESPONDENT", content: [["Full name or company", s(slots, "landlordName"), "landlordName"], ["Mailing address", s(slots, "landlordAddress"), "landlordAddress"]] },
    { id: "issue-info", type: "info-rows", label: "ISSUE DETAILS", content: [["Unit address", s(slots, "unitAddress"), "unitAddress"], ["Problem description", s(slots, "repairDescription"), "repairDescription"], ["Problem started", s(slots, "problemStartDate"), "problemStartDate"], ["Landlord notified on", s(slots, "notifiedDate"), "notifiedDate"], ["Evidence available", s(slots, "proofAvailable"), "proofAvailable"]] },
    { id: "facts", type: "paragraph", label: "FACTS OF THE CLAIM", content: factsText },
    { id: "legal-basis", type: "paragraph", label: "LEGAL BASIS", content: `Art. 1854 C.C.Q.: the lessor must deliver the property in good repair. Art. 1910 C.C.Q.: the lessor must maintain the dwelling in good habitable condition. The TAL may order repairs and/or a reduction in rent.` },
    { id: "evidence", type: "checklist", label: "EVIDENCE CHECKLIST", content: ["Photos or videos of the condition, with dates", "Written notice to landlord and any response received", "Repair request messages (texts, emails, letters)", "Copy of the formal notice with proof of delivery", "Any reports from inspectors, contractors, or city housing services"] },
    { id: "steps", type: "steps", label: "NEXT STEPS", content: ["Send the formal notice demanding repairs and keep delivery proof.", `Wait until ${deadline} (10 business days) for the landlord to act.`, "If repairs are not started, contact the TAL or a tenant association.", "File an application at the TAL if necessary.", "Attend your hearing with all evidence."] },
    { id: "disclaimer", type: "paragraph", label: "DISCLAIMER", content: "This is a preparation tool only. Not legal advice. Verify deadlines, forms, and the correct filing path before acting." },
  ];

  return { type: "filing_prep_packet", title: "FILING PREP PACKET — DEMAND FOR REPAIRS", subtitle: "Preparation document only — Not an official court form", sections, issueDate, deadline };
}

function renderRentIncreaseFilingPrep(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));
  const factsText = slots.factsParagraph ||
    `The applicant is a tenant at ${s(slots, "unitAddress")}. On or about ${s(slots, "noticeReceivedDate")}, the applicant received a notice proposing a rent increase from ${s(slots, "currentRent")} to ${s(slots, "newRent")}. The applicant objects to this proposed modification.`;

  const sections: DocumentSection[] = [
    { id: "notice", type: "notice", content: "This is not the official court form. It is a preparation document to help you organize your case. Do not submit this to any tribunal or court." },
    { id: "summary", type: "paragraph", label: "CASE SUMMARY", content: `Objection to proposed rent increase at ${s(slots, "unitAddress")} from ${s(slots, "currentRent")} to ${s(slots, "newRent")}. Under Art. 1945 C.C.Q., the tenant must notify the landlord of an objection within one month of receiving the notice.` },
    { id: "tenant-info", type: "info-rows", label: "APPLICANT / TENANT", content: [["Full name", s(slots, "tenantName"), "tenantName"], ["Mailing address", s(slots, "tenantAddress"), "tenantAddress"], ["City / Postal code", s(slots, "tenantCity"), "tenantCity"], ["Phone", s(slots, "tenantPhone"), "tenantPhone"], ["Email", s(slots, "tenantEmail"), "tenantEmail"]] },
    { id: "landlord-info", type: "info-rows", label: "LANDLORD / RESPONDENT", content: [["Full name or company", s(slots, "landlordName"), "landlordName"], ["Mailing address", s(slots, "landlordAddress"), "landlordAddress"]] },
    { id: "lease-info", type: "info-rows", label: "LEASE DETAILS", content: [["Unit address", s(slots, "unitAddress"), "unitAddress"], ["Current rent", s(slots, "currentRent"), "currentRent"], ["Proposed new rent", s(slots, "newRent"), "newRent"], ["Notice received on", s(slots, "noticeReceivedDate"), "noticeReceivedDate"], ["Lease end date", s(slots, "leaseEndDate"), "leaseEndDate"]] },
    { id: "facts", type: "paragraph", label: "FACTS", content: factsText },
    { id: "legal-basis", type: "paragraph", label: "LEGAL BASIS", content: `Art. 1942 C.C.Q.: notice of modification must be given 3–6 months before the end of a 12-month-or-more lease. Art. 1945 C.C.Q.: a tenant who objects must notify the landlord within one month of receiving the notice. Failure to respond within one month may be deemed acceptance.` },
    { id: "evidence", type: "checklist", label: "EVIDENCE CHECKLIST", content: ["Original rent increase or lease modification notice", "Proof of the date you received the notice", "Current lease agreement", "Proof of delivery of your written objection", "Any prior notices or correspondence about the rent"] },
    { id: "steps", type: "steps", label: "NEXT STEPS", content: ["Confirm the exact date you received the notice — the 1-month response clock starts then.", "Send the written objection before the 1-month deadline and keep proof.", "If no agreement is reached, either party may apply to the TAL.", "Do not ignore the notice — failing to respond may be treated as acceptance."] },
    { id: "disclaimer", type: "paragraph", label: "DISCLAIMER", content: "This is a preparation tool only. Not legal advice. Verify deadlines, forms, and the correct filing path before acting." },
  ];

  return { type: "filing_prep_packet", title: "FILING PREP PACKET — RENT INCREASE OBJECTION", subtitle: "Preparation document only — Not an official court form", sections, issueDate, deadline };
}

function renderEvictionFilingPrep(slots: DocumentSlots): RenderedDocument {
  const now = new Date();
  const issueDate = slots.issueDate || fmtDate(now);
  const deadline = slots.deadlineDate || fmtDate(addBusinessDays(now, 10));
  const factsText = slots.factsParagraph ||
    `The applicant is a tenant at ${s(slots, "unitAddress")}. On or about ${s(slots, "noticeReceivedDate")}, the applicant received a notice to vacate by ${s(slots, "vacateDate")}. The reason stated is: ${s(slots, "evictionReason")}.`;

  const sections: DocumentSection[] = [
    { id: "notice", type: "notice", content: "This is not the official court form. Eviction/repossession situations can be high-stakes. Contact a tenant association or legal clinic quickly before deciding what to do." },
    { id: "summary", type: "paragraph", label: "CASE SUMMARY", content: `Response to a repossession or eviction notice at ${s(slots, "unitAddress")}. The landlord has requested possession by ${s(slots, "vacateDate")}. Under Arts. 1957–1960 C.C.Q., a landlord may only repossess for certain persons and must respect minimum notice periods.` },
    { id: "tenant-info", type: "info-rows", label: "TENANT", content: [["Full name", s(slots, "tenantName"), "tenantName"], ["Mailing address", s(slots, "tenantAddress"), "tenantAddress"], ["City / Postal code", s(slots, "tenantCity"), "tenantCity"], ["Phone", s(slots, "tenantPhone"), "tenantPhone"], ["Email", s(slots, "tenantEmail"), "tenantEmail"]] },
    { id: "landlord-info", type: "info-rows", label: "LANDLORD", content: [["Full name or company", s(slots, "landlordName"), "landlordName"], ["Mailing address", s(slots, "landlordAddress"), "landlordAddress"]] },
    { id: "notice-info", type: "info-rows", label: "NOTICE DETAILS", content: [["Unit address", s(slots, "unitAddress"), "unitAddress"], ["Notice received on", s(slots, "noticeReceivedDate"), "noticeReceivedDate"], ["Requested vacate date", s(slots, "vacateDate"), "vacateDate"], ["Lease end date", s(slots, "leaseEndDate"), "leaseEndDate"], ["Reason stated", s(slots, "evictionReason"), "evictionReason"]] },
    { id: "facts", type: "paragraph", label: "FACTS", content: factsText },
    { id: "legal-basis", type: "paragraph", label: "LEGAL BASIS", content: `Art. 1957 C.C.Q.: a landlord-owner may repossess only for themselves or certain close relations. Art. 1960 C.C.Q.: for a fixed-term lease longer than 6 months, at least 6 months' notice is required before lease end. Non-compliance with these requirements may make the notice invalid.` },
    { id: "evidence", type: "checklist", label: "EVIDENCE CHECKLIST", content: ["Original eviction or repossession notice with date received", "Current lease agreement and all renewals", "Any prior notices or communications from the landlord", "Evidence of your tenancy and rental payments", "Any information about who the landlord claims will occupy the unit"] },
    { id: "steps", type: "steps", label: "NEXT STEPS", content: ["Do not ignore the notice and do not move out without getting advice.", "Contact a tenant association, legal clinic, or the TAL quickly.", "Verify that the notice was given at least 6 months before lease end (Art. 1960 C.C.Q.).", "Verify that the stated occupant is a person for whom repossession is legally allowed.", "If the notice is defective, you may have the right to contest it at the TAL."] },
    { id: "disclaimer", type: "paragraph", label: "DISCLAIMER", content: "This is a preparation tool only. Not legal advice. Eviction situations can be serious — get legal help before acting or moving." },
  ];

  return { type: "filing_prep_packet", title: "FILING PREP PACKET — RESPONSE TO EVICTION/REPOSSESSION", subtitle: "Preparation document only — Not an official court form", sections, issueDate, deadline };
}

// ── Public render functions ───────────────────────────────────────────────────

export function renderFormalNotice(slots: DocumentSlots): RenderedDocument {
  switch (slots.scenarioId) {
    case "housing_repairs":       return renderRepairsFormalNotice(slots);
    case "housing_rent_increase": return renderRentIncreaseFormalNotice(slots);
    case "housing_eviction_notice": return renderEvictionFormalNotice(slots);
    default:                      return renderDepositFormalNotice(slots);
  }
}

export function renderFilingPrepPacket(slots: DocumentSlots): RenderedDocument {
  switch (slots.scenarioId) {
    case "housing_repairs":       return renderRepairsFilingPrep(slots);
    case "housing_rent_increase": return renderRentIncreaseFilingPrep(slots);
    case "housing_eviction_notice": return renderEvictionFilingPrep(slots);
    default:                      return renderDepositFilingPrep(slots);
  }
}
