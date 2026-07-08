import type { AssetReference, ModelReference, PromptReference } from "@nabhaverse/studio-sdk";

export type AIProviderName = "openai" | "anthropic" | "google" | "local";
export type AIJobStatus = "pending" | "running" | "completed" | "failed" | "cancelled";
export type AIPromptCategory =
  "story" | "character" | "world" | "dialogue" | "visual" | "audio" | "ops";

export type AIStudioView = "grid" | "list";

export interface AIPromptVariable {
  key: string;
  description: string;
  required: boolean;
  sampleValue: string;
}

export interface AIPromptVersion {
  id: string;
  label: string;
  createdAt: string;
  author: string;
  summary: string;
  active: boolean;
}

export interface AIPrompt extends PromptReference {
  category: AIPromptCategory;
  tags: readonly string[];
  favorite: boolean;
  updatedAt: string;
  content: string;
  summary: string;
  variables: readonly AIPromptVariable[];
  versions: readonly AIPromptVersion[];
  validationNotes: readonly string[];
}

export interface AIModel extends ModelReference {
  provider: AIProviderName;
  family: string;
  modality: string;
  maxContext: string;
  latencyClass: "low" | "balanced" | "high";
  qualityClass: "standard" | "premium";
  status: "available" | "degraded" | "offline";
  notes: string;
}

export interface AIJob {
  id: string;
  name: string;
  promptId: string;
  modelId: string;
  status: AIJobStatus;
  progress: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  outputs: number;
  errorSummary?: string;
}

export interface AIOutput {
  id: string;
  title: string;
  type: "text" | "image" | "audio" | "video" | "scene-pack";
  createdAt: string;
  promptId: string;
  modelId: string;
  jobId: string;
  summary: string;
  favorite: boolean;
  linkedAsset: AssetReference;
}

export interface AIProviderStatus {
  provider: AIProviderName;
  status: "healthy" | "degraded" | "offline";
  queueDepth: number;
  latency: string;
}

export interface AICostOverview {
  periodLabel: string;
  estimatedCost: string;
  trend: string;
  note: string;
}

export interface AIStudioWorkspace {
  id: string;
  name: string;
  description: string;
  prompts: readonly AIPrompt[];
  models: readonly AIModel[];
  jobs: readonly AIJob[];
  outputs: readonly AIOutput[];
  providerStatus: readonly AIProviderStatus[];
  costOverview: AICostOverview;
  activity: readonly string[];
}

export interface AIPromptLibraryFilters {
  query: string;
  categories: AIPromptCategory[];
  tags: string[];
  favoritesOnly: boolean;
}
