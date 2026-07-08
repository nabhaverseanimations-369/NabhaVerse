import { includesQueryFromFields, paginateItems } from "@nabhaverse/studio-sdk";

import type {
  Production,
  ProductionLibraryFilters,
  ProductionPriority,
  ProductionStatus,
} from "@/features/production/types/production.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function statusOrder(status: ProductionStatus): number {
  switch (status) {
    case "active":
      return 0;
    case "planning":
      return 1;
    case "on-hold":
      return 2;
    case "completed":
      return 3;
    default:
      return 99;
  }
}

function priorityOrder(priority: ProductionPriority): number {
  switch (priority) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
    default:
      return 99;
  }
}

export function filterAndSortProductions(
  productions: readonly Production[],
  filters: ProductionLibraryFilters,
): Production[] {
  const filtered = productions.filter((production) => {
    if (
      !includesQueryFromFields(
        [
          production.name,
          production.owner,
          production.studio,
          production.description,
          ...production.tags,
          ...production.deliverables,
        ],
        filters.query,
      )
    ) {
      return false;
    }

    if (filters.tags.length > 0 && !filters.tags.every((tag) => production.tags.includes(tag))) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(production.status)) {
      return false;
    }

    if (filters.priority.length > 0 && !filters.priority.includes(production.priority)) {
      return false;
    }

    if (filters.favoritesOnly && !production.favorite) {
      return false;
    }

    if (filters.recentOnly && !production.recentlyOpenedAt) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((left, right) => {
    const statusDiff = statusOrder(left.status) - statusOrder(right.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    const priorityDiff = priorityOrder(left.priority) - priorityOrder(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return collator.compare(left.name, right.name);
  });
}

export function paginateProductions(
  productions: readonly Production[],
  page: number,
  pageSize: number,
): { items: Production[]; hasNextPage: boolean } {
  return paginateItems(productions, page, pageSize);
}
