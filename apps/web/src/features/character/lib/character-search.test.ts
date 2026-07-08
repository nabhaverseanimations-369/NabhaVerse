import { describe, expect, it } from "vitest";

import { mockCharacters } from "@/features/character/data/character-mocks";
import {
  filterAndSortCharacters,
  paginateCharacters,
} from "@/features/character/lib/character-search";

describe("character-search", () => {
  it("filters by query, tags, and status", () => {
    const results = filterAndSortCharacters(mockCharacters, {
      query: "Aurora",
      tags: ["heroic"],
      status: ["approved"],
      favoritesOnly: false,
      recentOnly: false,
      sortBy: "name",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe("chr_aurora");
  });

  it("returns paginated slices and next-page state", () => {
    const results = filterAndSortCharacters(mockCharacters, {
      query: "",
      tags: [],
      status: [],
      favoritesOnly: false,
      recentOnly: false,
      sortBy: "name",
    });

    const pageOne = paginateCharacters(results, 1, 2);
    const pageThree = paginateCharacters(results, 3, 2);

    expect(pageOne.items).toHaveLength(2);
    expect(pageOne.hasNextPage).toBe(true);
    expect(pageThree.items.length).toBeGreaterThan(0);
  });
});
