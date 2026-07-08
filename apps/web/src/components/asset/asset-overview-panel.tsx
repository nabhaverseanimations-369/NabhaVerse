import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { AssetStatusBadge } from "@/components/asset/asset-status-badge";
import { mockAssetCollections } from "@/features/asset/data/asset-mocks";
import type { Asset } from "@/features/asset/types/asset.types";

export function AssetOverviewPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{asset.name}</CardTitle>
            <AssetStatusBadge status={asset.status} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{asset.summary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
            {asset.thumbnailLabel}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoBlock label="Type" value={asset.type} />
            <InfoBlock label="Owner" value={asset.owner} />
            <InfoBlock label="Version" value={asset.version} />
            <InfoBlock label="Size" value={asset.sizeLabel} />
            <InfoBlock label="Usage" value={asset.usageSummary} />
            <InfoBlock label="Studio" value={asset.studio} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock label="Tags" value={asset.tags.join(", ")} />
            <InfoBlock
              label="Collections"
              value={asset.collections
                .map(
                  (collectionId) =>
                    mockAssetCollections.find((collection) => collection.id === collectionId)
                      ?.name ?? collectionId,
                )
                .join(", ")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {asset.recentActivity.map((entry) => (
              <p key={entry} className="rounded-md border border-[var(--color-border)] px-3 py-2">
                {entry}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Open Preview
            </Button>
            <Button type="button" variant="outline">
              Review Metadata
            </Button>
            <Button type="button" variant="outline">
              Check Collections
            </Button>
            <Button type="button" variant="outline">
              Inspect Usage
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}
