import Image from "next/image";
import { ExternalLink, ShieldCheck } from "lucide-react";

const SOURCES = [
  {
    name: "LegisQuébec",
    label: "Civil Code of Québec articles",
    description: "Official legal text for the rules Lawly cites.",
    logo: "/sources/legisquebec.png",
    url: "https://www.legisquebec.gouv.qc.ca/en/document/cs/ccq-1991",
  },
  {
    name: "Tribunal administratif du logement",
    label: "Housing tribunal information",
    description: "Forms, notices, and tenant-landlord procedure.",
    logo: "/sources/tal.png",
    url: "https://www.tal.gouv.qc.ca/en/",
  },
  {
    name: "Québec.ca",
    label: "Government filing guidance",
    description: "Small claims and formal notice information.",
    logo: "/sources/quebec.png",
    url: "https://www.quebec.ca/en/justice-and-civil-status/small-claims/filing-claim/process-help-applicant/form-sj-870e",
  },
  {
    name: "Éducaloi",
    label: "Plain-language legal information",
    description: "Clear explanations and access-to-justice resources.",
    logo: "/sources/educaloi.png",
    url: "https://educaloi.qc.ca/en/",
  },
];

export function TrustedSources() {
  return (
    <section className="border-t border-slate-200/70 bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Verified sources
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0f1f4a] sm:text-3xl">
            Built on trusted Quebec sources
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Lawly&apos;s verified housing library is based on official Quebec
            legal and procedural sources.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SOURCES.map((src) => (
            <div
              key={src.name}
              className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex h-7 w-7 items-center justify-center">
                    <Image
                      src={src.logo}
                      alt={src.name}
                      width={64}
                      height={64}
                      className="max-h-6 max-w-6 object-contain"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-sm font-semibold leading-5 text-slate-900">
                      {src.name}
                    </h3>
                    <span className="w-fit shrink-0 rounded-full border border-[#f6b21a]/20 bg-[#f6b21a]/10 px-2 py-0.5 text-[11px] font-medium leading-5 text-[#8a6500]">
                      {src.label}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {src.description}
                  </p>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#162f70] underline-offset-4 transition-colors hover:text-[#0f245c] hover:underline"
                  >
                    Visit source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#162f70]/55" />
            <p className="text-sm leading-6 text-slate-500">
              <span className="font-medium text-slate-700">
                Verified housing library loaded:
              </span>{" "}
              C.C.Q. arts. 1904, 1854, 1910, 1942, 1945, 1957, and 1960.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
