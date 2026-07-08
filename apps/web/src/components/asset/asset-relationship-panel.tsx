import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Asset } from "@/features/asset/types/asset.types";

export function AssetRelationshipPanel({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <section className="space-y-4">
      <RelationGroup
        title="Characters"
        items={asset.references.characters.map((reference) => reference.name)}
      />
      <RelationGroup
        title="Worlds"
        items={asset.references.worlds.map((reference) => reference.name)}
      />
      <RelationGroup
        title="Episodes"
        items={asset.references.episodes.map((reference) => reference.name)}
      />
      <RelationGroup
        title="Related Assets"
        items={asset.references.relatedAssets.map((reference) => reference.name)}
      />
    </section>
  );
}

function RelationGroup({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {items.length > 0 ? (
          items.map((item) => (
            <p key={item} className="rounded-md border border-[var(--color-border)] px-3 py-2">
              {item}
            </p>
          ))
        ) : (
          <p>No references linked yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
