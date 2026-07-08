import type { StudioSortKey } from "../types/common";

export interface StudioFilterContract<TStatus extends string = string> {
  query: string;
  tags: string[];
  status: TStatus[];
  favoritesOnly: boolean;
  recentOnly: boolean;
  sortBy: StudioSortKey;
}
