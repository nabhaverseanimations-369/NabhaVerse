"use client";

import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { EpisodeSceneCard } from "@/components/episode/episode-scene-card";
import { useEpisodeWorkspaceState } from "@/features/episode/state/episode-workspace-state";
import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeSceneList({ episode }: { episode: Episode }): React.JSX.Element {
  const { state, dispatch } = useEpisodeWorkspaceState();
  const [scenes, setScenes] = React.useState(() => [...episode.scenes]);

  function moveScene(sceneId: string, delta: number): void {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      if (index < 0) {
        return current;
      }

      const nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      if (!item) {
        return current;
      }
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scene List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Drag-and-drop ready ordering placeholder with action buttons for scene movement.
        </p>
        <div className="grid gap-3">
          {scenes.map((scene) => (
            <div key={scene.id} data-selected={state.selectedScene === scene.id ? "true" : "false"}>
              <EpisodeSceneCard
                scene={scene}
                onMoveUp={() => {
                  dispatch({ type: "set-selected-scene", sceneId: scene.id });
                  moveScene(scene.id, -1);
                }}
                onMoveDown={() => {
                  dispatch({ type: "set-selected-scene", sceneId: scene.id });
                  moveScene(scene.id, 1);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline">
            Add scene placeholder
          </Button>
          <Button type="button" variant="ghost">
            Drag handle ready
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
