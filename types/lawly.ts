export interface TrustedResourceFrontend {
  name: string;
  url: string;
  description: string;
}

export interface CitationFrontend {
  label: string;
  sourceName: string;
  articleOrPage: string;
  sourceUrl: string;
  exactExcerpt: string;
  plainRule: string;
}

export type TimelineStepType =
  | "source_based"
  | "practical_next_step"
  | "needs_verification";

export interface TimelineStepFrontend {
  title: string;
  description: string;
  timingLabel?: string;
  urgency?: "low" | "medium" | "high";
  stepType: TimelineStepType;
}

export interface SupportedAnalysisResult {
  supported: true;
  scenarioId: string;
  category: string;
  title: string;
  explanation: string;
  rightsExplanation: string;
  citations: CitationFrontend[];
  timeline: TimelineStepFrontend[];
  availableDocuments: string[];
  missingInformation: string[];
  keyFacts: string[];
  trustedResources: TrustedResourceFrontend[];
  disclaimer: string;
}

export interface UnsupportedAnalysisResult {
  supported: false;
  category: string;
  title: string;
  plainLanguageSummary: string;
  whatLawlyCanDo: string[];
  documentsToGather: string[];
  questionsToAsk: string[];
  trustedSources: TrustedResourceFrontend[];
  disclaimer: string;
}

export type AnalysisResult = SupportedAnalysisResult | UnsupportedAnalysisResult;

export interface CaseData {
  problem: string;
  analysis: AnalysisResult;
}

export interface SavedCase {
  id: string;
  problem: string;
  category: string;
  createdAt: string;
  lastModified: string;
  analysis: AnalysisResult;
  status: "active" | "resolved" | "archived";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  cases: SavedCase[];
  avatar?: string;
}
