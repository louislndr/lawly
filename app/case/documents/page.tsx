"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Nav } from "@/components/nav";
import { getPersistedCaseById } from "@/lib/user-data";
import { Footer } from "@/components/footer";
import { CaseSharePanel } from "@/components/CaseSharePanel";
import { DocumentsPanel } from "@/components/DocumentsPanel";
import type { CaseData } from "@/types/lawly";
import type { DocumentSlots, DocumentType } from "@/lib/document-templates";

function getAvailableDocuments(caseData: CaseData | null): DocumentType[] {
  if (!caseData?.analysis.supported) return ["formal_notice", "filing_prep_packet"];

  const supported = caseData.analysis.availableDocuments?.filter(
    (document): document is DocumentType =>
      document === "formal_notice" || document === "filing_prep_packet"
  ) ?? [];

  return supported.length > 0
    ? supported
    : ["formal_notice", "filing_prep_packet"];
}

export default function CaseDocumentsPage() {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [caseId, setCaseId] = useState("");
  const [pageStatus, setPageStatus] = useState<"loading" | "ready" | "no_data">("loading");
  const [slots, setSlots] = useState<DocumentSlots | null>(null);
  const [slotsStatus, setSlotsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lawly_case");
    if (stored) {
      try {
        setCaseData(JSON.parse(stored));
        setCaseId(
          sessionStorage.getItem("lawly_case_id") ||
            `LW-${new Date().getFullYear()}-PREVIEW`
        );
        setPageStatus("ready");
        return;
      } catch {
        // Continue to try persisted case by ID.
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("caseId");
    if (caseId) {
      const persisted = getPersistedCaseById(caseId);
      if (persisted) {
        setCaseData({ problem: persisted.problem, analysis: persisted.analysis });
        setCaseId(persisted.id);
        setPageStatus("ready");
        return;
      }
    }

    // Session storage is the handoff from the homepage form to this client route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageStatus("no_data");
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#172b5f]" />
      </div>
    );
  }

  if (pageStatus === "no_data") {
    return (
      <>
        <Nav />
        <main className="mx-auto flex-1 max-w-2xl px-6 py-24 text-center">
          <p className="mb-6 text-slate-500">No case found. Please start from the homepage.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 font-medium text-[#172b5f] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const availableDocuments = getAvailableDocuments(caseData);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#f6f8fc]">
        <section className="px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[980px]">
            <button
              onClick={() => router.push("/case")}
              className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#172b5f] print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to case analysis
            </button>

            <DocumentsPanel
              slotsStatus={slotsStatus}
              slots={slots}
              activeDocument={activeDocument}
              availableDocuments={availableDocuments}
              onGenerateDocument={generateDocument}
              onSetActiveDocument={setActiveDocument}
              onRetry={() => setSlotsStatus("idle")}
              onUpdateSlot={(key, value) =>
                setSlots((prev) => (prev ? { ...prev, [key]: value } : null))
              }
            />

            <div className="mt-5">
              <CaseSharePanel caseId={caseId} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
