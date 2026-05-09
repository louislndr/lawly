"use client";

import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-3">
      <div className="glass-surface pointer-events-auto mx-auto flex h-12 max-w-6xl items-center justify-between rounded-full px-5">
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

        <div className="glass-control hidden rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 sm:block">
          Free · No account
        </div>
      </div>
    </header>
  );
}
