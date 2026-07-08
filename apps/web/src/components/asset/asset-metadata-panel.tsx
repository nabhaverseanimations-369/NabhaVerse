import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Asset } from "@/features/asset/types/asset.types";

export function AssetMetadataPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetadataBlock label="Title" value={asset.metadata.title} />
          <MetadataBlock label="Description" value={asset.metadata.description} />
          <MetadataBlock label="Creator" value={asset.metadata.creator} />
          <MetadataBlock label="License" value={asset.metadata.license} />
          <MetadataBlock label="Resolution" value={asset.metadata.resolution} />
          <MetadataBlock label="Duration" value={asset.metadata.duration} />
          <MetadataBlock label="Dimensions" value={asset.metadata.dimensions} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {asset.metadata.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              {keyword}
            </span>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function MetadataBlock({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}
