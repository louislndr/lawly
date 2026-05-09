"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

type SpeechRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "phrases-not-supported"
  | "service-not-allowed";

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResultEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type VoiceInputButtonProps = {
  currentText?: string;
  onTranscript: (text: string) => void;
};

const UNSUPPORTED_MESSAGE =
  "Voice input is not supported in this browser. You can still type your situation.";
const PERMISSION_DENIED_MESSAGE =
  "Microphone access was blocked. You can still type your situation.";

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function appendTranscript(currentText: string | undefined, transcript: string) {
  const existing = currentText ?? "";
  const spokenText = transcript.trim();
  if (!spokenText) return existing;

  const separator =
    existing.trim().length === 0 || /\s$/.test(existing) ? "" : " ";

  return `${existing}${separator}${spokenText}`;
}

export function VoiceInputButton({
  currentText,
  onTranscript,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const currentTextRef = useRef(currentText);

  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    },
    []
  );

  function startListening() {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setMessage(UNSUPPORTED_MESSAGE);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-CA";

    recognition.onresult = (event) => {
      const transcriptParts: string[] = [];

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcriptParts.push(event.results[i][0]?.transcript ?? "");
      }

      const transcript = transcriptParts.join(" ").trim();
      if (transcript) {
        onTranscript(appendTranscript(currentTextRef.current, transcript));
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMessage(PERMISSION_DENIED_MESSAGE);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      setMessage("");
      recognition.start();
      setIsListening(true);
    } catch (error) {
      setIsListening(false);
      setMessage(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? PERMISSION_DENIED_MESSAGE
          : "Voice input could not start. You can still type your situation."
      );
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          className="group relative flex h-36 w-36 items-center justify-center rounded-full outline-none transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Speak"
        >
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-white via-neutral-100 to-neutral-300 blur-xl ${
              isListening ? "animate-pulse opacity-80" : "opacity-55"
            }`}
          />
          <span className="absolute inset-3 rounded-full border border-white/80 bg-[radial-gradient(circle_at_35%_25%,#ffffff_0%,#f2f2f1_38%,#c7c7c5_100%)] shadow-[inset_0_10px_30px_rgba(255,255,255,0.92),inset_0_-18px_40px_rgba(0,0,0,0.14),0_22px_55px_rgba(15,23,42,0.18)]" />
          <span className="absolute inset-8 rounded-full border border-white/70 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.98),rgba(255,255,255,0.38)_42%,rgba(0,0,0,0.08)_100%)]" />
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white/85 text-neutral-950 shadow-sm backdrop-blur">
            <Mic className="h-5 w-5" />
          </span>
        </button>

        {isListening && (
          <button
            type="button"
            onClick={stopListening}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Square className="h-3 w-3" />
            Stop
          </button>
        )}
      </div>

      <p className="text-xs font-medium text-neutral-600">
        {isListening ? "Listening..." : "Speak"}
      </p>

      {message && (
        <p className="max-w-md text-center text-xs leading-5 text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}
