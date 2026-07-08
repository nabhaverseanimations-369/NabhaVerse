"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { EpisodeNavigation } from "@/components/episode/episode-navigation";
import { isEpisodePluginId } from "@/features/episode/plugins/episode-plugin-registry";
import { useEpisodeWorkspaceState } from "@/features/episode/state/episode-workspace-state";
import type { EpisodePluginId } from "@/features/episode/types/episode.types";

function resolveActivePlugin(pathname: string): EpisodePluginId {
  const segments = pathname.split("/").filter(Boolean);
  const maybePlugin = segments[3];
  if (!maybePlugin || !isEpisodePluginId(maybePlugin)) {
    return "overview";
  }
  return maybePlugin;
}

export function EpisodeWorkspaceShell({
  episodeId,
  children,
}: {
  episodeId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = useEpisodeWorkspaceState();
  const sidebar = useStudioSidebarState(false);
  const activePlugin = resolveActivePlugin(pathname);

  React.useEffect(() => {
    dispatch({ type: "set-plugin", plugin: activePlugin });
  }, [activePlugin, dispatch]);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="h-fit p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Episode Workspace
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              sidebar.collapsed ? "Expand episode navigation" : "Collapse episode navigation"
            }
            onClick={() => {
              sidebar.toggleCollapsed();
            }}
          >
            {sidebar.collapsed ? (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <EpisodeNavigation
          episodeId={episodeId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
