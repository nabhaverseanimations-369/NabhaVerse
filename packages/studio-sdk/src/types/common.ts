export type StudioSaveStatus = "idle" | "saving" | "saved";

export type StudioLibraryView = "grid" | "list";

export type StudioSortKey = "name" | "updatedAt" | "recent" | "status";

export interface StudioEntitySummary<TStatus extends string = string> {
  id: string;
  name: string;
  tags: string[];
  favorite: boolean;
  updatedAt: string;
  recentlyOpenedAt?: string;
  status: TStatus;
}
