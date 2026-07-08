import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { AssetStatusBadge } from "@/components/asset/asset-status-badge";
import type { Asset } from "@/features/asset/types/asset.types";

const typeLabels: Record<Asset["type"], string> = {
  image: "Image",
  "concept-art": "Concept Art",
  "character-reference": "Character Reference",
  storyboard: "Storyboard",
  background: "Background",
  video: "Video",
  audio: "Audio",
  "voice-clip": "Voice Clip",
  music: "Music",
  "sound-effect": "Sound Effect",
  document: "Document",
  pdf: "PDF",
  "3d-model": "3D Model",
  "ai-output": "AI Output",
};

export function AssetCard({
  asset,
  href,
  onToggleFavorite,
}: {
  asset: Asset;
  href: string;
  onToggleFavorite: (assetId: string) => void;
}): React.JSX.Element {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>
              <Link href={href} className="hover:underline">
                {asset.name}
              </Link>
            </CardTitle>
            <p className="text-sm text-[var(--color-text-secondary)]">{typeLabels[asset.type]}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={asset.favorite ? "Remove favorite" : "Add favorite"}
            onClick={() => onToggleFavorite(asset.id)}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={asset.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <AssetStatusBadge status={asset.status} />
          <span className="rounded-full border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-secondary)]">
            {asset.sizeLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
          {asset.thumbnailLabel}
        </div>
        <p>{asset.summary}</p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Owner:</span> {asset.owner}
        </p>
        <div className="flex flex-wrap gap-1">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
