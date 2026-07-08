import type { World, WorldLibraryFilters, WorldStatus } from "@/features/world/types/world.types";
import {
  includesQueryFromFields,
  paginateItems,
  sortByCommonSortKey,
} from "@nabhaverse/studio-sdk";

function statusOrder(status: WorldStatus): number {
  switch (status) {
    case "published":
      return 0;
    case "in-review":
      return 1;
    case "draft":
      return 2;
    case "archived":
      return 3;
    default:
      return 99;
  }
}

function matchesQuery(world: World, query: string): boolean {
  return includesQueryFromFields(
    [world.name, world.description, world.studio, ...world.tags],
    query,
  );
}

export function filterAndSortWorlds(
  worlds: readonly World[],
  filters: WorldLibraryFilters,
): World[] {
  const filtered = worlds.filter((world) => {
    if (!matchesQuery(world, filters.query)) {
      return false;
    }
    if (filters.tags.length > 0 && !filters.tags.every((tag) => world.tags.includes(tag))) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(world.status)) {
      return false;
    }
    if (filters.favoritesOnly && !world.favorite) {
      return false;
    }
    if (filters.recentOnly && !world.recentlyOpenedAt) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((left, right) => {
    return sortByCommonSortKey(left, right, filters.sortBy, statusOrder);
  });

  return sorted;
}

export function paginateWorlds(
  worlds: readonly World[],
  page: number,
  pageSize: number,
): { items: World[]; hasNextPage: boolean } {
  return paginateItems(worlds, page, pageSize);
}
