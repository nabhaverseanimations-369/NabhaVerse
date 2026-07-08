import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { AssetStatusBadge } from "@/components/asset/asset-status-badge";
import { mockAssetCollections, mockAssets } from "@/features/asset/data/asset-mocks";
import type { Asset } from "@/features/asset/types/asset.types";

export function AssetCollectionPanel({ asset }: { asset: Asset }): React.JSX.Element {
  const assetCollections = mockAssetCollections.filter((collection) =>
    asset.collections.includes(collection.id),
  );

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionTree
            collections={mockAssetCollections}
            selectedCollectionIds={asset.collections}
          />
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pinned Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAssets
              .filter((entry) => entry.pinned)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-md border border-[var(--color-border)] p-3 text-sm"
                >
                  <p className="font-medium text-[var(--color-text-primary)]">{entry.name}</p>
                  <p className="text-[var(--color-text-secondary)]">{entry.summary}</p>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {assetCollections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-md border border-[var(--color-border)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-[var(--color-text-primary)]">{collection.name}</p>
                  {collection.pinned ? <AssetStatusBadge status="approved" /> : null}
                </div>
                <p>{collection.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CollectionTree({
  collections,
  selectedCollectionIds,
}: {
  collections: readonly (typeof mockAssetCollections)[number][];
  selectedCollectionIds: readonly string[];
}): React.JSX.Element {
  return (
    <ul className="space-y-2">
      {collections.map((collection) => {
        const selected = selectedCollectionIds.includes(collection.id);
        return (
          <li key={collection.id} className="rounded-md border border-[var(--color-border)] p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {selected ? "• " : null}
                  {collection.name}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {collection.description}
                </p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {collection.assetCount} assets
              </p>
            </div>
            {collection.children.length > 0 ? (
              <div className="mt-3 pl-4">
                <CollectionTree
                  collections={collection.children}
                  selectedCollectionIds={selectedCollectionIds}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
