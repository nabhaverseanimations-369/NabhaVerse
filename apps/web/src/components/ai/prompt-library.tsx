"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
} from "@nabhaverse/ui";

import { PromptCard } from "@/components/ai/prompt-card";
import { filterPrompts } from "@/features/ai/lib/ai-search";
import type {
  AIPrompt,
  AIPromptCategory,
  AIPromptLibraryFilters,
} from "@/features/ai/types/ai.types";

const categories: readonly AIPromptCategory[] = [
  "story",
  "character",
  "world",
  "dialogue",
  "visual",
  "audio",
  "ops",
];

const defaultFilters: AIPromptLibraryFilters = {
  query: "",
  categories: [],
  tags: [],
  favoritesOnly: false,
};

export function PromptLibrary({
  prompts,
  onSelectPrompt,
}: {
  prompts: readonly AIPrompt[];
  onSelectPrompt?: (promptId: string) => void;
}): React.JSX.Element {
  const [filters, setFilters] = React.useState<AIPromptLibraryFilters>(defaultFilters);
  const [localPrompts, setLocalPrompts] = React.useState<readonly AIPrompt[]>(prompts);

  const allTags = React.useMemo(
    () => Array.from(new Set(localPrompts.flatMap((prompt) => prompt.tags))).sort(),
    [localPrompts],
  );
  const filtered = React.useMemo(
    () => filterPrompts(localPrompts, filters),
    [localPrompts, filters],
  );

  function toggleFavorite(promptId: string): void {
    setLocalPrompts((current) =>
      current.map((prompt) =>
        prompt.id === promptId ? { ...prompt, favorite: !prompt.favorite } : prompt,
      ),
    );
  }

  function toggleCategory(category: AIPromptCategory): void {
    setFilters((previous) => ({
      ...previous,
      categories: previous.categories.includes(category)
        ? previous.categories.filter((entry) => entry !== category)
        : [...previous.categories, category],
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

  if (filtered.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt Library</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No prompts found"
            description="Adjust filters or search terms to surface prompts."
            icon={<Search className="h-8 w-8" aria-hidden="true" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Prompt Library</CardTitle>
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
            <Input
              label="Search"
              value={filters.query}
              onChange={(event) => {
                const query = event.currentTarget.value;
                setFilters((previous) => ({ ...previous, query }));
              }}
              placeholder="Search prompts, tags, variables"
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant={filters.favoritesOnly ? "primary" : "outline"}
                onClick={() => {
                  setFilters((previous) => ({
                    ...previous,
                    favoritesOnly: !previous.favoritesOnly,
                  }));
                }}
              >
                Favorite Prompts
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFilters(defaultFilters);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Prompt categories">
            {categories.map((category) => {
              const active = filters.categories.includes(category);
              return (
                <Button
                  key={category}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Prompt tags">
            {allTags.map((tag) => {
              const active = filters.tags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </Button>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((prompt) =>
          onSelectPrompt ? (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={toggleFavorite}
              onSelect={onSelectPrompt}
            />
          ) : (
            <PromptCard key={prompt.id} prompt={prompt} onToggleFavorite={toggleFavorite} />
          ),
        )}
      </div>
    </section>
  );
}
