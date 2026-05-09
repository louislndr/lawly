"use client";

import { type ComponentType, useEffect, useState } from "react";

const FRAMER_EYES_URL = "https://framer.com/m/eyes-ZYGv.js@FfIIKDynKRXjqznTXtaR";

type FramerModule = {
  default?: ComponentType<Record<string, unknown>>;
};

function LocalEyesFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-[18%]">
      <span className="relative block h-[82%] w-[31%] rounded-full bg-[#162f70] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.16)]">
        <span className="absolute left-[23%] top-[17%] h-[24%] w-[24%] rounded-full bg-white" />
      </span>
      <span className="relative block h-[82%] w-[31%] rounded-full bg-[#162f70] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.16)]">
        <span className="absolute left-[23%] top-[17%] h-[24%] w-[24%] rounded-full bg-white" />
      </span>
    </div>
  );
}

export function MascotEyesOverlay() {
  const [Eyes, setEyes] = useState<ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEyes() {
      try {
        // new Function prevents Turbopack from statically analyzing this import
        const dynamicImport = new Function("url", "return import(url)");
        const mod = (await dynamicImport(FRAMER_EYES_URL)) as FramerModule;

        if (isMounted && mod.default) {
          setEyes(() => mod.default ?? null);
        }
      } catch {
        if (isMounted) setEyes(null);
      }
    }

    loadEyes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-[39%] z-10 h-[26%] w-[52%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
      {Eyes ? (
        <Eyes style={{ width: "100%", height: "100%" }} />
      ) : (
        <LocalEyesFallback />
      )}
    </div>
  );
}
