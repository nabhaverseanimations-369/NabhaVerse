import type {
  AssetReference,
  DistributionTargetReference,
  EpisodeReference,
  ProductionTaskReference,
  PublicationReference,
  ReleaseReference,
} from "@nabhaverse/studio-sdk";

export type PublishingStatus = "draft" | "scheduled" | "approved" | "published" | "failed";
export type ReleaseType = "episode" | "trailer" | "short" | "bundle";
export type PublishingView = "grid" | "list";

export interface DistributionTarget extends DistributionTargetReference {
  region: string;
  channel: string;
  updatedAt: string;
}

export interface PublishingRelease extends ReleaseReference {
  publicationId: string;
  releaseType: ReleaseType;
  approvalStatus: "pending" | "approved" | "changes-requested";
  notes: string;
  targets: readonly DistributionTarget[];
}

export interface Publication extends PublicationReference {
  description: string;
  owner: string;
  studio: string;
  tags: readonly string[];
  favorite: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  recentlyOpenedAt?: string;
  updatedAt: string;
  health: "healthy" | "watch" | "at-risk";
  releases: readonly PublishingRelease[];
  references: {
    episodes: readonly EpisodeReference[];
    assets: readonly AssetReference[];
    productionTasks: readonly ProductionTaskReference[];
  };
  releaseNotes: string;
  exportPackage: readonly string[];
  recentActivity: readonly string[];
}

export interface PublishingLibraryFilters {
  query: string;
  scheduledDate: string;
  tags: string[];
  status: PublishingStatus[];
  releaseTypes: ReleaseType[];
  favoritesOnly: boolean;
  scheduledOnly: boolean;
}

export interface PublishingWorkspaceState {
  currentPublication: Publication | null;
  currentPlugin: string;
  selectedReleaseId: string | null;
  selectedTargetId: string | null;
  unsavedChanges: boolean;
  draftMarkdown: string;
}
