import type {
  StudioSearchCategory,
  StudioSearchProvider,
  StudioSearchRequest,
  StudioSearchResult,
  StudioSearchSuggestRequest,
  StudioSearchSuggestResponse,
} from "@nabhaverse/studio-sdk";

export interface NavigationSearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  keywords?: readonly string[];
  category?: StudioSearchCategory;
}

function matchesRequest(item: NavigationSearchItem, request: StudioSearchRequest): boolean {
  const query = request.query.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const haystack =
    `${item.title} ${item.description} ${item.keywords?.join(" ") ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

function scoreItem(item: NavigationSearchItem, query: string): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return 0.1;
  }

  if (item.title.toLowerCase() === normalized) {
    return 1;
  }

  if (item.title.toLowerCase().startsWith(normalized)) {
    return 0.9;
  }

  if ((item.keywords ?? []).some((keyword) => keyword.toLowerCase().startsWith(normalized))) {
    return 0.8;
  }

  return 0.6;
}

export function createNavigationSearchProvider(
  id: string,
  items: readonly NavigationSearchItem[],
): StudioSearchProvider {
  return {
    id,
    supports: ["navigation"],
    async search(request): Promise<{ results: readonly StudioSearchResult[]; total: number }> {
      const results = items
        .filter((item) => matchesRequest(item, request))
        .map((item) => ({
          id: item.id,
          category: item.category ?? "navigation",
          title: item.title,
          description: item.description,
          href: item.href,
          tags: item.keywords ?? [],
          score: scoreItem(item, request.query),
          sourceProvider: id,
        }))
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

      const limited = request.limit ? results.slice(0, request.limit) : results;
      return { results: limited, total: results.length };
    },
    async suggest(request: StudioSearchSuggestRequest): Promise<StudioSearchSuggestResponse> {
      const normalized = request.query.trim().toLowerCase();
      const suggestions = items
        .flatMap((item) => [item.title, ...(item.keywords ?? [])])
        .filter((entry) => entry.toLowerCase().includes(normalized))
        .slice(0, request.limit ?? 8);

      return { suggestions: Array.from(new Set(suggestions)) };
    },
  };
}
