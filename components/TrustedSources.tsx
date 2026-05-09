import Image from "next/image";
import { ExternalLink } from "lucide-react";

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
    <section className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-[#f6b21a]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Verified sources
          </p>
        </div>
        <h2 className="mb-3 text-xl font-semibold text-[#0f1f4a] sm:text-2xl">
          Built on trusted Quebec sources
        </h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-slate-500">
          Lawly's verified housing library is based on official Quebec legal
          and procedural sources.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SOURCES.map((src) => (
            <div
              key={src.name}
              className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Top: logo + name */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <Image
                      src={src.logo}
                      alt={src.name}
                      width={64}
                      height={64}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold leading-tight text-[#162f70]">
                    {src.name}
                  </p>
                </div>

                {/* Label chip */}
                <span className="mb-2.5 inline-block rounded-full bg-[#f6b21a]/12 px-2.5 py-0.5 text-xs font-medium text-[#a07200]">
                  {src.label}
                </span>

                {/* Description */}
                <p className="text-xs leading-relaxed text-slate-500">
                  {src.description}
                </p>
              </div>

              {/* Bottom: visit link */}
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-1 text-xs font-medium text-[#162f70]/60 transition-colors hover:text-[#162f70]"
              >
                Visit source
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Verified library + no-hallucination */}
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">
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
