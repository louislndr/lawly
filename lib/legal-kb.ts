// Hardcoded Quebec legal knowledge base for the Lawly demo.
// The LLM personalizes; this file provides the authoritative facts.

export const LEGAL_KB = {
  housing: {
    deposit: {
      description: "Security deposit or damage deposit demanded by a landlord in Quebec",
      law: {
        code: "Civil Code of Quebec (CCQ)",
        article: "1904",
        text: "A lessor may not exact, as a condition for the leasing of a dwelling, the payment of a sum of money other than as payment of the first instalment of rent.",
        plain:
          "In Quebec, a landlord can only ask for the first month's rent when you sign a lease. They cannot legally require any security deposit, damage deposit, key deposit, or any other advance payment. If they collected any such deposit, that money must be returned to you in full.",
      },
      tribunal: "Tribunal administratif du logement (TAL)",
      alternativeTribunal:
        "Division des petites créances (Small Claims Court) for amounts under $15,000",
      prescriptionPeriod: "3 years from the date of payment",
      filingFee: "approximately $80",
      steps: [
        {
          step: 1,
          action: "Send a formal demand letter (mise en demeure)",
          timing: "Immediately",
          details:
            "Write to your landlord by email or registered mail demanding the return of the full deposit within 10 business days. Keep a copy of all communications.",
        },
        {
          step: 2,
          action: "Gather your evidence",
          timing: "Immediately",
          details:
            "Collect and keep: your signed lease, proof of payment (bank statement or receipt), photos of the apartment on move-out day, and all emails or text messages with your landlord.",
        },
        {
          step: 3,
          action: "File a complaint at the TAL",
          timing: "If no response within 10–15 days",
          details:
            "File an Application at the Tribunal administratif du logement (TAL) at tal.gouv.qc.ca or in person at a TAL office. The filing fee is approximately $80. You do not need a lawyer.",
        },
        {
          step: 4,
          action: "Attend the TAL hearing",
          timing: "Usually 2 to 4 months after filing",
          details:
            "Bring all your evidence to the hearing. The TAL is designed for individuals — you will represent yourself. The process is straightforward and the judge will ask questions.",
        },
      ],
      keyFacts: [
        "Security deposits are completely illegal in Quebec — there are no exceptions",
        "You have 3 years from the date of payment to file a complaint",
        "TAL filing fee is approximately $80",
        "You can also file in Small Claims Court for amounts under $15,000",
        "You do not need a lawyer at the TAL hearing",
        "If you win, you may also be awarded interest on the amount owed",
      ],
    },
    eviction: {
      description: "Landlord wants to evict tenant or not renew the lease",
      law: {
        code: "Civil Code of Quebec (CCQ)",
        article: "1937",
        text: "A notice to repossess a dwelling or to evict the lessee must be given at least six months before the expiry of the lease.",
        plain:
          "A landlord must give you at least 6 months written notice before the end of your lease if they want to repossess the dwelling or evict you. The notice must state a valid legal reason. You can refuse and contest at the TAL.",
      },
      tribunal: "Tribunal administratif du logement (TAL)",
      prescriptionPeriod: "Respond within 1 month of receiving the notice",
    },
  },
  work: {
    unpaidWages: {
      description:
        "Employer refuses to pay wages owed, final paycheque, or overtime",
      law: {
        code: "Act Respecting Labour Standards (Quebec)",
        article: "98",
        text: "The employer shall pay the employee the wages owed no later than on the usual pay day following the end of the pay period in which the work was performed.",
        plain:
          "Your employer must pay all wages owed when your employment ends. If they have not paid you, you can file a complaint with CNESST (Commission des normes, de l'équité, de la santé et de la sécurité du travail) at no cost.",
      },
      tribunal:
        "CNESST (Commission des normes, de l'équité, de la santé et de la sécurité du travail)",
      prescriptionPeriod: "3 years",
      filingFee: "Free",
    },
    wrongfulDismissal: {
      description: "Fired without cause or without proper notice",
      law: {
        code: "Act Respecting Labour Standards (Quebec)",
        article: "124",
        text: "An employee who believes that they have been dismissed without good and sufficient cause may submit a written complaint to the Commission within 45 days of the dismissal.",
        plain:
          "If you have worked for the same employer for 2 or more years and were dismissed, you can file a complaint with CNESST within 45 days. The employer must prove the dismissal was justified.",
      },
      tribunal: "CNESST",
      prescriptionPeriod: "45 days from dismissal",
      filingFee: "Free",
    },
  },
  consumer: {
    defectiveProduct: {
      description:
        "Merchant refuses to repair, replace, or refund a defective product",
      law: {
        code: "Consumer Protection Act (Quebec)",
        article: "37",
        text: "Goods forming the object of a consumer contract must be durable in normal use for a reasonable length of time, having regard to the price paid, the terms of the contract and the conditions of use of the goods.",
        plain:
          "Under Quebec's Consumer Protection Act, all products must work properly for a reasonable time. If they don't, the merchant must repair, replace, or refund. This legal guarantee applies even without a written warranty.",
      },
      tribunal: "Office de la protection du consommateur (OPC)",
      alternativeTribunal: "Small Claims Court for amounts under $15,000",
      prescriptionPeriod: "3 years",
    },
  },
  government: {
    taxNotice: {
      description: "Received a tax assessment notice or demand letter from Revenu Québec or CRA",
      law: {
        code: "Tax Administration Act (Quebec)",
        article: "93.1",
        text: "A taxpayer who objects to an assessment may, within 90 days after the day of mailing of the notice of assessment, serve on the Minister a notice of objection.",
        plain:
          "If you receive a tax assessment you disagree with, you have 90 days to file a formal objection with Revenu Québec. You do not need to pay the disputed amount while your objection is being reviewed. Consider consulting a tax lawyer or accountant.",
      },
      tribunal: "Revenu Québec (objection process) → Court of Québec (Tax Division)",
      prescriptionPeriod: "90 days from the date of the notice",
    },
  },
};
