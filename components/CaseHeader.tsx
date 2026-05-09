import { ShieldCheck } from "lucide-react";

export function CaseHeader() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#172b5f]">
            Deposit recovery case
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Based on the user&apos;s issue, Lawly matched this to a verified Quebec
            housing scenario.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
          <ShieldCheck className="h-4 w-4 text-[#172b5f]/65" />
          Verified content available
        </div>
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400">
        Lawly provides legal information, not legal advice. Review the source and
        consult a licensed professional for advice about your situation.
      </p>
    </section>
  );
}
