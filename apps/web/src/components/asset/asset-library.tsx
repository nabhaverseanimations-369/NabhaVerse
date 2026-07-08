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

import { AssetCard } from "@/components/asset/asset-card";
import { AssetStatusBadge } from "@/components/asset/asset-status-badge";
import { mockAssetCollections, mockAssets } from "@/features/asset/data/asset-mocks";
import {
  flattenAssetCollections,
  filterAndSortAssets,
  paginateAssets,
} from "@/features/asset/lib/asset-search";
import type {
  Asset,
  AssetLibraryFilters,
  AssetLibraryView,
  AssetStatus,
  AssetSortKey,
  AssetType,
} from "@/features/asset/types/asset.types";

const assetTypes: readonly AssetType[] = [
  "image",
  "concept-art",
  "character-reference",
  "storyboard",
  "background",
  "video",
  "audio",
  "voice-clip",
  "music",
  "sound-effect",
  "document",
  "pdf",
  "3d-model",
  "ai-output",
];

const statusOptions: AssetStatus[] = ["draft", "in-review", "approved", "archived"];
const pageSize = 4;

const defaultFilters: AssetLibraryFilters = {
  query: "",
  tags: [],
  collections: [],
  types: [],
  status: [],
  favoritesOnly: false,
  recentOnly: false,
  sortBy: "updatedAt",
};

export interface AssetLibraryProps {
  initialAssets?: readonly Asset[];
  initialLoading?: boolean;
  loadingDelayMs?: number;
}

const collectionOptions = flattenAssetCollections(mockAssetCollections).map((collection) => ({
  id: collection.id,
  label: collection.name,
}));
const allTags = Array.from(new Set(mockAssets.flatMap((asset) => asset.tags))).sort();

function AssetRow({
  asset,
  href,
  onToggleFavorite,
}: {
  asset: Asset;
  href: string;
  onToggleFavorite: (assetId: string) => void;
}): React.JSX.Element {
  return (
    <li className="rounded-md border border-[var(--color-border)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={href}
          className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline"
        >
          {asset.name}
        </Link>
        <div className="flex items-center gap-2">
          <AssetStatusBadge status={asset.status} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(asset.id)}
          >
            {asset.favorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{asset.summary}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Owner {asset.owner} · Updated {asset.updatedAt} · {asset.version}
      </p>
    </li>
  );
}

export function AssetLibrary({
  initialAssets = mockAssets,
  initialLoading = true,
  loadingDelayMs = 250,
}: AssetLibraryProps = {}): React.JSX.Element {
  const [view, setView] = React.useState<AssetLibraryView>("grid");
  const [filters, setFilters] = React.useState<AssetLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(initialLoading);
  const [assets, setAssets] = React.useState<Asset[]>(() => [...initialAssets]);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoading(false), loadingDelayMs);
    return () => window.clearTimeout(timer);
  }, [loading, loadingDelayMs]);

  const results = React.useMemo(() => filterAndSortAssets(assets, filters), [assets, filters]);
  const paginated = React.useMemo(() => paginateAssets(results, page, pageSize), [results, page]);

  function resetPagination(): void {
    setPage(1);
  }

  function setSortBy(sortBy: AssetSortKey): void {
    setFilters((previous) => ({ ...previous, sortBy }));
  }

  function toggleStatus(status: AssetStatus): void {
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

  function toggleType(assetType: AssetType): void {
    setFilters((previous) => {
      const active = previous.types.includes(assetType);
      return {
        ...previous,
        types: active
          ? previous.types.filter((entry) => entry !== assetType)
          : [...previous.types, assetType],
      };
    });
  }

  function toggleCollection(collectionId: string): void {
    setFilters((previous) => {
      const active = previous.collections.includes(collectionId);
      return {
        ...previous,
        collections: active
          ? previous.collections.filter((entry) => entry !== collectionId)
          : [...previous.collections, collectionId],
      };
    });
  }

  function toggleFavorite(assetId: string): void {
    setAssets((current) =>
      current.map((asset) =>
        asset.id === assetId ? { ...asset, favorite: !asset.favorite } : asset,
      ),
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading assets...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Library</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No assets found"
            description="Adjust search, tag, type, or collection filters to find another asset."
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
            <CardTitle>Asset Library</CardTitle>
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
              placeholder="Search by asset, owner, tag"
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Sort</p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setSortBy(value as AssetSortKey);
                  resetPagination();
                }}
              >
                <SelectTrigger aria-label="Sort assets">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recently Used</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
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
          <div className="flex flex-wrap gap-2" role="group" aria-label="Collection filters">
            {collectionOptions.map((collection) => {
              const active = filters.collections.includes(collection.id);
              return (
                <Button
                  key={collection.id}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    toggleCollection(collection.id);
                    resetPagination();
                  }}
                >
                  {collection.label}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Type filters">
            {assetTypes.map((assetType) => {
              const active = filters.types.includes(assetType);
              return (
                <Button
                  key={assetType}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    toggleType(assetType);
                    resetPagination();
                  }}
                >
                  {assetType}
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
                  <AssetStatusBadge status={status} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Collections and Recent
          </h3>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockAssets
                  .filter((asset) => asset.recentlyUsedAt)
                  .slice(0, 4)
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className="rounded-md border border-[var(--color-border)] p-3 text-sm"
                    >
                      <p className="font-medium text-[var(--color-text-primary)]">{asset.name}</p>
                      <p className="text-[var(--color-text-secondary)]">
                        Used {asset.recentlyUsedAt}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockAssetCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="rounded-md border border-[var(--color-border)] p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {collection.name}
                      </p>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {collection.assetCount}
                      </span>
                    </div>
                    <p className="text-[var(--color-text-secondary)]">{collection.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginated.items.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                href={`/creative/assets/${asset.id}`}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {paginated.items.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                href={`/creative/assets/${asset.id}`}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
        )}
      </div>

      {paginated.hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((previous) => previous + 1)}
          >
            Load more assets
          </Button>
        </div>
      ) : null}
    </section>
  );
}
