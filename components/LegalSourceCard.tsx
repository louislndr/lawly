import { BookOpen, ExternalLink } from "lucide-react";
import type { CitationFrontend } from "@/types/lawly";

export function LegalSourceCard({ citation }: { citation: CitationFrontend }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <BookOpen className="h-4 w-4 text-[#172b5f]/70" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Legal source
            </p>
            <h2 className="mt-1 text-base font-semibold text-[#172b5f]">
              {citation.sourceName}
            </h2>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {citation.articleOrPage}
        </span>
      </div>

      {citation.exactExcerpt && (
        <blockquote className="mt-5 border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-700">
          &ldquo;{citation.exactExcerpt}&rdquo;
        </blockquote>
      )}

      <div className="mt-5 rounded-lg border border-slate-200 bg-[#f8fafc] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Plain-language rule
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{citation.plainRule}</p>
      </div>

      {citation.sourceUrl && (
        <a
          href={citation.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#172b5f] underline-offset-4 hover:underline"
        >
          View source
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </section>
  );
}
