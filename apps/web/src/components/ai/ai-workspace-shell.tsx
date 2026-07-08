"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { AINavigation } from "@/components/ai/ai-navigation";
import { isAIPluginId } from "@/features/ai/plugins/ai-plugin-registry";
import { useAIWorkspaceState } from "@/features/ai/state/ai-workspace-state";
import type { AIPluginId } from "@/features/ai/plugins/ai-plugin-registry";

function resolveActivePlugin(pathname: string): AIPluginId {
  const segments = pathname.split("/").filter(Boolean);
  const maybePlugin = segments[3];
  if (!maybePlugin || !isAIPluginId(maybePlugin)) {
    return "overview";
  }
  return maybePlugin;
}

export function AIWorkspaceShell({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = useAIWorkspaceState();
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
            AI Studio
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={sidebar.collapsed ? "Expand AI navigation" : "Collapse AI navigation"}
            onClick={() => sidebar.toggleCollapsed()}
          >
            {sidebar.collapsed ? (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <AINavigation
          workspaceId={workspaceId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
