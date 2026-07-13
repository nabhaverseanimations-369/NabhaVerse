import { describe, expect, it } from "vitest";

import {
  aggregateGlobalActivity,
  createIntelligenceSearchProvider,
  createMockActivityProvider,
  mockIntelligenceActivity,
  mockIntelligenceSearchResults,
} from "@/features/intelligence";

describe("intelligence-search", () => {
  it("returns filtered cross-studio search results", async () => {
    const provider = createIntelligenceSearchProvider(
      "intelligence-search",
      mockIntelligenceSearchResults,
    );

    const response = await provider.search({
      query: "launch",
      limit: 10,
      filters: { category: "collaboration" },
    });

    expect(response.total).toBe(1);
    expect(response.results[0]?.category).toBe("collaboration");
  });

  it("returns suggestions", async () => {
    const provider = createIntelligenceSearchProvider(
      "intelligence-search",
      mockIntelligenceSearchResults,
    );

    const suggestions = await provider.suggest?.({ query: "episode" });
    expect(suggestions?.suggestions.some((entry) => entry.toLowerCase().includes("episode"))).toBe(
      true,
    );
  });

  it("aggregates activity from provider interfaces", async () => {
    const provider = createMockActivityProvider("activity", "character", mockIntelligenceActivity);
    const results = await aggregateGlobalActivity([provider]);

    expect(results).toHaveLength(mockIntelligenceActivity.length);
    expect(results[0]?.id).toBeDefined();
  });
});
