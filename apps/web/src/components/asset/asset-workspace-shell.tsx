"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { resolveStudioRouteSegment, useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { AssetNavigation } from "@/components/asset/asset-navigation";
import { isAssetPluginId } from "@/features/asset/plugins/asset-plugin-registry";
import { useAssetWorkspaceState } from "@/features/asset/state/asset-workspace-state";
import type { AssetPluginId } from "@/features/asset/plugins/asset-plugin-registry";

function resolveActivePlugin(pathname: string): AssetPluginId {
  return resolveStudioRouteSegment(pathname, 3, isAssetPluginId, "overview");
}

export function AssetWorkspaceShell({
  assetId,
  children,
}: {
  assetId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = useAssetWorkspaceState();
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
            Asset Workspace
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={sidebar.collapsed ? "Expand asset navigation" : "Collapse asset navigation"}
            onClick={() => sidebar.toggleCollapsed()}
          >
            {sidebar.collapsed ? (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <AssetNavigation
          assetId={assetId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
