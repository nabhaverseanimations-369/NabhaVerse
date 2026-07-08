import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { CharacterAsset } from "@/features/character/types/character.types";

export function AssetGallery({ assets }: { assets: CharacterAsset[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="overflow-hidden rounded-md border border-[var(--color-border)]"
            >
              <div
                role="img"
                aria-label={asset.title}
                className="h-32 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${asset.previewUrl})` }}
              />
              <div className="space-y-1 p-3">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {asset.title}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">{asset.kind}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Updated {asset.updatedAt}</p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
