import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeStoryboardPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storyboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Shot thumbnails, camera notes, timing, and comments placeholders for layout planning.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {episode.shots.map((shot) => (
            <article
              key={shot.id}
              className="space-y-3 rounded-md border border-[var(--color-border)] p-3"
            >
              <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-muted)]">
                {shot.thumbnailLabel}
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-[var(--color-text-primary)]">
                  Shot {shot.shotNumber}: {shot.title}
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  Camera notes: {shot.cameraNotes}
                </p>
                <p className="text-[var(--color-text-secondary)]">Timing: {shot.timing}</p>
                <p className="text-[var(--color-text-secondary)]">Comments: {shot.comments}</p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
