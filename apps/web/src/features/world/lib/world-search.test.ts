import { describe, expect, it } from "vitest";

import { mockWorlds } from "@/features/world/data/world-mocks";
import { filterAndSortWorlds, paginateWorlds } from "@/features/world/lib/world-search";

describe("world-search", () => {
  it("filters by query, tags, and status", () => {
    const results = filterAndSortWorlds(mockWorlds, {
      query: "Lantern",
      tags: ["coastal"],
      status: ["published"],
      favoritesOnly: true,
      recentOnly: false,
      sortBy: "name",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe("wld_lunara");
  });

  it("returns paginated slices and next-page state", () => {
    const results = filterAndSortWorlds(mockWorlds, {
      query: "",
      tags: [],
      status: [],
      favoritesOnly: false,
      recentOnly: false,
      sortBy: "name",
    });

    const pageOne = paginateWorlds(results, 1, 2);
    const pageTwo = paginateWorlds(results, 2, 2);

    expect(pageOne.items).toHaveLength(2);
    expect(pageOne.hasNextPage).toBe(true);
    expect(pageTwo.items).toHaveLength(2);
    expect(pageTwo.hasNextPage).toBe(false);
  });
});
