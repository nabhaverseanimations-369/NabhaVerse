"use client";

import * as React from "react";
import Link from "next/link";
import { Grid2X2, List, SlidersHorizontal } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nabhaverse/ui";

import { EpisodeCard } from "@/components/episode/episode-card";
import { EpisodeStatusBadge } from "@/components/episode/episode-status-badge";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";
import {
  filterAndSortEpisodes,
  groupEpisodesBySeason,
  paginateEpisodes,
} from "@/features/episode/lib/episode-search";
import type {
  Episode,
  EpisodeLibraryFilters,
  EpisodeLibraryView,
  EpisodeSortKey,
  EpisodeStatus,
} from "@/features/episode/types/episode.types";

const allTags = Array.from(new Set(mockEpisodes.flatMap((episode) => episode.tags))).sort();
const statusOptions: EpisodeStatus[] = ["draft", "in-review", "approved", "archived"];
const pageSize = 4;

const defaultFilters: EpisodeLibraryFilters = {
  query: "",
  tags: [],
  status: [],
  favoritesOnly: false,
  recentOnly: false,
  sortBy: "updatedAt",
};

export function EpisodeLibrary({
  initialEpisodes = mockEpisodes,
  initialLoading = true,
  loadingDelayMs = 250,
}: {
  initialEpisodes?: readonly Episode[];
  initialLoading?: boolean;
  loadingDelayMs?: number;
} = {}): React.JSX.Element {
  const [view, setView] = React.useState<EpisodeLibraryView>("grid");
  const [filters, setFilters] = React.useState<EpisodeLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(initialLoading);
  const [episodes, setEpisodes] = React.useState<Episode[]>(() => [...initialEpisodes]);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoading(false), loadingDelayMs);
    return () => window.clearTimeout(timer);
  }, [loading, loadingDelayMs]);

  const results = React.useMemo(
    () => filterAndSortEpisodes(episodes, filters),
    [episodes, filters],
  );
  const paginated = React.useMemo(() => paginateEpisodes(results, page, pageSize), [results, page]);
  const seasons = React.useMemo(() => groupEpisodesBySeason(paginated.items), [paginated.items]);

  function resetPagination(): void {
    setPage(1);
  }

  function setSortBy(sortBy: EpisodeSortKey): void {
    setFilters((previous) => ({ ...previous, sortBy }));
  }

  function toggleStatus(status: EpisodeStatus): void {
    setFilters((previous) => {
      const active = previous.status.includes(status);
      return {
        ...previous,
        status: active
          ? previous.status.filter((entry) => entry !== status)
          : [...previous.status, status],
      };
    });
  }

  function toggleFavorite(id: string): void {
    setEpisodes((current) =>
      current.map((episode) =>
        episode.id === id ? { ...episode, favorite: !episode.favorite } : episode,
      ),
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Episode Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading episodes...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Episode Library</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No episodes found"
            description="Adjust search, tags, or status filters to find another episode."
            icon={<SlidersHorizontal className="h-8 w-8" aria-hidden="true" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4" data-infinite-scroll-ready="true">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Episode Library</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={view === "grid" ? "primary" : "outline"}
                size="sm"
                onClick={() => setView("grid")}
              >
                <Grid2X2 className="h-4 w-4" aria-hidden="true" /> Grid
              </Button>
              <Button
                type="button"
                variant={view === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" aria-hidden="true" /> List
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input
              label="Search"
              value={filters.query}
              onChange={(event) => {
                const nextQuery = event.currentTarget.value;
                setFilters((previous) => ({ ...previous, query: nextQuery }));
                resetPagination();
              }}
              placeholder="Search by title, owner, tag"
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Sort</p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setSortBy(value as EpisodeSortKey);
                  resetPagination();
                }}
              >
                <SelectTrigger aria-label="Sort episodes">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="name">Title</SelectItem>
                  <SelectItem value="recent">Recently Opened</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="episodeNumber">Episode Number</SelectItem>
                  <SelectItem value="season">Season</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant={filters.favoritesOnly ? "primary" : "outline"}
                onClick={() => {
                  setFilters((previous) => ({
                    ...previous,
                    favoritesOnly: !previous.favoritesOnly,
                  }));
                  resetPagination();
                }}
              >
                Favorites
              </Button>
              <Button
                type="button"
                variant={filters.recentOnly ? "primary" : "outline"}
                onClick={() => {
                  setFilters((previous) => ({ ...previous, recentOnly: !previous.recentOnly }));
                  resetPagination();
                }}
              >
                Recent
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFilters(defaultFilters);
                  setPage(1);
                }}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Clear filters
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Tag filters">
            {allTags.map((tag) => {
              const active = filters.tags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilters((previous) => ({
                      ...previous,
                      tags: active
                        ? previous.tags.filter((entry) => entry !== tag)
                        : [...previous.tags, tag],
                    }));
                    resetPagination();
                  }}
                >
                  #{tag}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Status filters">
            {statusOptions.map((status) => {
              const active = filters.status.includes(status);
              return (
                <Button
                  key={status}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    toggleStatus(status);
                    resetPagination();
                  }}
                >
                  <EpisodeStatusBadge status={status} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {seasons.map((seasonGroup) => (
          <section key={seasonGroup.season} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Season {seasonGroup.season}
            </h3>
            {view === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                {seasonGroup.episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    href={`/production/episodes/${episode.id}`}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {seasonGroup.episodes.map((episode) => (
                  <li
                    key={episode.id}
                    className="rounded-md border border-[var(--color-border)] px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/production/episodes/${episode.id}`}
                        className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
                      >
                        Episode {episode.episodeNumber}: {episode.title}
                      </Link>
                      <EpisodeStatusBadge status={episode.status} />
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {episode.summary}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Season {episode.season} · Owner {episode.owner} · Updated {episode.updatedAt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {paginated.hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((previous) => previous + 1)}
          >
            Load more episodes
          </Button>
        </div>
      ) : null}
    </section>
  );
}
