export type WorldStatus = "draft" | "in-review" | "published" | "archived";

export type WorldPluginId =
  | "overview"
  | "geography"
  | "locations"
  | "regions"
  | "kingdoms"
  | "cities"
  | "landmarks"
  | "history"
  | "timeline"
  | "culture"
  | "languages"
  | "religion"
  | "government"
  | "economy"
  | "technology"
  | "species"
  | "organizations"
  | "magic-system"
  | "rules"
  | "climate"
  | "maps"
  | "assets"
  | "documents"
  | "relationships"
  | "version-history"
  | "comments"
  | "activity";

export interface World {
  id: string;
  slug: string;
  name: string;
  coverImageUrl?: string;
  description: string;
  status: WorldStatus;
  studio: string;
  tags: string[];
  favorite: boolean;
  recentlyOpenedAt?: string;
  updatedAt: string;
  version: string;
  timelineSummary: string;
  statistics: {
    regions: number;
    locations: number;
    cultures: number;
    species: number;
  };
}

export interface WorldProfile {
  worldId: string;
  tone: string;
  scale: string;
  era: string;
  corePremise: string;
  signatureElements: string[];
}

export interface WorldDocument {
  id: string;
  worldId: string;
  type: WorldPluginId;
  title: string;
  markdown: string;
  versionLabel: string;
  saveStatus: "idle" | "saving" | "saved";
  hasUnsavedChanges: boolean;
  updatedAt: string;
}

export interface WorldVersion {
  id: string;
  worldId: string;
  label: string;
  createdAt: string;
  author: string;
  summary: string;
  active: boolean;
}

export interface WorldAsset {
  id: string;
  worldId: string;
  title: string;
  kind: "map" | "image" | "document";
  previewUrl: string;
  updatedAt: string;
}

export interface WorldRelationship {
  id: string;
  worldId: string;
  relatedWorldId: string;
  relatedName: string;
  relationshipType: "ally" | "trade" | "conflict" | "shared-history";
  notes: string;
}

export type WorldLibraryView = "grid" | "list";
export type WorldSortKey = "name" | "updatedAt" | "recent" | "status";

export interface WorldLibraryFilters {
  query: string;
  tags: string[];
  status: WorldStatus[];
  favoritesOnly: boolean;
  recentOnly: boolean;
  sortBy: WorldSortKey;
}
