"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Paperclip } from "lucide-react";
import type { DocumentType, DocumentSlots } from "@/lib/document-templates";
import { DocumentPreview } from "@/components/DocumentPreview";

function documentLabel(type: DocumentType) {
  return type === "formal_notice" ? "Formal Notice" : "Filing Prep Packet";
}

function countFieldsToReview(slots: DocumentSlots | null) {
  if (!slots) return 13;
  return Object.values(slots).filter((value) => !String(value || "").trim()).length;
}

export function DocumentsPanel({
  slotsStatus,
  slots,
  activeDocument,
  availableDocuments,
  onGenerateDocument,
  onSetActiveDocument,
  onRetry,
  onUpdateSlot,
}: {
  slotsStatus: "idle" | "loading" | "ready" | "error";
  slots: DocumentSlots | null;
  activeDocument: DocumentType | null;
  availableDocuments: DocumentType[];
  onGenerateDocument: (type: DocumentType) => void;
  onSetActiveDocument: (type: DocumentType) => void;
  onRetry: () => void;
  onUpdateSlot: (key: keyof DocumentSlots, value: string) => void;
}) {
  const selected = activeDocument ?? availableDocuments[0] ?? "formal_notice";
  const fieldsToReview = countFieldsToReview(slots);
  const [evidenceCount, setEvidenceCount] = useState(0);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-lg font-semibold text-[#172b5f]">Your documents</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Prepare the documents connected to this case.
        </p>

        <div className="mt-4 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(["formal_notice", "filing_prep_packet"] as DocumentType[]).map((type) => {
            const enabled = availableDocuments.includes(type);
            const active = selected === type;
            return (
              <button
                key={type}
                type="button"
                disabled={!enabled || slotsStatus === "loading"}
                onClick={() => (slots ? onSetActiveDocument(type) : onGenerateDocument(type))}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-[#172b5f] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {documentLabel(type)}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {fieldsToReview} fields to review
        </p>
      </div>

      <div className="bg-slate-50/80 p-4">
        <section className="mb-4 rounded-lg border border-dashed border-slate-300 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#172b5f]">
                <Paperclip className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Evidence photos</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Attach photos of receipts, messages, lease pages, or move-out condition.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Placeholder only: files are not uploaded or saved yet.
                </p>
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <ImagePlus className="h-4 w-4" />
              Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => setEvidenceCount(event.target.files?.length ?? 0)}
              />
            </label>
          </div>

          {evidenceCount > 0 && (
            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {evidenceCount} photo{evidenceCount === 1 ? "" : "s"} selected for preview only.
            </p>
          )}
        </section>

        {slotsStatus === "idle" && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              Choose a document above to prepare it.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Lawly will prefill what it can from your case description.
            </p>
          </div>
        )}

        {slotsStatus === "loading" && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#172b5f]" />
            <p className="mt-3 text-sm text-slate-500">Preparing document…</p>
          </div>
        )}

        {slotsStatus === "error" && (
          <div className="rounded-lg border border-red-100 bg-white px-4 py-8 text-center">
            <p className="text-sm text-red-600">Document generation failed.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {slotsStatus === "ready" && slots && activeDocument && (
          <DocumentPreview
            slots={slots}
            type={activeDocument}
            onSlotChange={onUpdateSlot}
          />
        )}
      </div>
    </aside>
  );
}
