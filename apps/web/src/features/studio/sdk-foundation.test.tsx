import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { Sparkles } from "lucide-react";

import {
  buildStudioPluginLookup,
  createDraftState,
  createStudioCommandRegistry,
  createStudioGlobalSearchService,
  getStudioPluginOrThrow,
  includesQueryFromFields,
  isStudioPluginId,
  markDraftSaved,
  paginateItems,
  resolveStudioRouteSegment,
  useStudioDocumentDraft,
  useStudioSidebarState,
  type StudioPluginDefinition,
  type StudioSearchProvider,
} from "@nabhaverse/studio-sdk";

interface FakeEntity {
  id: string;
}

describe("studio-sdk foundation", () => {
  it("resolves plugin ids and plugin lookups", () => {
    const plugins: readonly StudioPluginDefinition<FakeEntity, "overview" | "details">[] = [
      {
        id: "overview",
        title: "Overview",
        icon: Sparkles,
        category: "overview",
        order: 0,
        route: "/x/:id/overview",
        component: () => null,
        permissions: ["read"],
        validation: ["summary"],
        featureFlags: ["feature"],
        description: "Overview",
      },
      {
        id: "details",
        title: "Details",
        icon: Sparkles,
        category: "reference",
        order: 10,
        route: "/x/:id/details",
        component: () => null,
        permissions: ["read"],
        validation: ["summary"],
        featureFlags: ["feature"],
        description: "Details",
      },
    ];

    const lookup = buildStudioPluginLookup(plugins);
    expect(lookup.get("overview")?.title).toBe("Overview");
    expect(isStudioPluginId("details", plugins)).toBe(true);
    expect(getStudioPluginOrThrow(plugins, "details", "fake").route).toContain("details");
  });

  it("resolves route segments with fallback", () => {
    const resolved = resolveStudioRouteSegment(
      "/production/studio/prd_lunara_s1/overview",
      3,
      (value): value is "overview" | "timeline" => value === "overview" || value === "timeline",
      "overview",
    );

    const fallback = resolveStudioRouteSegment(
      "/production/studio/prd_lunara_s1/not-valid",
      3,
      (value): value is "overview" | "timeline" => value === "overview" || value === "timeline",
      "overview",
    );

    expect(resolved).toBe("overview");
    expect(fallback).toBe("overview");
  });

  it("supports draft state transitions", () => {
    const draft = createDraftState("hello", "idle");
    expect(markDraftSaved(draft).saveStatus).toBe("saved");
  });

  it("supports command registry search", () => {
    const registry = createStudioCommandRegistry([
      {
        id: "navigate:dashboard",
        title: "Dashboard",
        description: "Go to dashboard",
        category: "navigation",
        keywords: ["home"],
        enabledByDefault: true,
      },
    ] as const);

    expect(registry.findById("navigate:dashboard")?.title).toBe("Dashboard");
    expect(registry.search("home")).toHaveLength(1);
  });

  it("supports provider-agnostic global search service", async () => {
    const provider: StudioSearchProvider = {
      id: "test-provider",
      supports: ["navigation"],
      async search() {
        return {
          results: [
            {
              id: "dashboard",
              category: "navigation",
              title: "Dashboard",
              description: "Overview",
              href: "/dashboard",
              tags: ["home"],
              score: 0.8,
              sourceProvider: "test-provider",
            },
          ],
          total: 1,
        };
      },
      async suggest() {
        return { suggestions: ["dashboard"] };
      },
    };

    const service = createStudioGlobalSearchService([provider]);
    const search = await service.search({ query: "dash" });
    const suggest = await service.suggest({ query: "dash" });

    expect(search.total).toBe(1);
    expect(search.results[0]?.title).toBe("Dashboard");
    expect(suggest.suggestions).toContain("dashboard");
  });

  it("covers shared filtering helpers", () => {
    expect(includesQueryFromFields(["Alpha", "Beta"], "alpha")).toBe(true);
    const paginated = paginateItems([1, 2, 3], 1, 2);
    expect(paginated.items).toEqual([1, 2]);
    expect(paginated.hasNextPage).toBe(true);
  });

  it("supports shared sidebar hook", () => {
    const { result } = renderHook(() => useStudioSidebarState(false));
    expect(result.current.collapsed).toBe(false);

    act(() => {
      result.current.toggleCollapsed();
    });

    expect(result.current.collapsed).toBe(true);
  });

  it("supports shared document draft hook", () => {
    const { result } = renderHook(() => useStudioDocumentDraft("initial"));

    act(() => {
      result.current.updateMarkdown("updated");
    });

    expect(result.current.draftState.markdown).toBe("updated");
    expect(result.current.unsavedChanges).toBe(true);

    act(() => {
      result.current.markSaved();
    });

    expect(result.current.draftState.saveStatus).toBe("saved");
    expect(result.current.unsavedChanges).toBe(false);
  });
});
