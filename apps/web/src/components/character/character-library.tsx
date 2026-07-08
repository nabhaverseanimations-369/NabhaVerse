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

import { CharacterCard } from "@/components/character/character-card";
import { CharacterStatusBadge } from "@/components/character/character-status-badge";
import { TagPicker } from "@/components/character/tag-picker";
import { mockCharacters } from "@/features/character/data/character-mocks";
import {
  filterAndSortCharacters,
  paginateCharacters,
} from "@/features/character/lib/character-search";
import type {
  Character,
  CharacterLibraryFilters,
  CharacterLibraryView,
  CharacterSortKey,
  CharacterStatus,
} from "@/features/character/types/character.types";

const allTags = Array.from(new Set(mockCharacters.flatMap((character) => character.tags))).sort();
const statusOptions: CharacterStatus[] = ["draft", "in-review", "approved", "archived"];
const pageSize = 4;

const defaultFilters: CharacterLibraryFilters = {
  query: "",
  tags: [],
  status: [],
  favoritesOnly: false,
  recentOnly: false,
  sortBy: "updatedAt",
};

function CharacterRow({
  character,
  href,
  onToggleFavorite,
}: {
  character: Character;
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
          {character.name}
        </Link>
        <div className="flex items-center gap-2">
          <CharacterStatusBadge status={character.status} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(character.id)}
          >
            {character.favorite ? "Unfavorite" : "Favorite"}
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{character.summary}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Owner {character.owner} · Updated {character.updatedAt} · {character.version}
      </p>
    </li>
  );
}

export function CharacterLibrary(): React.JSX.Element {
  const [view, setView] = React.useState<CharacterLibraryView>("grid");
  const [filters, setFilters] = React.useState<CharacterLibraryFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [characters, setCharacters] = React.useState<Character[]>(mockCharacters);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const results = React.useMemo(
    () => filterAndSortCharacters(characters, filters),
    [characters, filters],
  );
  const paginated = React.useMemo(
    () => paginateCharacters(results, page, pageSize),
    [results, page],
  );

  function setSortBy(sortBy: CharacterSortKey): void {
    setFilters((previous) => ({ ...previous, sortBy }));
  }

  function toggleStatus(status: CharacterStatus): void {
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

  function resetPagination(): void {
    setPage(1);
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Character Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading characters...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Character Library</CardTitle>
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
              placeholder="Search by name, owner, tag"
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Sort</p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setSortBy(value as CharacterSortKey);
                  resetPagination();
                }}
              >
                <SelectTrigger aria-label="Sort characters">
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
          <TagPicker
            selected={filters.tags}
            options={allTags}
            onChange={(next) => {
              setFilters((previous) => ({ ...previous, tags: next }));
              resetPagination();
            }}
          />
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
                  <CharacterStatusBadge status={status} />
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          title="No characters found"
          description="Try adjusting search terms, tags, or status filters."
          icon={<Search className="h-8 w-8" aria-hidden="true" />}
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {paginated.items.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              href={`/creative/characters/${character.id}/overview`}
              onToggleFavorite={(characterId) => {
                setCharacters((previous) =>
                  previous.map((entry) =>
                    entry.id === characterId ? { ...entry, favorite: !entry.favorite } : entry,
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
              {paginated.items.map((character) => (
                <CharacterRow
                  key={character.id}
                  character={character}
                  href={`/creative/characters/${character.id}/overview`}
                  onToggleFavorite={(characterId) => {
                    setCharacters((previous) =>
                      previous.map((entry) =>
                        entry.id === characterId ? { ...entry, favorite: !entry.favorite } : entry,
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
            Showing {paginated.items.length} of {results.length} characters
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!paginated.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!paginated.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Load more
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
