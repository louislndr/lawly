"use client";

import { Pencil } from "lucide-react";
import type { DocumentSlots } from "@/lib/document-templates";

type FieldConfig = {
  key: keyof DocumentSlots;
  label: string;
  hint: string;
  wide?: boolean;
  multiline?: boolean;
};

type FieldGroup = {
  title: string;
  fields: FieldConfig[];
};

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Your information",
    fields: [
      { key: "tenantName",    label: "Your full name",               hint: "e.g. Jane Smith" },
      { key: "tenantEmail",   label: "Your email",                   hint: "e.g. jane@email.com" },
      { key: "tenantPhone",   label: "Your phone",                   hint: "e.g. 514-555-0123" },
      { key: "tenantAddress", label: "Your street address",          hint: "e.g. 123 Rue Sainte-Catherine", wide: true },
      { key: "tenantCity",    label: "City, province, postal code",  hint: "e.g. Montréal, QC H2X 1Z5",    wide: true },
    ],
  },
  {
    title: "Landlord & unit",
    fields: [
      { key: "landlordName",    label: "Landlord's name",           hint: "e.g. Jean Tremblay" },
      { key: "unitAddress",     label: "Rental unit address",       hint: "e.g. Apt 3, 789 Rue de la Montagne" },
      { key: "landlordAddress", label: "Landlord's mailing address",hint: "e.g. 456 Avenue du Parc, Montréal", wide: true },
    ],
  },
  {
    title: "Case details",
    fields: [
      { key: "depositAmount",  label: "Amount claimed",           hint: "e.g. $850.00" },
      { key: "issueDate",      label: "Document date",            hint: "e.g. May 9, 2024" },
      { key: "datePaid",       label: "Date deposit was paid",    hint: "e.g. September 1, 2023" },
      { key: "moveOutDate",    label: "Move-out date",            hint: "e.g. March 31, 2024" },
      { key: "deadlineDate",   label: "Response deadline",        hint: "e.g. May 24, 2024" },
      { key: "landlordReason", label: "Landlord's stated reason", hint: "e.g. Claims damage to floors" },
      { key: "proofAvailable", label: "Evidence you have",        hint: "e.g. Photos, receipts, bank transfer", wide: true },
    ],
  },
  {
    title: "Summary of facts",
    fields: [
      {
        key: "factsParagraph",
        label: "Facts paragraph",
        hint: "2–3 sentences summarising the situation in neutral language…",
        wide: true,
        multiline: true,
      },
    ],
  },
];

interface DocumentFieldEditorProps {
  slots: DocumentSlots;
  onChange: (key: keyof DocumentSlots, value: string) => void;
}

export function DocumentFieldEditor({ slots, onChange }: DocumentFieldEditorProps) {
  const emptyCount = (Object.keys(slots) as Array<keyof DocumentSlots>).filter(
    (k) => slots[k] === ""
  ).length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6 print:hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Pencil className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-none mb-0.5">
              Edit document fields
            </p>
            <p className="text-xs text-gray-400">Changes update the document above instantly</p>
          </div>
        </div>
        {emptyCount > 0 && (
          <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {emptyCount} empty
          </span>
        )}
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-7">
        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              {group.title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.fields.map((field) => {
                const value = slots[field.key];
                const empty = value === "";
                const baseInput =
                  "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors";
                const filledStyle =
                  "border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:ring-blue-100 focus:border-blue-300";
                const emptyStyle =
                  "border border-amber-300 bg-amber-50/40 text-gray-900 placeholder:text-amber-300/80 focus:ring-amber-100 focus:border-amber-400";

                return (
                  <div
                    key={field.key}
                    className={field.wide || field.multiline ? "sm:col-span-2" : ""}
                  >
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {field.label}
                      {empty && (
                        <span className="ml-1.5 text-amber-500">·</span>
                      )}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={value}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        placeholder={field.hint}
                        rows={4}
                        className={`${baseInput} ${empty ? emptyStyle : filledStyle} resize-none`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        placeholder={field.hint}
                        className={`${baseInput} ${empty ? emptyStyle : filledStyle}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
