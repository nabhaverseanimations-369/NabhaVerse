import type { World, WorldLibraryFilters, WorldStatus } from "@/features/world/types/world.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

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
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [world.name, world.description, world.studio, ...world.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
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
    switch (filters.sortBy) {
      case "name":
        return collator.compare(left.name, right.name);
      case "status":
        return statusOrder(left.status) - statusOrder(right.status);
      case "recent": {
        const leftRecent = left.recentlyOpenedAt ? 0 : 1;
        const rightRecent = right.recentlyOpenedAt ? 0 : 1;
        if (leftRecent !== rightRecent) {
          return leftRecent - rightRecent;
        }
        return collator.compare(left.name, right.name);
      }
      case "updatedAt":
      default:
        return collator.compare(left.updatedAt, right.updatedAt);
    }
  });

  return sorted;
}

export function paginateWorlds(
  worlds: readonly World[],
  page: number,
  pageSize: number,
): { items: World[]; hasNextPage: boolean } {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const items = worlds.slice(start, end);
  return { items, hasNextPage: end < worlds.length };
}
