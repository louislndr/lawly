"use client";

import {
  ClipboardList,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface LegalTimelineStep {
  title: string;
  description: string;
  timingLabel?: string;
  urgency?: "low" | "medium" | "high";
}

interface LegalTimelineProps {
  steps: LegalTimelineStep[];
  availableDocuments?: string[];
  onGenerateDocument?: (type: "formal_notice" | "filing_prep_packet") => void;
  slotsStatus?: "idle" | "loading" | "ready" | "error";
}

function getIcon(title: string, index: number): LucideIcon {
  const t = title.toLowerCase();
  if (/gather|proof|collect|save|record/.test(t)) return ClipboardList;
  if (/notice|send|write|letter|notify|demand|response/.test(t)) return FileText;
  if (/wait|deadline|allow|period|check.*date|clock/.test(t)) return Clock;
  if (/escalat|file|help|contact|verify|filing|tribunal|clinic/.test(t)) return AlertTriangle;
  const pool: LucideIcon[] = [ClipboardList, FileText, Clock, AlertTriangle, CheckCircle2];
  return pool[index % pool.length];
}

function cardBorderClass(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "border-l-amber-400";
  if (urgency === "medium") return "border-l-blue-400";
  return "border-l-slate-300";
}

function timingPillClass(label: string): string {
  const t = label.toLowerCase();
  if (/today|immediately|now|start|clock starts/.test(t))
    return "bg-amber-50 text-amber-700 border border-amber-200";
  if (/month|week|within/.test(t))
    return "bg-blue-50 text-blue-700 border border-blue-200";
  if (/if no|if not|deadline|promptly/.test(t))
    return "bg-slate-100 text-slate-600 border border-slate-200";
  return "bg-indigo-50 text-indigo-700 border border-indigo-200";
}

function urgencyPillClass(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "bg-red-50 text-red-700 border border-red-200";
  if (urgency === "medium") return "bg-sky-50 text-sky-700 border border-sky-200";
  return "bg-slate-100 text-slate-500 border border-slate-200";
}

function urgencyText(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "Urgent";
  if (urgency === "medium") return "Important";
  return "When ready";
}

export function LegalTimeline({
  steps,
  availableDocuments = [],
  onGenerateDocument,
  slotsStatus = "idle",
}: LegalTimelineProps) {
  const showNotice = availableDocuments.includes("formal_notice");
  const showFiling = availableDocuments.includes("filing_prep_packet");
  const showCta =
    !!onGenerateDocument &&
    slotsStatus === "idle" &&
    (showNotice || showFiling);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-5 print:hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Your legal timeline</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Follow these steps in order. Lawly turns your situation into a clear next-step plan.
        </p>
      </div>

      {/* Steps */}
      <div className="px-5 py-6 sm:px-8">
        <div className="relative">
          {/* Vertical connector line between circles */}
          {steps.length > 1 && (
            <div
              className="absolute left-[15px] top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent"
              aria-hidden="true"
            />
          )}

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => {
              const Icon = getIcon(step.title, i);
              const urg = step.urgency ?? "medium";
              const timing = step.timingLabel;

              return (
                <div key={i} className="relative flex items-start gap-4">
                  {/* Numbered circle */}
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-white">
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 min-w-0 rounded-xl border border-gray-100 border-l-4 ${cardBorderClass(urg)} shadow-sm`}
                  >
                    <div className="px-4 py-3.5">
                      {/* Icon + title */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 text-blue-600" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm leading-snug">
                          {step.title}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${timingPillClass(timing ?? "")}`}
                        >
                          {timing ?? "Next step"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${urgencyPillClass(urg)}`}
                        >
                          {urgencyText(urg)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This timeline is legal information, not legal advice.
        </p>
      </div>

      {/* Document CTA */}
      {showCta && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-5">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">
            Ready to prepare your documents?
          </p>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Generate the document Lawly prepared for this situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            {showNotice && (
              <button
                onClick={() => onGenerateDocument!("formal_notice")}
                className="flex-1 flex items-center justify-between gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-4 py-3 text-left transition-colors group"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">Formal Notice</p>
                  <p className="text-xs text-gray-400">Demand letter for your landlord</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 transition-colors" />
              </button>
            )}
            {showFiling && (
              <button
                onClick={() => onGenerateDocument!("filing_prep_packet")}
                className="flex-1 flex items-center justify-between gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-4 py-3 text-left transition-colors group"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">Filing Prep Packet</p>
                  <p className="text-xs text-gray-400">Case prep if landlord doesn&apos;t respond</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 transition-colors" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
