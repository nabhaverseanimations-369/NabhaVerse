import type {
  AIJobReference,
  AssetReference,
  CharacterReference,
  EpisodeReference,
  MilestoneReference,
  ProductionTaskReference,
  ReviewReference,
  WorldReference,
} from "@nabhaverse/studio-sdk";

export type ProductionStatus = "active" | "planning" | "on-hold" | "completed";
export type ProductionPriority = "low" | "medium" | "high" | "critical";
export type ProductionHealth = "healthy" | "watch" | "at-risk";
export type ProductionView = "grid" | "list";

export type ShotStageId =
  | "script"
  | "storyboard"
  | "layout"
  | "animation"
  | "lighting"
  | "compositing"
  | "review"
  | "approved";

export interface ProductionTask extends ProductionTaskReference {
  assignee: string;
  dueDate: string;
  labels: readonly string[];
  dependencies: readonly string[];
  recentlyOpenedAt?: string;
  favorite: boolean;
}

export interface ShotPipelineItem {
  id: string;
  shotCode: string;
  title: string;
  stage: ShotStageId;
  assignee: string;
  status: "on-track" | "blocked" | "review";
  dueDate: string;
}

export interface ProductionReview extends ReviewReference {
  owner: string;
  linkedTaskId?: string;
  linkedShotId?: string;
}

export interface ProductionMilestone extends MilestoneReference {
  owner: string;
  notes: string;
}

export interface ProductionReferences {
  characters: readonly CharacterReference[];
  worlds: readonly WorldReference[];
  episodes: readonly EpisodeReference[];
  assets: readonly AssetReference[];
  aiJobs: readonly AIJobReference[];
}

export interface Production {
  id: string;
  name: string;
  status: ProductionStatus;
  owner: string;
  studio: string;
  priority: ProductionPriority;
  completion: number;
  health: ProductionHealth;
  tags: readonly string[];
  favorite: boolean;
  recentlyOpenedAt?: string;
  description: string;
  sprintProgress: string;
  teamWorkload: string;
  pendingReviews: number;
  blockers: number;
  upcomingMilestones: number;
  milestones: readonly ProductionMilestone[];
  tasks: readonly ProductionTask[];
  shotPipeline: readonly ShotPipelineItem[];
  reviews: readonly ProductionReview[];
  references: ProductionReferences;
  deliverables: readonly string[];
  risks: readonly string[];
  reports: readonly string[];
  recentActivity: readonly string[];
}

export interface ProductionLibraryFilters {
  query: string;
  tags: string[];
  status: ProductionStatus[];
  priority: ProductionPriority[];
  favoritesOnly: boolean;
  recentOnly: boolean;
}

export interface ProductionWorkspaceState {
  currentProduction: Production | null;
  currentPlugin: string;
  draftMarkdown: string;
  selectedTaskId: string | null;
  selectedMilestoneId: string | null;
  unsavedChanges: boolean;
}
