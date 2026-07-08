import { includesQueryFromFields, paginateItems } from "@nabhaverse/studio-sdk";

import type {
  Asset,
  AssetCollection,
  AssetCollectionGroup,
  AssetLibraryFilters,
  AssetStatus,
} from "@/features/asset/types/asset.types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function statusOrder(status: AssetStatus): number {
  switch (status) {
    case "approved":
      return 0;
    case "in-review":
      return 1;
    case "draft":
      return 2;
    case "archived":
      return 3;
    default:
      return 99;
  }
}

function matchesQuery(asset: Asset, query: string): boolean {
  return includesQueryFromFields(
    [
      asset.name,
      asset.owner,
      asset.studio,
      asset.summary,
      asset.metadata.title,
      asset.metadata.description,
      asset.metadata.creator,
      ...asset.tags,
      ...asset.metadata.keywords,
      asset.type,
      asset.sizeLabel,
    ],
    query,
  );
}

export function filterAndSortAssets(
  assets: readonly Asset[],
  filters: AssetLibraryFilters,
): Asset[] {
  const filtered = assets.filter((asset) => {
    if (!matchesQuery(asset, filters.query)) {
      return false;
    }
    if (filters.tags.length > 0 && !filters.tags.every((tag) => asset.tags.includes(tag))) {
      return false;
    }
    if (
      filters.collections.length > 0 &&
      !filters.collections.some((collectionId) => asset.collections.includes(collectionId))
    ) {
      return false;
    }
    if (filters.types.length > 0 && !filters.types.includes(asset.type)) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(asset.status)) {
      return false;
    }
    if (filters.favoritesOnly && !asset.favorite) {
      return false;
    }
    if (filters.recentOnly && !asset.recentlyUsedAt) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sortBy) {
      case "name":
        return collator.compare(left.name, right.name);
      case "status":
        return statusOrder(left.status) - statusOrder(right.status);
      case "recent": {
        const leftRecent = left.recentlyUsedAt ? 0 : 1;
        const rightRecent = right.recentlyUsedAt ? 0 : 1;
        if (leftRecent !== rightRecent) {
          return leftRecent - rightRecent;
        }
        return collator.compare(left.name, right.name);
      }
      case "type":
        return collator.compare(left.type, right.type);
      case "size":
        return collator.compare(left.sizeLabel, right.sizeLabel);
      case "updatedAt":
      default:
        return collator.compare(left.updatedAt, right.updatedAt);
    }
  });
}

export function paginateAssets(
  assets: readonly Asset[],
  page: number,
  pageSize: number,
): { items: Asset[]; hasNextPage: boolean } {
  return paginateItems(assets, page, pageSize);
}

export function flattenAssetCollections(
  collections: readonly AssetCollection[],
): AssetCollection[] {
  const flattened: AssetCollection[] = [];

  function walk(collectionList: readonly AssetCollection[]): void {
    for (const collection of collectionList) {
      flattened.push(collection);
      if (collection.children.length > 0) {
        walk(collection.children);
      }
    }
  }

  walk(collections);
  return flattened;
}

export function groupAssetsByCollection(
  assets: readonly Asset[],
  collections: readonly AssetCollection[],
): AssetCollectionGroup[] {
  return collections.map((collection) => ({
    collection,
    assets: assets.filter((asset) => asset.collections.includes(collection.id)),
  }));
}
