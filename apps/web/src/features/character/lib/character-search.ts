import type {
  Character,
  CharacterLibraryFilters,
  CharacterStatus,
} from "@/features/character/types/character.types";
import {
  includesQueryFromFields,
  paginateItems,
  sortByCommonSortKey,
} from "@nabhaverse/studio-sdk";

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
  return includesQueryFromFields(
    [character.name, character.owner, character.summary, ...character.tags],
    query,
  );
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
    return sortByCommonSortKey(left, right, filters.sortBy, statusOrder);
  });

  return sorted;
}

export function paginateCharacters(
  characters: readonly Character[],
  page: number,
  pageSize: number,
): { items: Character[]; hasNextPage: boolean } {
  return paginateItems(characters, page, pageSize);
}
