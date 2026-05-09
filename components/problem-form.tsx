"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, ArrowRight, Loader2 } from "lucide-react";


type AnySR = new () => any;

function getSR(): AnySR | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
}

export function ProblemForm() {
  const router = useRouter();
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const srRef = useRef<any>(null);
  const problemRef = useRef(problem);

  useEffect(() => {
    problemRef.current = problem;
  }, [problem]);

  useEffect(() => {
    return () => {
      srRef.current?.abort?.();
    };
  }, []);

  function toggleListening() {
    if (listening) {
      srRef.current?.stop?.();
      setListening(false);
      return;
    }

    const SR = getSR();
    if (!SR) {
      setMicError("Voice input isn't supported in this browser.");
      return;
    }

    setMicError("");
    const sr = new SR();
    srRef.current = sr;
    sr.continuous = false;
    sr.interimResults = false;
    sr.lang = "en-CA";

    sr.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        const existing = problemRef.current;
        const sep = existing && !existing.endsWith(" ") ? " " : "";
        setProblem(existing + sep + transcript);
      }
    };

    sr.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMicError("Microphone access was blocked.");
      }
      setListening(false);
    };

    sr.onend = () => setListening(false);

    try {
      sr.start();
      setListening(true);
    } catch {
      setMicError("Could not start voice input.");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = problem.trim();
    if (trimmed.length < 20) {
      setError("Please describe your situation in a bit more detail.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed");
      }

      const analysis = await res.json();
      sessionStorage.setItem(
        "lawly_case",
        JSON.stringify({ problem: trimmed, analysis })
      );
      router.push("/case");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  }

  return (
    <form
      id="problem"
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Listening indicator */}
        {listening && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs font-medium text-slate-500">
              Listening… speak now
            </span>
          </div>
        )}

        {/* Textarea */}
        <textarea
          id="problem-input"
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            if (error) setError("");
          }}
          placeholder="Tell Lawly what happened. You can write it like you would explain it to a friend."
          disabled={isLoading}
          rows={4}
          className="w-full bg-transparent px-4 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
        />

        {/* Divider */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex-1" />

          {/* Mic button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            title={listening ? "Stop listening" : "Start voice input"}
            className={`rounded-full w-8 h-8 flex items-center justify-center transition-all disabled:opacity-40 hover:bg-slate-50 ${
              listening
                ? "text-red-500 ring-2 ring-red-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !problem.trim()}
            className="bg-[#162f70] text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-[#1a3a8a] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                Analyze my situation
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {(micError || error) && (
        <div className="mt-3 text-center text-sm text-red-600">
          {micError || error}
        </div>
      )}
    </form>
  );
}
