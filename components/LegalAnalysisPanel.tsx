import { Info, Shield, ListChecks } from "lucide-react";

type LegalAnalysisPanelProps = {
  summary: string;
  rights?: string;
  importantFacts?: string[];
};

export function LegalAnalysisPanel({
  summary,
  rights,
  importantFacts = [],
}: LegalAnalysisPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="space-y-7">
        <div className="grid gap-4 sm:grid-cols-[1.5rem_1fr]">
          <Info className="mt-0.5 h-5 w-5 text-[#172b5f]/70" />
          <div>
            <h2 className="text-base font-semibold text-[#172b5f]">What this means</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{summary}</p>
          </div>
        </div>

        {rights && (
          <div className="grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-[1.5rem_1fr]">
            <Shield className="mt-0.5 h-5 w-5 text-[#172b5f]/70" />
            <div>
              <h2 className="text-base font-semibold text-[#172b5f]">Your rights</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{rights}</p>
            </div>
          </div>
        )}

        {importantFacts.length > 0 && (
          <div className="grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-[1.5rem_1fr]">
            <ListChecks className="mt-0.5 h-5 w-5 text-[#172b5f]/70" />
            <div>
              <h2 className="text-base font-semibold text-[#172b5f]">
                Important to know
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {importantFacts.map((fact, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
