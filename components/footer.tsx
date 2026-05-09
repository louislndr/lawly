import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#dbe3f0] bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-3" aria-label="Lawly home">
              <div className="relative h-7 w-7 overflow-hidden rounded-md border border-[#dbe3f0] bg-white">
                <Image
                  src="/lawly-mascot-transparent.png"
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </div>
              <Image
                src="/lawly-wordmark-transparent.png"
                alt="Lawly"
                width={92}
                height={40}
                className="h-5 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Legal help, made simple. For Quebec renters, workers, students,
              seniors, and anyone who needs a first step.
            </p>
          </div>

          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Important disclaimer
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Lawly is not a lawyer. It provides legal information and
              preparation support, not legal advice. For advice specific to
              your situation, consult a licensed lawyer or notary in Quebec.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3 text-xs text-gray-400">
          <span>© 2026 Lawly · Made for people in Quebec</span>
          <span>
            Lawly does not replace a lawyer ·{" "}
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Privacy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
