import { includesQueryFromFields, paginateItems } from "@nabhaverse/studio-sdk";

import type {
  Publication,
  PublishingLibraryFilters,
  PublishingStatus,
  ReleaseType,
} from "@/features/publishing/types/publishing.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function statusOrder(status: PublishingStatus): number {
  switch (status) {
    case "scheduled":
      return 0;
    case "approved":
      return 1;
    case "draft":
      return 2;
    case "published":
      return 3;
    case "failed":
      return 4;
    default:
      return 99;
  }
}

function releaseTypeOrder(type: ReleaseType): number {
  switch (type) {
    case "episode":
      return 0;
    case "trailer":
      return 1;
    case "short":
      return 2;
    case "bundle":
      return 3;
    default:
      return 99;
  }
}

export function filterAndSortPublications(
  publications: readonly Publication[],
  filters: PublishingLibraryFilters,
): Publication[] {
  const filtered = publications.filter((publication) => {
    if (
      !includesQueryFromFields(
        [
          publication.name,
          publication.description,
          publication.owner,
          publication.studio,
          ...publication.tags,
        ],
        filters.query,
      )
    ) {
      return false;
    }

    if (filters.tags.length > 0 && !filters.tags.every((tag) => publication.tags.includes(tag))) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(publication.status)) {
      return false;
    }

    if (
      filters.releaseTypes.length > 0 &&
      !filters.releaseTypes.includes(publication.releaseType)
    ) {
      return false;
    }

    if (filters.scheduledDate.trim().length > 0) {
      const scheduledAt = publication.scheduledAt ?? "";
      if (!scheduledAt.toLowerCase().includes(filters.scheduledDate.trim().toLowerCase())) {
        return false;
      }
    }

    if (filters.favoritesOnly && !publication.favorite) {
      return false;
    }

    if (filters.scheduledOnly && !publication.scheduledAt) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((left, right) => {
    const statusDiff = statusOrder(left.status) - statusOrder(right.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    const typeDiff = releaseTypeOrder(left.releaseType) - releaseTypeOrder(right.releaseType);
    if (typeDiff !== 0) {
      return typeDiff;
    }

    return collator.compare(left.name, right.name);
  });
}

export function paginatePublications(
  publications: readonly Publication[],
  page: number,
  pageSize: number,
): { items: Publication[]; hasNextPage: boolean } {
  return paginateItems(publications, page, pageSize);
}
