import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeShotListPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shot List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Compact shot ordering view for production planning placeholders.
        </p>
        <div className="space-y-2">
          {episode.shots.map((shot) => (
            <div
              key={shot.id}
              className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">
                  Shot {shot.shotNumber}: {shot.title}
                </p>
                <p className="text-[var(--color-text-secondary)]">{shot.cameraNotes}</p>
              </div>
              <p className="text-[var(--color-text-muted)]">{shot.timing}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
