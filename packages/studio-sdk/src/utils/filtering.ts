import type { StudioEntitySummary, StudioSortKey } from "../types/common";

const collator = new Intl.Collator("en", { sensitivity: "base" });

export function includesQueryFromFields(fields: readonly string[], query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return fields.join(" ").toLowerCase().includes(normalized);
}

export function sortByCommonSortKey<
  TEntity extends StudioEntitySummary<TStatus>,
  TStatus extends string,
>(
  left: TEntity,
  right: TEntity,
  sortBy: StudioSortKey,
  statusOrder: (status: TStatus) => number,
): number {
  switch (sortBy) {
    case "name":
      return collator.compare(left.name, right.name);
    case "status":
      return statusOrder(left.status) - statusOrder(right.status);
    case "recent": {
      const leftRecent = left.recentlyOpenedAt ? 0 : 1;
      const rightRecent = right.recentlyOpenedAt ? 0 : 1;
      if (leftRecent !== rightRecent) {
        return leftRecent - rightRecent;
      }
      return collator.compare(left.name, right.name);
    }
    case "updatedAt":
    default:
      return collator.compare(left.updatedAt, right.updatedAt);
  }
}

export function paginateItems<TEntity>(
  items: readonly TEntity[],
  page: number,
  pageSize: number,
): { items: TEntity[]; hasNextPage: boolean } {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const pageItems = items.slice(start, end);
  return { items: pageItems, hasNextPage: end < items.length };
}
