"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { resolveStudioRouteSegment, useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { PublishingNavigation } from "@/components/publishing/publishing-navigation";
import {
  isPublishingPluginId,
  type PublishingPluginId,
} from "@/features/publishing/plugins/publishing-plugin-registry";
import { usePublishingWorkspaceState } from "@/features/publishing/state/publishing-workspace-state";

function resolveActivePlugin(pathname: string): PublishingPluginId {
  return resolveStudioRouteSegment(pathname, 3, isPublishingPluginId, "overview");
}

export function PublishingWorkspaceShell({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = usePublishingWorkspaceState();
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
            Publishing Studio
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              sidebar.collapsed ? "Expand publishing navigation" : "Collapse publishing navigation"
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
        <PublishingNavigation
          workspaceId={workspaceId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
