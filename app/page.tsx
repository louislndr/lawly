import Image from "next/image";
import { Shield } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProblemForm } from "@/components/problem-form";
import { TrustedSources } from "@/components/TrustedSources";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="liquid-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
          <div className="absolute inset-x-0 top-0 h-px bg-white" />

          {/* Animated blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="blob-1 absolute left-[15%] top-[30%] h-[500px] w-[500px] rounded-full bg-[#f6b21a]/30 blur-[90px]" />
            <div className="blob-2 absolute bottom-[20%] right-[15%] h-[480px] w-[480px] rounded-full bg-[#162f70]/25 blur-[90px]" />
            <div className="blob-3 absolute left-[40%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#4a7fd4]/25 blur-[80px]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
            {/* Wordmark */}
            <div className="relative mb-6 flex justify-center">
              <div className="blob-3 absolute left-1/2 top-1/2 h-36 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(246,178,26,0.28),rgba(74,127,212,0.22),rgba(22,47,112,0.18))] blur-2xl" />
              <Image
                src="/lawly-wordmark-transparent.png?v=3"
                alt="Lawly"
                width={126}
                height={55}
                priority
                className="relative h-32 w-auto"
              />
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f1f4a] sm:text-[2.75rem] sm:leading-[1.15]">
              Understand your next legal step.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500">
              Free legal guidance for people in Quebec — renters, workers,
              students, and anyone who needs a clear first step.
            </p>

            {/* Input form */}
            <div className="mt-7">
              <ProblemForm />
            </div>

            {/* Anti-hallucination trust line */}
            <div className="mt-5 flex items-start justify-center gap-1.5 text-xs leading-relaxed text-slate-400">
              <Shield className="mt-1 h-3.5 w-3.5 shrink-0" />
              <span>
                Lawly does not guess legal rules. When a situation is outside its
                verified library, it helps you organize your case and find the
                right resource.
              </span>
            </div>
          </div>
        </section>

        <TrustedSources />
      </main>
      <Footer />
    </>
  );
}
