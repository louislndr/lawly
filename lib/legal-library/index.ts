// Lawly verified Quebec legal library.
// All content here has been manually loaded from official Quebec sources.
// Gemini may only use content exported from this library — never invent rules outside it.

import type { SupportedScenarioId } from "./housing";
import type { UnsupportedScenarioId } from "./unsupported";

export type { VerifiedCitation } from "./quebec-civil-code";
export { CCQ_ARTICLES } from "./quebec-civil-code";

export type {
  TimelineStepType,
  TimelineStep,
  TrustedResource,
  SupportedScenarioId,
  LegalCategory,
  LegalScenario,
} from "./housing";
export {
  DEFAULT_DISCLAIMER_EN,
  DEFAULT_DISCLAIMER_FR,
  trustedResources,
  housingScenarios,
} from "./housing";

export type { UnsupportedScenarioId, UnsupportedEntry } from "./unsupported";
export { unsupportedEntries } from "./unsupported";

export type ScenarioId = SupportedScenarioId | UnsupportedScenarioId;
