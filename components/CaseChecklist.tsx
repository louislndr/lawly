import { Check } from "lucide-react";

const CHECKLIST = [
  "Keep your lease and proof of payment",
  "Save messages with your landlord",
  "Keep photos or move-out evidence",
  "Keep a copy of any letter you send",
  "Verify the correct filing path before filing",
];

export function CaseChecklist() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <h2 className="text-base font-semibold text-[#172b5f]">Before you act</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
              <Check className="h-3.5 w-3.5 text-[#172b5f]/70" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
