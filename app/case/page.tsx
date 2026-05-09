"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Info,
  AlertCircle,
  FileText,
  HelpCircle,
  ExternalLink,
  Shield,
  Clock,
} from "lucide-react";
import type {
  CaseData,
  SupportedAnalysisResult,
  UnsupportedAnalysisResult,
} from "@/types/lawly";
import type { DocumentType, DocumentSlots } from "@/lib/document-templates";
import { DocumentPreview } from "@/components/DocumentPreview";
import { LegalTimeline } from "@/components/LegalTimeline";

function urgencyLabel(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "Important";
  if (urgency === "medium") return "Soon";
  return "When ready";
}

function urgencyBadgeClass(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "bg-green-50 text-green-700 border border-green-200";
  if (urgency === "medium") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-gray-100 text-gray-600 border border-gray-200";
}

export default function CasePage() {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [pageStatus, setPageStatus] = useState<"loading" | "ready" | "no_data">("loading");
  const [slots, setSlots] = useState<DocumentSlots | null>(null);
  const [slotsStatus, setSlotsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lawly_case");
    if (stored) {
      try {
        setCaseData(JSON.parse(stored));
        setPageStatus("ready");
      } catch {
        setPageStatus("no_data");
      }
    } else {
      setPageStatus("no_data");
    }
  }, []);

  async function generateDocument(type: DocumentType) {
    if (!caseData) return;
    setActiveDocument(type);
    if (slots) return;
    setSlotsStatus("loading");
    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: caseData.problem,
          analysis: caseData.analysis,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setSlots(data.slots);
      setSlotsStatus("ready");
    } catch {
      setSlotsStatus("error");
      setActiveDocument(null);
    }
  }

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
      <main className="liquid-background min-h-screen overflow-hidden">
        <section className="relative min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20">
          <div className="absolute inset-x-0 top-0 h-px bg-white" />

          <div className="relative mx-auto max-w-4xl">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              New search
            </button>

            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 mb-6 print:hidden">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Your situation
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">{problem}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="font-semibold text-gray-900">What this means</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{analysis.plainLanguageSummary}</p>
            </div>

            {analysis.supported ? (
              <SupportedView
                analysis={analysis}
                slotsStatus={slotsStatus}
                slots={slots}
                activeDocument={activeDocument}
                onGenerateDocument={generateDocument}
                onSetActiveDocument={setActiveDocument}
                onRetry={() => setSlotsStatus("idle")}
                onUpdateSlot={(key, value) =>
                  setSlots((prev) => (prev ? { ...prev, [key]: value } : null))
                }
              />
            ) : (
              <UnsupportedView analysis={analysis} />
            )}

            <div className="border border-gray-100 rounded-xl px-5 py-4 bg-gray-50 mb-6 print:hidden">
              <p className="text-xs text-gray-500 leading-relaxed text-center">
                {analysis.disclaimer ||
                  "Lawly provides legal information, not legal advice. This is for general informational purposes only. For advice specific to your situation, consult a licensed lawyer or notary in Quebec."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SupportedView({
  analysis,
  slotsStatus,
  slots,
  activeDocument,
  onGenerateDocument,
  onSetActiveDocument,
  onRetry,
  onUpdateSlot,
}: {
  analysis: SupportedAnalysisResult;
  slotsStatus: "idle" | "loading" | "ready" | "error";
  slots: DocumentSlots | null;
  activeDocument: DocumentType | null;
  onGenerateDocument: (type: DocumentType) => void;
  onSetActiveDocument: (type: DocumentType) => void;
  onRetry: () => void;
  onUpdateSlot: (key: keyof DocumentSlots, value: string) => void;
}) {
  const primaryCitation = analysis.citations?.[0];

  return (
    <>
      {primaryCitation && (
        <div className="bg-blue-600 rounded-2xl p-6 mb-5 text-white print:hidden">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold">{primaryCitation.articleOrPage}</p>
              <p className="text-xs text-blue-200">{primaryCitation.sourceName}</p>
            </div>
          </div>
          {primaryCitation.exactExcerpt && (
            <p className="text-blue-100 text-sm italic leading-relaxed mb-4 pl-10">
              &ldquo;{primaryCitation.exactExcerpt}&rdquo;
            </p>
          )}
          <div className="bg-white/10 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
              In plain language
            </p>
            <p className="text-white text-sm leading-relaxed">{primaryCitation.plainRule}</p>
          </div>
        </div>
      )}

      {analysis.rightsExplanation && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Your rights</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">{analysis.rightsExplanation}</p>
        </div>
      )}

      <LegalTimeline
        steps={analysis.nextSteps}
        availableDocuments={
          analysis.availableDocuments?.length > 0
            ? analysis.availableDocuments
            : ["formal_notice", "filing_prep_packet"]
        }
        onGenerateDocument={onGenerateDocument}
        slotsStatus={slotsStatus}
      />

      {analysis.keyFacts?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-5 print:hidden">
          <p className="text-sm font-semibold text-amber-800 mb-3">Key facts to know</p>
          <ul className="flex flex-col gap-2">
            {analysis.keyFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="print:hidden">{/* loading / error / ready states */}

        {slotsStatus === "loading" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-sm flex flex-col items-center gap-3 text-center mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Generating your document…</p>
          </div>
        )}

        {slotsStatus === "error" && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm text-red-600 mb-2">
              Document generation failed. Please try again.
            </p>
            <button onClick={onRetry} className="text-sm text-red-600 underline">
              Try again
            </button>
          </div>
        )}

        {slotsStatus === "ready" && slots && activeDocument && (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => onSetActiveDocument("formal_notice")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDocument === "formal_notice"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Formal Notice
              </button>
              <button
                onClick={() => onSetActiveDocument("filing_prep_packet")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDocument === "filing_prep_packet"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Filing Prep Packet
              </button>
            </div>
            <DocumentPreview slots={slots} type={activeDocument} onSlotChange={onUpdateSlot} />
          </div>
        )}
      </div>
    </>
  );
}

function UnsupportedView({ analysis }: { analysis: UnsupportedAnalysisResult }) {
  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-5 print:hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-700" />
          </div>
          <h2 className="font-semibold text-amber-900">What you can do</h2>
        </div>
        <p className="text-amber-800 leading-relaxed text-sm">{analysis.safeOrientation}</p>
      </div>

      {analysis.nextSteps?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Next steps</h2>
          </div>
          <ol className="flex flex-col gap-0">
            {analysis.nextSteps.map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < analysis.nextSteps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 my-2" />
                  )}
                </div>
                <div className={`pb-6 ${i === analysis.nextSteps.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 mt-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${urgencyBadgeClass(item.urgency)}`}
                    >
                      {urgencyLabel(item.urgency)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
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

      {analysis.trustedResources?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Trusted resources</h2>
          </div>
          <div className="flex flex-col gap-3">
            {analysis.trustedResources.map((r, i) => (
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
          Lawly does not generate legal documents for this type of case. Contact a legal clinic or
          trusted resource above before filing anything.
        </p>
      </div>
    </>
  );
}
