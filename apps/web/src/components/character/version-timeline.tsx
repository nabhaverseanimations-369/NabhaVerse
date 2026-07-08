import * as React from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, cn } from "@nabhaverse/ui";

import type { CharacterVersion } from "@/features/character/types/character.types";

export function VersionTimeline({ versions }: { versions: CharacterVersion[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3" aria-label="Version timeline">
          {versions.map((version) => (
            <li
              key={version.id}
              className={cn(
                "rounded-md border border-[var(--color-border)] p-3",
                version.active && "border-[var(--color-primary)]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {version.label}
                </p>
                {version.active ? <Badge variant="primary">Active</Badge> : null}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {version.createdAt} · {version.author}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{version.summary}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
