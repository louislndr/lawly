export type DocumentType = "formal_notice" | "filing_prep_packet";

export interface DocumentSlots {
  // Universal
  scenarioId: string;
  tenantName: string;
  tenantAddress: string;
  tenantCity: string;
  tenantPhone: string;
  tenantEmail: string;
  landlordName: string;
  landlordAddress: string;
  unitAddress: string;
  issueDate: string;
  deadlineDate: string;
  factsParagraph: string;
  proofAvailable: string;
  landlordReason: string;

  // Deposit (housing_deposit)
  depositAmount: string;
  datePaid: string;
  moveOutDate: string;

  // Repairs (housing_repairs)
  repairDescription: string;
  problemStartDate: string;
  notifiedDate: string;

  // Rent increase (housing_rent_increase)
  currentRent: string;
  newRent: string;
  noticeReceivedDate: string;
  leaseEndDate: string;

  // Eviction (housing_eviction_notice)
  vacateDate: string;
  evictionReason: string;
}

export const PLACEHOLDER: Record<keyof DocumentSlots, string> = {
  scenarioId: "",
  tenantName: "[Tenant name]",
  tenantAddress: "[Tenant address]",
  tenantCity: "[City, Province, Postal Code]",
  tenantPhone: "[Tenant phone]",
  tenantEmail: "[Tenant email]",
  landlordName: "[Landlord name]",
  landlordAddress: "[Landlord address]",
  unitAddress: "[Unit address]",
  issueDate: "[Date]",
  deadlineDate: "[Deadline date]",
  factsParagraph: "[Summary of facts]",
  proofAvailable: "[Evidence available]",
  landlordReason: "[Reason given by landlord, if any]",
  depositAmount: "[Deposit amount]",
  datePaid: "[Date deposit was paid]",
  moveOutDate: "[Move-out date]",
  repairDescription: "[Description of repair or problem]",
  problemStartDate: "[Date problem started]",
  notifiedDate: "[Date landlord was notified]",
  currentRent: "[Current monthly rent]",
  newRent: "[Proposed new rent]",
  noticeReceivedDate: "[Date notice was received]",
  leaseEndDate: "[Lease end date]",
  vacateDate: "[Date landlord wants possession]",
  evictionReason: "[Reason given for eviction or repossession]",
};
