"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getPersistedCaseById } from "@/lib/user-data";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import type {
  CaseData,
  SupportedAnalysisResult,
  UnsupportedAnalysisResult,
} from "@/types/lawly";
import { CaseChecklist } from "@/components/CaseChecklist";
import { CaseHeader } from "@/components/CaseHeader";
import { LegalAnalysisPanel } from "@/components/LegalAnalysisPanel";
import { LegalSourceCard } from "@/components/LegalSourceCard";
import { LegalTimeline } from "@/components/LegalTimeline";

export default function CasePage() {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [pageStatus, setPageStatus] = useState<"loading" | "ready" | "no_data">("loading");

  useEffect(() => {
    const stored = sessionStorage.getItem("lawly_case");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCaseData(JSON.parse(stored));
        setPageStatus("ready");
        return;
      } catch {
        // Fall through to try persisted case by ID.
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("caseId");
    if (caseId) {
      const persisted = getPersistedCaseById(caseId);
      if (persisted) {
        const casePayload = { problem: persisted.problem, analysis: persisted.analysis };
        sessionStorage.setItem(
          "lawly_case",
          JSON.stringify({ ...casePayload, caseId: persisted.id })
        );
        sessionStorage.setItem("lawly_case_id", persisted.id);
        setCaseData(casePayload);
        setPageStatus("ready");
        return;
      }
    }

    setPageStatus("no_data");
  }, []);

  if (pageStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (pageStatus === "no_data") {
    return (
      <>
        <Nav />
        <main className="flex-1 max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-gray-500 mb-6">No case found. Please start from the homepage.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const { analysis, problem } = caseData!;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#f6f8fc]">
        <section className="px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <button
              onClick={() => router.push("/")}
              className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#172b5f] print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              New search
            </button>

            <CaseHeader
              title={analysis.supported ? analysis.title : analysis.title}
              supported={analysis.supported}
            />

            <div className="mt-6 space-y-5">
              <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Your situation
                </p>
                <p className="text-sm leading-6 text-slate-700">{problem}</p>
              </section>

              {analysis.supported ? (
                <>
                  <SupportedView analysis={analysis} />
                  <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-[#172b5f]">
                        Ready to prepare your documents?
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Open the document workspace for the formal notice and filing prep packet.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/case/documents")}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172b5f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#203875]"
                    >
                      Your documents
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </section>
                </>
              ) : (
                <UnsupportedView analysis={analysis} />
              )}

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 print:hidden">
                <p className="text-center text-xs leading-5 text-slate-500">
                  {analysis.disclaimer ||
                    "Lawly provides legal information, not legal advice. This is for general informational purposes only. For advice specific to your situation, consult a licensed lawyer or notary in Quebec."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SupportedView({ analysis }: { analysis: SupportedAnalysisResult }) {
  const primaryCitation = analysis.citations?.[0];

  return (
    <>
      <LegalAnalysisPanel
        summary={analysis.explanation}
        rights={analysis.rightsExplanation}
        importantFacts={analysis.keyFacts}
      />

      {primaryCitation && <LegalSourceCard citation={primaryCitation} />}

      <LegalTimeline steps={analysis.timeline} />

      <CaseChecklist />
    </>
  );
}

function UnsupportedView({ analysis }: { analysis: UnsupportedAnalysisResult }) {
  return (
    <>
      {analysis.whatLawlyCanDo?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-5 print:hidden">
          <h2 className="font-semibold text-amber-900 mb-3">
            What Lawly can do for you
          </h2>
          <p className="text-amber-800 leading-relaxed text-sm mb-4">
            {analysis.plainLanguageSummary}
          </p>
          <ul className="flex flex-col gap-2">
            {analysis.whatLawlyCanDo.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.documentsToGather?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Documents to gather</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {analysis.documentsToGather.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.questionsToAsk?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Questions to ask a professional</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {analysis.questionsToAsk.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.trustedSources?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Trusted sources to check</h2>
          </div>
          <div className="flex flex-col gap-3">
            {analysis.trustedSources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 rounded-xl px-4 py-3 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-blue-700">
                    {r.name}
                  </p>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 text-center print:hidden">
        <p className="text-sm text-gray-500">
          Lawly does not generate legal documents for this type of case. Contact a legal
          clinic or trusted source above before filing anything.
        </p>
      </div>
    </>
  );
}
