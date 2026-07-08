export interface StudioSearchContract {
  query: string;
}

export interface StudioSearchIndexContract {
  title: string;
  description?: string;
  tags?: string[];
  owner?: string;
  studio?: string;
}

export type StudioSearchCategory =
  | "navigation"
  | "character"
  | "world"
  | "episode"
  | "asset"
  | "ai"
  | "production"
  | "publishing"
  | "collaboration"
  | "intelligence"
  | "documentation"
  | "command";

export interface StudioSearchFilter {
  category?: StudioSearchCategory;
  tags?: readonly string[];
  owner?: string;
  studio?: string;
  favoritesOnly?: boolean;
}

export interface StudioSearchResult {
  id: string;
  category: StudioSearchCategory;
  title: string;
  description: string;
  href?: string;
  tags: readonly string[];
  score: number;
  sourceProvider: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface StudioSearchRequest {
  query: string;
  limit?: number;
  filters?: StudioSearchFilter;
}

export interface StudioSearchResponse {
  results: readonly StudioSearchResult[];
  total: number;
}

export interface StudioSearchSuggestRequest {
  query: string;
  limit?: number;
}

export interface StudioSearchSuggestResponse {
  suggestions: readonly string[];
}

export interface StudioSearchProvider {
  id: string;
  supports: readonly StudioSearchCategory[];
  search: (request: StudioSearchRequest) => Promise<StudioSearchResponse>;
  suggest?: (request: StudioSearchSuggestRequest) => Promise<StudioSearchSuggestResponse>;
}

export interface StudioGlobalSearchService {
  registerProvider: (provider: StudioSearchProvider) => void;
  unregisterProvider: (providerId: string) => void;
  search: (request: StudioSearchRequest) => Promise<StudioSearchResponse>;
  suggest: (request: StudioSearchSuggestRequest) => Promise<StudioSearchSuggestResponse>;
}

function scoreSort(left: StudioSearchResult, right: StudioSearchResult): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }
  return left.title.localeCompare(right.title);
}

export function createStudioGlobalSearchService(
  initialProviders: readonly StudioSearchProvider[] = [],
): StudioGlobalSearchService {
  const providers = new Map<string, StudioSearchProvider>(
    initialProviders.map((provider) => [provider.id, provider]),
  );

  return {
    registerProvider(provider) {
      providers.set(provider.id, provider);
    },
    unregisterProvider(providerId) {
      providers.delete(providerId);
    },
    async search(request) {
      const responses = await Promise.all(
        Array.from(providers.values()).map((provider) => provider.search(request)),
      );

      const merged = responses.flatMap((response) => response.results);
      const sorted = [...merged].sort(scoreSort);
      const limited = request.limit ? sorted.slice(0, request.limit) : sorted;
      return { results: limited, total: merged.length };
    },
    async suggest(request) {
      const responses = await Promise.all(
        Array.from(providers.values())
          .filter((provider) => provider.suggest)
          .map((provider) => provider.suggest!(request)),
      );

      const suggestions = Array.from(
        new Set(responses.flatMap((response) => response.suggestions.map((entry) => entry.trim()))),
      )
        .filter((entry) => entry.length > 0)
        .slice(0, request.limit ?? 10);

      return { suggestions };
    },
  };
}
