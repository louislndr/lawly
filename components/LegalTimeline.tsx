"use client";

export interface LegalTimelineStep {
  title: string;
  description: string;
  timingLabel?: string;
  urgency?: "low" | "medium" | "high";
}

interface LegalTimelineProps {
  steps: LegalTimelineStep[];
  availableDocuments?: string[];
  onGenerateDocument?: (type: string) => void;
  slotsStatus?: "idle" | "loading" | "ready" | "error";
}

function urgencyText(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "Important";
  if (urgency === "medium") return "Important";
  return "When ready";
}

export function LegalTimeline({ steps }: LegalTimelineProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div>
        <h2 className="text-base font-semibold text-[#172b5f]">Legal process timeline</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Follow these steps in order and keep proof of each action.
        </p>
      </div>

      <ol className="relative mt-6 space-y-0">
        {steps.length > 1 && (
          <div className="absolute left-4 top-8 bottom-8 w-px bg-slate-200" aria-hidden="true" />
        )}
        {steps.map((step, index) => {
          const urgency = step.urgency ?? "medium";
          return (
            <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-[#172b5f]">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {step.timingLabel || "Next"}
                    </span>
                    <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-400">
                      {urgencyText(urgency)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
