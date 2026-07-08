"use client";

import * as React from "react";
import Link from "next/link";
import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
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

import { WorldCard } from "@/components/world/world-card";
import { WorldStatusBadge } from "@/components/world/world-status-badge";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { filterAndSortWorlds, paginateWorlds } from "@/features/world/lib/world-search";
import type {
  World,
  WorldLibraryFilters,
  WorldLibraryView,
  WorldSortKey,
  WorldStatus,
} from "@/features/world/types/world.types";

const allTags = Array.from(new Set(mockWorlds.flatMap((world) => world.tags))).sort();
const statusOptions: WorldStatus[] = ["draft", "in-review", "published", "archived"];
const pageSize = 4;

const defaultFilters: WorldLibraryFilters = {
  query: "",
  tags: [],
  status: [],
  favoritesOnly: false,
  recentOnly: false,
  sortBy: "updatedAt",
};

export interface WorldLibraryProps {
  initialWorlds?: readonly World[];
  initialLoading?: boolean;
  loadingDelayMs?: number;
}

function WorldRow({
  world,
  href,
  onToggleFavorite,
}: {
  world: World;
  href: string;
  onToggleFavorite: (id: string) => void;
}): React.JSX.Element {
  return (
    <li className="rounded-md border border-[var(--color-border)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={href}
          className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
        >
          {world.name}
        </Link>
        <div className="flex items-center gap-2">
          <WorldStatusBadge status={world.status} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(world.id)}
          >
            {world.favorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{world.description}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Studio {world.studio} · Updated {world.updatedAt} · {world.version}
      </p>
    </li>
  );
}

export function WorldLibrary({
  initialWorlds = mockWorlds,
  initialLoading = true,
  loadingDelayMs = 250,
}: WorldLibraryProps = {}): React.JSX.Element {
  const [view, setView] = React.useState<WorldLibraryView>("grid");
  const [filters, setFilters] = React.useState<WorldLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(initialLoading);
  const [worlds, setWorlds] = React.useState<World[]>(() => [...initialWorlds]);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoading(false), loadingDelayMs);
    return () => window.clearTimeout(timer);
  }, [loading, loadingDelayMs]);

  const results = React.useMemo(() => filterAndSortWorlds(worlds, filters), [worlds, filters]);
  const paginated = React.useMemo(() => paginateWorlds(results, page, pageSize), [results, page]);

  function resetPagination(): void {
    setPage(1);
  }

  function setSortBy(sortBy: WorldSortKey): void {
    setFilters((previous) => ({ ...previous, sortBy }));
  }

  function toggleStatus(status: WorldStatus): void {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>World Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading worlds...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>World Library</CardTitle>
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
              placeholder="Search by world, description, tag"
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Sort</p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setSortBy(value as WorldSortKey);
                  resetPagination();
                }}
              >
                <SelectTrigger aria-label="Sort worlds">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recently Opened</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
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
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Status filters"
          >
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
                  <WorldStatusBadge status={status} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          title="No worlds found"
          description="Try adjusting search terms, tags, or status filters."
          icon={<Search className="h-8 w-8" aria-hidden="true" />}
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {paginated.items.map((world) => (
            <WorldCard
              key={world.id}
              world={world}
              href={`/creative/worlds/${world.id}/overview`}
              onToggleFavorite={(worldId) => {
                setWorlds((previous) =>
                  previous.map((entry) =>
                    entry.id === worldId ? { ...entry, favorite: !entry.favorite } : entry,
                  ),
                );
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {paginated.items.map((world) => (
                <WorldRow
                  key={world.id}
                  world={world}
                  href={`/creative/worlds/${world.id}/overview`}
                  onToggleFavorite={(worldId) => {
                    setWorlds((previous) =>
                      previous.map((entry) =>
                        entry.id === worldId ? { ...entry, favorite: !entry.favorite } : entry,
                      ),
                    );
                  }}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Showing {paginated.items.length} of {results.length} worlds
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!paginated.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!paginated.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Load more
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
