"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { resolveStudioRouteSegment, useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { CollaborationNavigation } from "@/components/collaboration/collaboration-navigation";
import { isCollaborationPluginId } from "@/features/collaboration/plugins/collaboration-plugin-registry";
import { useCollaborationWorkspaceState } from "@/features/collaboration/state/collaboration-workspace-state";
import type { CollaborationPluginId } from "@/features/collaboration/types/collaboration.types";

function resolveActivePlugin(pathname: string): CollaborationPluginId {
  return resolveStudioRouteSegment(pathname, 3, isCollaborationPluginId, "overview");
}

export function CollaborationWorkspaceShell({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = useCollaborationWorkspaceState();
  const sidebar = useStudioSidebarState(false);
  const activePlugin = resolveActivePlugin(pathname);

  React.useEffect(() => {
    dispatch({ type: "set-plugin", plugin: activePlugin });
  }, [activePlugin, dispatch]);

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <Card className="h-fit p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Collaboration Studio
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              sidebar.collapsed
                ? "Expand collaboration navigation"
                : "Collapse collaboration navigation"
            }
            onClick={() => sidebar.toggleCollapsed()}
          >
            {sidebar.collapsed ? (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <CollaborationNavigation
          workspaceId={workspaceId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
