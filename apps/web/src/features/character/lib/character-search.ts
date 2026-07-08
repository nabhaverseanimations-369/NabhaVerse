import type {
  Character,
  CharacterLibraryFilters,
  CharacterStatus,
} from "@/features/character/types/character.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function statusOrder(status: CharacterStatus): number {
  switch (status) {
    case "approved":
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

function includesQuery(character: Character, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [character.name, character.owner, character.summary, ...character.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

function isRecent(character: Character): boolean {
  return Boolean(character.recentlyOpenedAt);
}

export function filterAndSortCharacters(
  characters: readonly Character[],
  filters: CharacterLibraryFilters,
): Character[] {
  const filtered = characters.filter((character) => {
    if (!includesQuery(character, filters.query)) {
      return false;
    }

    if (filters.tags.length > 0 && !filters.tags.every((tag) => character.tags.includes(tag))) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(character.status)) {
      return false;
    }

    if (filters.favoritesOnly && !character.favorite) {
      return false;
    }

    if (filters.recentOnly && !isRecent(character)) {
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

export function paginateCharacters(
  characters: readonly Character[],
  page: number,
  pageSize: number,
): { items: Character[]; hasNextPage: boolean } {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const items = characters.slice(start, end);
  const hasNextPage = end < characters.length;
  return { items, hasNextPage };
}
