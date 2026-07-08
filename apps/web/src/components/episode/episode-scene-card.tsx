import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { EpisodeScene } from "@/features/episode/types/episode.types";

const sceneStatusLabels: Record<EpisodeScene["status"], string> = {
  planned: "Planned",
  draft: "Draft",
  blocked: "Blocked",
  approved: "Approved",
};

export function EpisodeSceneCard({
  scene,
  onMoveUp,
  onMoveDown,
}: {
  scene: EpisodeScene;
  onMoveUp: (sceneId: string) => void;
  onMoveDown: (sceneId: string) => void;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>
              Scene {scene.sceneNumber}: {scene.title}
            </CardTitle>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {sceneStatusLabels[scene.status]}
            </p>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">{scene.estimatedDuration}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <p>{scene.summary}</p>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Characters
          </p>
          <p>{scene.characters.join(", ")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Locations
          </p>
          <p>{scene.locations.join(", ")}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => onMoveUp(scene.id)}>
            Move up
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onMoveDown(scene.id)}>
            Move down
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
