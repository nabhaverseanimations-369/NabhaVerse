"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button, Card } from "@nabhaverse/ui";
import { resolveStudioRouteSegment, useStudioSidebarState } from "@nabhaverse/studio-sdk";

import { ProductionNavigation } from "@/components/production/production-navigation";
import { isProductionPluginId } from "@/features/production/plugins/production-plugin-registry";
import { useProductionWorkspaceState } from "@/features/production/state/production-workspace-state";
import type { ProductionPluginId } from "@/features/production/plugins/production-plugin-registry";

function resolveActivePlugin(pathname: string): ProductionPluginId {
  return resolveStudioRouteSegment(pathname, 3, isProductionPluginId, "overview");
}

export function ProductionWorkspaceShell({
  productionId,
  children,
}: {
  productionId: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { dispatch } = useProductionWorkspaceState();
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
            Production Studio
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              sidebar.collapsed ? "Expand production navigation" : "Collapse production navigation"
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
        <ProductionNavigation
          productionId={productionId}
          activePlugin={activePlugin}
          collapsed={sidebar.collapsed}
        />
      </Card>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
