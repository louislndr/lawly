"use client";

import { Check, Copy, Link2, Save, UsersRound } from "lucide-react";
import { useState } from "react";

export function CaseSharePanel({ caseId }: { caseId: string }) {
  const [copied, setCopied] = useState(false);
  const shareLink =
    typeof window === "undefined"
      ? `lawly.app/case/${caseId}`
      : `${window.location.origin}/case/${caseId}`;

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Saved case placeholder
          </p>
          <h2 className="mt-2 text-base font-semibold text-[#172b5f]">
            Case ID {caseId}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            In a real account, this case could be saved and shared with a parent,
            close family member, student support office, or someone helping an
            elderly user.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Save className="h-4 w-4" />
            Save to account
          </button>
          <button
            type="button"
            onClick={copyShareLink}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172b5f] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#203875]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy share link"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{shareLink}</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
          <UsersRound className="h-4 w-4" />
          Family share placeholder
        </div>
      </div>
    </section>
  );
}
