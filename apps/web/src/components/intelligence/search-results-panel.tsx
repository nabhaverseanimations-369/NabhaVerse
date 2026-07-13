"use client";

import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@nabhaverse/ui";

import {
  createIntelligenceSearchProvider,
  createIntelligenceSearchService,
  mockIntelligenceSearchResults,
  mockSavedSearches,
  type IntelligenceSavedSearch,
  type IntelligenceSearchPanelState,
  type IntelligenceSearchResult,
} from "@/features/intelligence";
import type { StudioSearchCategory } from "@nabhaverse/studio-sdk";

const categories: readonly (StudioSearchCategory | "all")[] = [
  "all",
  "character",
  "world",
  "episode",
  "asset",
  "ai",
  "production",
  "publishing",
  "collaboration",
  "intelligence",
];

const initialState: IntelligenceSearchPanelState = {
  query: "",
  category: "all",
  selectedTags: [],
};

export function SearchResultsPanel({
  initialResults = mockIntelligenceSearchResults,
  initialSavedSearches = mockSavedSearches,
  initialHistory = ["launch review", "episode 12", "publishing release"],
}: {
  initialResults?: readonly IntelligenceSearchResult[];
  initialSavedSearches?: readonly IntelligenceSavedSearch[];
  initialHistory?: readonly string[];
}): React.JSX.Element {
  const [state, setState] = React.useState<IntelligenceSearchPanelState>(initialState);
  const [results, setResults] = React.useState<readonly IntelligenceSearchResult[]>(initialResults);
  const [history, setHistory] = React.useState<readonly string[]>(initialHistory);

  const service = React.useMemo(() => {
    const provider = createIntelligenceSearchProvider("intelligence-search", initialResults);
    return createIntelligenceSearchService([provider]);
  }, [initialResults]);

  const allTags = React.useMemo(
    () => Array.from(new Set(initialResults.flatMap((result) => result.tags))).sort(),
    [initialResults],
  );

  React.useEffect(() => {
    let cancelled = false;

    void service
      .search({
        query: state.query,
        limit: 20,
        filters: {
          ...(state.category !== "all" ? { category: state.category } : {}),
          ...(state.selectedTags.length > 0 ? { tags: state.selectedTags } : {}),
        },
      })
      .then((response) => {
        if (cancelled) {
          return;
        }

        setResults(
          response.results
            .map((result) => initialResults.find((entry) => entry.id === result.id))
            .filter((entry): entry is IntelligenceSearchResult => entry !== undefined),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [initialResults, service, state]);

  function applySavedSearch(savedSearch: IntelligenceSavedSearch): void {
    setState({
      query: savedSearch.query,
      category: savedSearch.category,
      selectedTags: savedSearch.tags,
    });
    setHistory((current) => Array.from(new Set([savedSearch.query, ...current])).slice(0, 6));
  }

  function toggleTag(tag: string): void {
    setState((current) => ({
      ...current,
      selectedTags: current.selectedTags.includes(tag)
        ? current.selectedTags.filter((entry) => entry !== tag)
        : [...current.selectedTags, tag],
    }));
  }

  return (
    <section id="search-results" className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Search Results</CardTitle>
          <Input
            label="Cross-studio search"
            placeholder="Search across all studios"
            value={state.query}
            onChange={(event) => {
              const query = event.currentTarget.value;
              setState((current) => ({ ...current, query }));
              if (query.trim().length > 0) {
                setHistory((current) => Array.from(new Set([query, ...current])).slice(0, 6));
              }
            }}
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Search categories">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={state.category === category ? "primary" : "outline"}
                onClick={() => setState((current) => ({ ...current, category }))}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Search tags">
            {allTags.map((tag) => (
              <Button
                key={tag}
                type="button"
                size="sm"
                variant={state.selectedTags.includes(tag) ? "primary" : "outline"}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-md border border-[var(--color-border)] p-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={result.href ?? "#"}
                    className="font-medium text-[var(--color-text-primary)] hover:underline"
                  >
                    {result.title}
                  </Link>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {result.studioLabel}
                  </span>
                </div>
                <p className="mt-1 text-[var(--color-text-secondary)]">{result.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {results.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No search results found.</p>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search History</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {history.map((entry) => (
                <Button
                  key={entry}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setState((current) => ({ ...current, query: entry }))}
                >
                  {entry}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card id="saved-searches">
            <CardHeader>
              <CardTitle>Saved Searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {initialSavedSearches.map((savedSearch) => (
                <div
                  key={savedSearch.id}
                  className="rounded-md border border-[var(--color-border)] p-3"
                >
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {savedSearch.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{savedSearch.query}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-[var(--color-primary)]"
                    onClick={() => applySavedSearch(savedSearch)}
                  >
                    Apply saved search
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
