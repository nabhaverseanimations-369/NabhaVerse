export type EpisodeStatus = "draft" | "in-review" | "approved" | "archived";

export type EpisodeLibraryView = "grid" | "list";

export type EpisodeSortKey =
  "updatedAt" | "name" | "recent" | "status" | "episodeNumber" | "season";

export type EpisodePluginId =
  | "overview"
  | "story-outline"
  | "script"
  | "scene-list"
  | "storyboard"
  | "shot-list"
  | "character-cast"
  | "locations"
  | "props"
  | "assets"
  | "production-notes"
  | "version-history"
  | "comments"
  | "activity";

export interface EpisodeLibraryFilters {
  query: string;
  tags: string[];
  status: EpisodeStatus[];
  favoritesOnly: boolean;
  recentOnly: boolean;
  sortBy: EpisodeSortKey;
}

export interface EpisodeScene {
  id: string;
  sceneNumber: string;
  title: string;
  status: "planned" | "draft" | "blocked" | "approved";
  characters: readonly string[];
  locations: readonly string[];
  estimatedDuration: string;
  summary: string;
  order: number;
}

export interface EpisodeShot {
  id: string;
  shotNumber: string;
  title: string;
  cameraNotes: string;
  timing: string;
  comments: string;
  thumbnailLabel: string;
}

export interface EpisodeReferenceItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface Episode {
  id: string;
  slug: string;
  title: string;
  episodeNumber: number;
  season: number;
  status: EpisodeStatus;
  owner: string;
  studio: string;
  tags: readonly string[];
  favorite: boolean;
  recentlyOpenedAt?: string;
  updatedAt: string;
  version: string;
  estimatedDuration: string;
  summary: string;
  recentActivity: readonly string[];
  characterIds: readonly string[];
  worldIds: readonly string[];
  locationNames: readonly string[];
  propNames: readonly string[];
  assetNames: readonly string[];
  notes: string;
  scenes: readonly EpisodeScene[];
  shots: readonly EpisodeShot[];
}

export interface EpisodeSeasonGroup {
  season: number;
  episodes: readonly Episode[];
}
