import { describe, expect, it } from "vitest";

import { createNavigationSearchProvider } from "@/features/studio/search/navigation-search-provider";

describe("navigation-search-provider", () => {
  it("returns ranked navigation results", async () => {
    const provider = createNavigationSearchProvider("nav", [
      {
        id: "dashboard-home",
        title: "Dashboard",
        description: "Studio overview",
        href: "/dashboard",
        keywords: ["home"],
      },
      {
        id: "production-studio",
        title: "Production Studio",
        description: "Production planning",
        href: "/production/studio",
        keywords: ["production"],
      },
    ]);

    const response = await provider.search({ query: "prod", limit: 10 });

    expect(response.total).toBe(1);
    expect(response.results[0]?.id).toBe("production-studio");
    expect(response.results[0]?.href).toBe("/production/studio");
  });

  it("returns suggestions", async () => {
    const provider = createNavigationSearchProvider("nav", [
      {
        id: "dashboard-home",
        title: "Dashboard",
        description: "Studio overview",
        href: "/dashboard",
        keywords: ["home"],
      },
    ]);

    const suggestions = await provider.suggest?.({ query: "dash" });
    expect(suggestions?.suggestions).toContain("Dashboard");
  });
});
