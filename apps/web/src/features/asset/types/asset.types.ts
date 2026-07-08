import type {
  AssetReference,
  CharacterReference,
  EpisodeReference,
  WorldReference,
} from "@nabhaverse/studio-sdk";

export type AssetStatus = "draft" | "in-review" | "approved" | "archived";

export type AssetType =
  | "image"
  | "concept-art"
  | "character-reference"
  | "storyboard"
  | "background"
  | "video"
  | "audio"
  | "voice-clip"
  | "music"
  | "sound-effect"
  | "document"
  | "pdf"
  | "3d-model"
  | "ai-output";

export type AssetLibraryView = "grid" | "list";

export type AssetSortKey = "updatedAt" | "name" | "recent" | "status" | "type" | "size";

export interface AssetLibraryFilters {
  query: string;
  tags: string[];
  collections: string[];
  types: AssetType[];
  status: AssetStatus[];
  favoritesOnly: boolean;
  recentOnly: boolean;
  sortBy: AssetSortKey;
}

export interface AssetMetadata {
  title: string;
  description: string;
  creator: string;
  license: string;
  resolution: string;
  duration: string;
  dimensions: string;
  keywords: readonly string[];
}

export interface AssetCollection {
  id: string;
  name: string;
  description: string;
  parentCollectionId?: string;
  pinned: boolean;
  favorite: boolean;
  assetCount: number;
  children: readonly AssetCollection[];
}

export interface AssetReferenceBundle {
  characters: readonly CharacterReference[];
  worlds: readonly WorldReference[];
  episodes: readonly EpisodeReference[];
  relatedAssets: readonly AssetReference[];
}

export interface AssetVersion {
  id: string;
  label: string;
  createdAt: string;
  author: string;
  summary: string;
  active: boolean;
}

export interface Asset {
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  owner: string;
  studio: string;
  tags: readonly string[];
  favorite: boolean;
  recentlyUsedAt?: string;
  updatedAt: string;
  version: string;
  sizeLabel: string;
  usageSummary: string;
  summary: string;
  thumbnailLabel: string;
  previewLabel: string;
  previewDescription: string;
  metadata: AssetMetadata;
  collections: readonly string[];
  references: AssetReferenceBundle;
  recentActivity: readonly string[];
  versions: readonly AssetVersion[];
  permissions: readonly string[];
  pinned: boolean;
}

export interface AssetCollectionGroup {
  collection: AssetCollection;
  assets: readonly Asset[];
}

export interface AssetPreviewMode {
  kind: "image" | "video" | "audio" | "document" | "model";
  label: string;
  description: string;
}
