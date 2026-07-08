import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Asset } from "@/features/asset/types/asset.types";

export function AssetPreview({ asset }: { asset: Asset }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PreviewFrame asset={asset} />
        <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          <p>{asset.previewDescription}</p>
          <p>
            <span className="font-medium text-[var(--color-text-primary)]">Preview Mode:</span>{" "}
            {asset.previewLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewFrame({ asset }: { asset: Asset }): React.JSX.Element {
  switch (asset.type) {
    case "image":
    case "concept-art":
    case "character-reference":
    case "background":
    case "storyboard":
      return (
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
          {asset.thumbnailLabel}
        </div>
      );
    case "video":
      return (
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
          Video timeline placeholder
        </div>
      );
    case "audio":
    case "voice-clip":
    case "music":
    case "sound-effect":
      return (
        <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 text-center text-sm text-[var(--color-text-muted)]">
          Waveform preview placeholder
        </div>
      );
    case "document":
    case "pdf":
      return (
        <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 text-center text-sm text-[var(--color-text-muted)]">
          Document preview placeholder
        </div>
      );
    case "3d-model":
      return (
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
          3D viewport placeholder
        </div>
      );
    case "ai-output":
    default:
      return (
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
          AI output preview placeholder
        </div>
      );
  }
}
