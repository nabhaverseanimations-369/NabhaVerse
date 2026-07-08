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

import { PublicationCard } from "@/components/publishing/publication-card";
import {
  PublishingStatusBadge,
  ReleaseTypeBadge,
} from "@/components/publishing/publishing-status-badge";
import { mockPublications } from "@/features/publishing/data/publishing-mocks";
import {
  filterAndSortPublications,
  paginatePublications,
} from "@/features/publishing/lib/publishing-search";
import type {
  Publication,
  PublishingLibraryFilters,
  PublishingStatus,
  PublishingView,
  ReleaseType,
} from "@/features/publishing/types/publishing.types";

const statusOptions: readonly PublishingStatus[] = [
  "draft",
  "scheduled",
  "approved",
  "published",
  "failed",
];
const releaseTypeOptions: readonly ReleaseType[] = ["episode", "trailer", "short", "bundle"];
const pageSize = 4;

const defaultFilters: PublishingLibraryFilters = {
  query: "",
  scheduledDate: "",
  tags: [],
  status: [],
  releaseTypes: [],
  favoritesOnly: false,
  scheduledOnly: false,
};

function PublicationRow({
  publication,
  href,
  onToggleFavorite,
}: {
  publication: Publication;
  href: string;
  onToggleFavorite: (publicationId: string) => void;
}): React.JSX.Element {
  return (
    <li className="rounded-md border border-[var(--color-border)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={href}
          className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
        >
          {publication.name}
        </Link>
        <div className="flex items-center gap-2">
          <PublishingStatusBadge status={publication.status} />
          <ReleaseTypeBadge type={publication.releaseType} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(publication.id)}
          >
            {publication.favorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{publication.description}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Owner {publication.owner} · Scheduled {publication.scheduledAt ?? "Not scheduled"}
      </p>
    </li>
  );
}

export function PublishingLibrary({
  initialPublications = mockPublications,
  initialLoading = true,
  loadingDelayMs = 250,
}: {
  initialPublications?: readonly Publication[];
  initialLoading?: boolean;
  loadingDelayMs?: number;
}): React.JSX.Element {
  const [view, setView] = React.useState<PublishingView>("grid");
  const [filters, setFilters] = React.useState<PublishingLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(initialLoading);
  const [publications, setPublications] = React.useState<Publication[]>(() => [
    ...initialPublications,
  ]);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoading(false), loadingDelayMs);
    return () => window.clearTimeout(timer);
  }, [loading, loadingDelayMs]);

  const allTags = React.useMemo(
    () => Array.from(new Set(publications.flatMap((publication) => publication.tags))).sort(),
    [publications],
  );

  const results = React.useMemo(
    () => filterAndSortPublications(publications, filters),
    [publications, filters],
  );
  const paginated = React.useMemo(
    () => paginatePublications(results, page, pageSize),
    [results, page],
  );

  function resetPage(): void {
    setPage(1);
  }

  function toggleFavorite(publicationId: string): void {
    setPublications((current) =>
      current.map((publication) =>
        publication.id === publicationId
          ? { ...publication, favorite: !publication.favorite }
          : publication,
      ),
    );
  }

  function toggleStatus(status: PublishingStatus): void {
    setFilters((previous) => ({
      ...previous,
      status: previous.status.includes(status)
        ? previous.status.filter((entry) => entry !== status)
        : [...previous.status, status],
    }));
  }

  function toggleReleaseType(releaseType: ReleaseType): void {
    setFilters((previous) => ({
      ...previous,
      releaseTypes: previous.releaseTypes.includes(releaseType)
        ? previous.releaseTypes.filter((entry) => entry !== releaseType)
        : [...previous.releaseTypes, releaseType],
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
          <CardTitle>Publishing Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading publications...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publishing Library</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No publications found"
            description="Adjust search and filters to surface publication workspaces."
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
            <CardTitle>Publishing Library</CardTitle>
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
              placeholder="Search publications"
            />
            <Input
              label="Scheduled Date"
              value={filters.scheduledDate}
              onChange={(event) => {
                const scheduledDate = event.currentTarget.value;
                setFilters((previous) => ({ ...previous, scheduledDate }));
                resetPage();
              }}
              placeholder="Filter by date text"
            />
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant={filters.favoritesOnly ? "primary" : "outline"}
                aria-label="Favorites only"
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
                variant={filters.scheduledOnly ? "primary" : "outline"}
                aria-label="Scheduled only"
                onClick={() => {
                  setFilters((previous) => ({
                    ...previous,
                    scheduledOnly: !previous.scheduledOnly,
                  }));
                  resetPage();
                }}
              >
                Scheduled
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
                  <PublishingStatusBadge status={status} />
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Release type filters">
            {releaseTypeOptions.map((releaseType) => {
              const active = filters.releaseTypes.includes(releaseType);
              return (
                <Button
                  key={releaseType}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    toggleReleaseType(releaseType);
                    resetPage();
                  }}
                >
                  <ReleaseTypeBadge type={releaseType} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.items.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              href={`/publishing/studio/${publication.id}/overview`}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {paginated.items.map((publication) => (
            <PublicationRow
              key={publication.id}
              publication={publication}
              href={`/publishing/studio/${publication.id}/overview`}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ul>
      )}

      {paginated.hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((previous) => previous + 1)}
          >
            Load more publications
          </Button>
        </div>
      ) : null}
    </section>
  );
}
