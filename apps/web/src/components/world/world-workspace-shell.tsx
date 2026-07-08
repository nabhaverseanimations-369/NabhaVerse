"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button, Card } from "@nabhaverse/ui";

import { DocumentNavigation } from "@/components/world/document-navigation";
import { isWorldPluginId } from "@/features/world/plugins/world-plugin-registry";
import { useWorldWorkspaceState } from "@/features/world/state/world-workspace-state";
import type { WorldPluginId } from "@/features/world/types/world.types";

function resolveActivePlugin(pathname: string): WorldPluginId {
  const segments = pathname.split("/").filter(Boolean);
  const maybePlugin = segments[3];
  if (!maybePlugin || !isWorldPluginId(maybePlugin)) {
    return "overview";
  }
  return maybePlugin;
}

export function WorldWorkspaceShell({
  worldId,
  children,
}: {
  worldId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { state, dispatch } = useWorldWorkspaceState();
  const activePlugin = resolveActivePlugin(pathname);

  React.useEffect(() => {
    dispatch({ type: "set-plugin", plugin: activePlugin });
  }, [activePlugin, dispatch]);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="h-fit p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            World Workspace
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              state.workspaceSettings.sidebarCollapsed
                ? "Expand world navigation"
                : "Collapse world navigation"
            }
            onClick={() => {
              dispatch({
                type: "set-sidebar-collapsed",
                collapsed: !state.workspaceSettings.sidebarCollapsed,
              });
            }}
          >
            {state.workspaceSettings.sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <DocumentNavigation
          worldId={worldId}
          activePlugin={activePlugin}
          collapsed={state.workspaceSettings.sidebarCollapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
