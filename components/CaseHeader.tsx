import { ShieldCheck, AlertCircle } from "lucide-react";

interface CaseHeaderProps {
  title?: string;
  supported?: boolean;
}

export function CaseHeader({ title, supported = true }: CaseHeaderProps) {
  const displayTitle = title || (supported ? "Case analysis" : "Situation overview");

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#172b5f]">
            {displayTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {supported
              ? "Lawly matched this to a verified Quebec legal scenario."
              : "Lawly recognized the issue type but does not yet have verified content for this area."}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${
            supported
              ? "border-slate-200 bg-white text-slate-600"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {supported ? (
            <ShieldCheck className="h-4 w-4 text-[#172b5f]/65" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
          {supported ? "Verified content available" : "Unverified area — organizing only"}
        </div>
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400">
        Lawly provides legal information, not legal advice. Review the source and consult a
        licensed professional for advice about your situation.
      </p>
    </section>
  );
}
