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

export interface NextStepSupported {
  title: string;
  description: string;
  timingLabel: string;
  urgency: "low" | "medium" | "high";
}

export interface NextStepUnsupported {
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
}

export interface SupportedAnalysisResult {
  supported: true;
  scenarioId: string;
  category: string;
  plainLanguageSummary: string;
  rightsExplanation: string;
  citations: CitationFrontend[];
  nextSteps: NextStepSupported[];
  availableDocuments: string[];
  missingInformation: string[];
  keyFacts: string[];
  trustedResources: TrustedResourceFrontend[];
  disclaimer: string;
}

export interface UnsupportedAnalysisResult {
  supported: false;
  category: string;
  plainLanguageSummary: string;
  safeOrientation: string;
  nextSteps: NextStepUnsupported[];
  documentsToGather: string[];
  questionsToAsk: string[];
  trustedResources: TrustedResourceFrontend[];
  documentOptions: string[];
  disclaimer: string;
}

export type AnalysisResult = SupportedAnalysisResult | UnsupportedAnalysisResult;

export interface CaseData {
  problem: string;
  analysis: AnalysisResult;
}
