"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export function Nav() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"account" | null>(null);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4">
        <div className="glass-surface pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full px-5">
          <Link
            href="/"
            className="flex items-center font-semibold text-[#162f70] transition-opacity hover:opacity-80"
            aria-label="Lawly home"
          >
            <Image
              src="/lawly-wordmark-transparent.png?v=3"
              alt="Lawly"
              width={126}
              height={55}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("account")}
              className="rounded-full bg-[#162f70] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#203875]"
            >
              Account
            </button>
          </div>
        </div>
      </header>

      {authMode && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/20 px-4 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Account
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#162f70]">
                  Louis Landreau
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAuthMode(null)}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                <p className="text-xs text-slate-600">Email</p>
                <p className="font-medium text-slate-900">landreaulouis02@gmail.com</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                <p className="text-xs text-slate-600">Member since</p>
                <p className="font-medium text-slate-900">May 2026</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setAuthMode(null)}
                className="flex w-full items-center justify-center rounded-lg bg-[#162f70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#203875]"
              >
                View Profile
              </Link>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              You can view your saved cases and access your legal guidance from this account.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
