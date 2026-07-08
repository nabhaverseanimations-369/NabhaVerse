import { includesQueryFromFields } from "@nabhaverse/studio-sdk";

import type { AIJob, AIPrompt, AIPromptLibraryFilters } from "@/features/ai/types/ai.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

export function filterPrompts(
  prompts: readonly AIPrompt[],
  filters: AIPromptLibraryFilters,
): AIPrompt[] {
  return prompts.filter((prompt) => {
    if (
      !includesQueryFromFields(
        [
          prompt.name,
          prompt.description,
          prompt.summary,
          ...prompt.tags,
          ...prompt.variables.map((entry) => entry.key),
        ],
        filters.query,
      )
    ) {
      return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(prompt.category)) {
      return false;
    }

    if (filters.tags.length > 0 && !filters.tags.every((tag) => prompt.tags.includes(tag))) {
      return false;
    }

    if (filters.favoritesOnly && !prompt.favorite) {
      return false;
    }

    return true;
  });
}

export function sortPrompts(prompts: readonly AIPrompt[]): AIPrompt[] {
  return [...prompts].sort((left, right) => collator.compare(left.updatedAt, right.updatedAt));
}

export function jobsByStatus(jobs: readonly AIJob[]): Record<AIJob["status"], AIJob[]> {
  return {
    pending: jobs.filter((job) => job.status === "pending"),
    running: jobs.filter((job) => job.status === "running"),
    completed: jobs.filter((job) => job.status === "completed"),
    failed: jobs.filter((job) => job.status === "failed"),
    cancelled: jobs.filter((job) => job.status === "cancelled"),
  };
}
