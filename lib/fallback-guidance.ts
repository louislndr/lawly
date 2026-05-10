// Compatibility shim — fallback guidance moved to lib/legal-library/unsupported.ts
import { UnsupportedEntry, unsupportedEntries } from "./legal-library";

export type FallbackGuidance = UnsupportedEntry;

export function getFallbackGuidance(category: string): FallbackGuidance {
  const keyMap: Record<string, keyof typeof unsupportedEntries> = {
    work: "unsupported_work",
    consumer: "unsupported_consumer",
    government_notice: "unsupported_government_notice",
    government: "unsupported_government_notice",
    family: "unsupported_family",
    immigration: "unsupported_immigration",
    criminal: "unsupported_criminal",
    debt: "unsupported_debt",
    school: "unsupported_school",
  };
  const key = keyMap[category] ?? "unsupported_unknown";
  return unsupportedEntries[key];
}
