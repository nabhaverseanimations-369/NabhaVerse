interface BaseReference {
  id: string;
}

interface NamedReference extends BaseReference {
  name: string;
}

interface DescribedReference extends NamedReference {
  description: string;
}

export type CharacterReference = DescribedReference;

export type WorldReference = DescribedReference;

export interface LocationReference extends DescribedReference {
  worldId?: string;
}

export interface AssetReference extends DescribedReference {
  kind?: string;
}

export interface EpisodeReference extends DescribedReference {
  season?: number;
  episodeNumber?: number;
}

export interface AIJobReference extends NamedReference {
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
}

export interface PromptReference extends DescribedReference {
  version: string;
}

export interface ModelReference extends DescribedReference {
  provider: string;
}

export interface ProductionTaskReference extends BaseReference {
  title: string;
  status: "todo" | "in-progress" | "in-review" | "blocked" | "done";
  priority: "low" | "medium" | "high" | "critical";
}

export interface ReviewReference extends BaseReference {
  title: string;
  status: "pending" | "approved" | "changes-requested";
  dueAt?: string;
}

export interface MilestoneReference extends BaseReference {
  title: string;
  targetDate: string;
  completion: number;
  status: "planned" | "at-risk" | "on-track" | "completed";
}
