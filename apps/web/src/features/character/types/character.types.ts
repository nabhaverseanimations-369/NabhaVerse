export type CharacterStatus = "draft" | "in-review" | "approved" | "archived";

export type CharacterDocumentType =
  | "overview"
  | "character-bible"
  | "design-specifications"
  | "ai-specifications"
  | "model-sheet"
  | "expression-sheet"
  | "pose-sheet"
  | "outfit-sheet"
  | "lighting-sheet"
  | "material-sheet"
  | "environment-sheet"
  | "animation-sheet"
  | "voice-sheet"
  | "sound-sheet"
  | "ai-consistency-sheet"
  | "relationships"
  | "assets"
  | "documents"
  | "version-history"
  | "comments"
  | "activity";

export interface Character {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string;
  status: CharacterStatus;
  owner: string;
  studio: string;
  tags: string[];
  favorite: boolean;
  recentlyOpenedAt?: string;
  updatedAt: string;
  version: string;
  summary: string;
}

export interface CharacterProfile {
  characterId: string;
  archetype: string;
  ageRange: string;
  roleInStory: string;
  motivation: string;
  signatureTraits: string[];
}

export interface CharacterDocument {
  id: string;
  characterId: string;
  type: CharacterDocumentType;
  title: string;
  markdown: string;
  hasUnsavedChanges: boolean;
  saveStatus: "idle" | "saving" | "saved";
  versionLabel: string;
  updatedAt: string;
}

export interface CharacterVersion {
  id: string;
  characterId: string;
  label: string;
  createdAt: string;
  author: string;
  summary: string;
  active: boolean;
}

export interface CharacterAsset {
  id: string;
  characterId: string;
  title: string;
  kind: "image" | "reference" | "document";
  previewUrl: string;
  updatedAt: string;
}

export interface CharacterRelationship {
  id: string;
  characterId: string;
  relatedCharacterId: string;
  relatedName: string;
  relationshipType: "ally" | "rival" | "mentor" | "family" | "team";
  notes: string;
}

export type CharacterLibraryView = "grid" | "list";

export type CharacterSortKey = "name" | "updatedAt" | "recent" | "status";

export interface CharacterLibraryFilters {
  query: string;
  tags: string[];
  status: CharacterStatus[];
  favoritesOnly: boolean;
  recentOnly: boolean;
  sortBy: CharacterSortKey;
}
