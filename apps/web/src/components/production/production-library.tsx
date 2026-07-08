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
} from "@nabhaverse/ui";

import { ProductionCard } from "@/components/production/production-card";
import {
  ProductionPriorityBadge,
  ProductionStatusBadge,
} from "@/components/production/production-status-badge";
import { mockProductions } from "@/features/production/data/production-mocks";
import {
  filterAndSortProductions,
  paginateProductions,
} from "@/features/production/lib/production-search";
import type {
  Production,
  ProductionLibraryFilters,
  ProductionPriority,
  ProductionStatus,
  ProductionView,
} from "@/features/production/types/production.types";

const statusOptions: readonly ProductionStatus[] = ["active", "planning", "on-hold", "completed"];
const priorityOptions: readonly ProductionPriority[] = ["critical", "high", "medium", "low"];
const pageSize = 4;

const defaultFilters: ProductionLibraryFilters = {
  query: "",
  tags: [],
  status: [],
  priority: [],
  favoritesOnly: false,
  recentOnly: false,
};

function ProductionRow({
  production,
  href,
  onToggleFavorite,
}: {
  production: Production;
  href: string;
  onToggleFavorite: (productionId: string) => void;
}): React.JSX.Element {
  return (
    <li className="rounded-md border border-[var(--color-border)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={href}
          className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
        >
          {production.name}
        </Link>
        <div className="flex items-center gap-2">
          <ProductionStatusBadge status={production.status} />
          <ProductionPriorityBadge priority={production.priority} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(production.id)}
          >
            {production.favorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{production.description}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Owner {production.owner} · Completion {production.completion}%
      </p>
    </li>
  );
}

export function ProductionLibrary({
  initialProductions = mockProductions,
  initialLoading = true,
  loadingDelayMs = 250,
}: {
  initialProductions?: readonly Production[];
  initialLoading?: boolean;
  loadingDelayMs?: number;
}): React.JSX.Element {
  const [view, setView] = React.useState<ProductionView>("grid");
  const [filters, setFilters] = React.useState<ProductionLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(initialLoading);
  const [productions, setProductions] = React.useState<Production[]>(() => [...initialProductions]);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoading(false), loadingDelayMs);
    return () => window.clearTimeout(timer);
  }, [loading, loadingDelayMs]);

  const allTags = React.useMemo(
    () => Array.from(new Set(productions.flatMap((production) => production.tags))).sort(),
    [productions],
  );

  const results = React.useMemo(
    () => filterAndSortProductions(productions, filters),
    [productions, filters],
  );
  const paginated = React.useMemo(
    () => paginateProductions(results, page, pageSize),
    [results, page],
  );

  function toggleFavorite(productionId: string): void {
    setProductions((current) =>
      current.map((production) =>
        production.id === productionId
          ? { ...production, favorite: !production.favorite }
          : production,
      ),
    );
  }

  function resetPage(): void {
    setPage(1);
  }

  function toggleStatus(status: ProductionStatus): void {
    setFilters((previous) => ({
      ...previous,
      status: previous.status.includes(status)
        ? previous.status.filter((entry) => entry !== status)
        : [...previous.status, status],
    }));
  }

  function togglePriority(priority: ProductionPriority): void {
    setFilters((previous) => ({
      ...previous,
      priority: previous.priority.includes(priority)
        ? previous.priority.filter((entry) => entry !== priority)
        : [...previous.priority, priority],
    }));
  }

  function toggleTag(tag: string): void {
    setFilters((previous) => ({
      ...previous,
      tags: previous.tags.includes(tag)
        ? previous.tags.filter((entry) => entry !== tag)
        : [...previous.tags, tag],
    }));
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading productions...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Library</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No productions found"
            description="Adjust search and filters to surface production workspaces."
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
            <CardTitle>Production Library</CardTitle>
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
                const query = event.currentTarget.value;
                setFilters((previous) => ({ ...previous, query }));
                resetPage();
              }}
              placeholder="Search productions"
            />

            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant={filters.favoritesOnly ? "primary" : "outline"}
                onClick={() => {
                  setFilters((previous) => ({
                    ...previous,
                    favoritesOnly: !previous.favoritesOnly,
                  }));
                  resetPage();
                }}
              >
                Favorites
              </Button>
              <Button
                type="button"
                variant={filters.recentOnly ? "primary" : "outline"}
                onClick={() => {
                  setFilters((previous) => ({ ...previous, recentOnly: !previous.recentOnly }));
                  resetPage();
                }}
              >
                Recently Opened
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
                    toggleTag(tag);
                    resetPage();
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
                    resetPage();
                  }}
                >
                  <ProductionStatusBadge status={status} />
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Priority filters">
            {priorityOptions.map((priority) => {
              const active = filters.priority.includes(priority);
              return (
                <Button
                  key={priority}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    togglePriority(priority);
                    resetPage();
                  }}
                >
                  <ProductionPriorityBadge priority={priority} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.items.map((production) => (
            <ProductionCard
              key={production.id}
              production={production}
              href={`/production/studio/${production.id}/overview`}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {paginated.items.map((production) => (
            <ProductionRow
              key={production.id}
              production={production}
              href={`/production/studio/${production.id}/overview`}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ul>
      )}

      {paginated.hasNextPage ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setPage((prev) => prev + 1)}>
            Load more productions
          </Button>
        </div>
      ) : null}
    </section>
  );
}
