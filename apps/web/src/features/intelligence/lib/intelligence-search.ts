import {
  createStudioGlobalSearchService,
  type StudioSearchFilter,
  type StudioSearchProvider,
  type StudioSearchRequest,
  type StudioSearchResult,
  type StudioSearchSuggestRequest,
  type StudioSearchSuggestResponse,
} from "@nabhaverse/studio-sdk";

import type {
  IntelligenceActivityItem,
  IntelligenceActivityProvider,
  IntelligenceSearchResult,
} from "@/features/intelligence/types/intelligence.types";

function matchesFilters(result: IntelligenceSearchResult, filters?: StudioSearchFilter): boolean {
  if (!filters) {
    return true;
  }

  if (filters.category && result.category !== filters.category) {
    return false;
  }

  if (filters.tags && filters.tags.length > 0) {
    if (!filters.tags.every((tag) => result.tags.includes(tag))) {
      return false;
    }
  }

  if (filters.owner && result.owner !== filters.owner) {
    return false;
  }

  if (filters.favoritesOnly && !result.favorited) {
    return false;
  }

  return true;
}

function matchesQuery(result: IntelligenceSearchResult, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const haystack = `${result.title} ${result.description} ${result.tags.join(" ")} ${
    result.owner ?? ""
  } ${result.studioLabel}`.toLowerCase();

  return haystack.includes(normalized);
}

function scoreResult(result: IntelligenceSearchResult, query: string): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return result.favorited ? 0.65 : 0.4;
  }

  if (result.title.toLowerCase() === normalized) {
    return 1;
  }

  if (result.title.toLowerCase().startsWith(normalized)) {
    return 0.92;
  }

  if (result.tags.some((tag) => tag.toLowerCase().startsWith(normalized))) {
    return 0.83;
  }

  return result.favorited ? 0.78 : 0.68;
}

export function createIntelligenceSearchProvider(
  id: string,
  results: readonly IntelligenceSearchResult[],
): StudioSearchProvider {
  const supports = Array.from(new Set(results.map((result) => result.category)));

  return {
    id,
    supports,
    async search(
      request: StudioSearchRequest,
    ): Promise<{ results: readonly StudioSearchResult[]; total: number }> {
      const matched = results
        .filter((result) => matchesQuery(result, request.query))
        .filter((result) => matchesFilters(result, request.filters))
        .map((result) => ({
          ...result,
          score: scoreResult(result, request.query),
          tags: result.tags,
          sourceProvider: id,
        }))
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

      const limited = request.limit ? matched.slice(0, request.limit) : matched;
      return { results: limited, total: matched.length };
    },
    async suggest(request: StudioSearchSuggestRequest): Promise<StudioSearchSuggestResponse> {
      const normalized = request.query.trim().toLowerCase();
      const suggestions = Array.from(
        new Set(
          results
            .flatMap((result) => [result.title, ...result.tags])
            .filter((entry) => entry.toLowerCase().includes(normalized)),
        ),
      ).slice(0, request.limit ?? 8);

      return { suggestions };
    },
  };
}

export function createIntelligenceSearchService(initialProviders: readonly StudioSearchProvider[]) {
  return createStudioGlobalSearchService(initialProviders);
}

export function createMockActivityProvider(
  id: string,
  studio: IntelligenceActivityProvider["studio"],
  items: readonly IntelligenceActivityItem[],
): IntelligenceActivityProvider {
  return {
    id,
    studio,
    async listActivity() {
      return items;
    },
  };
}

export async function aggregateGlobalActivity(
  providers: readonly IntelligenceActivityProvider[],
): Promise<readonly IntelligenceActivityItem[]> {
  const batches = await Promise.all(providers.map((provider) => provider.listActivity()));
  return batches
    .flatMap((items) => items)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}
