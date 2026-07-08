import * as React from "react";

import { StudioPluginNavigation } from "@/components/studio/studio-plugin-navigation";
import { worldPluginRegistry } from "@/features/world/plugins/world-plugin-registry";
import type { WorldPluginId } from "@/features/world/types/world.types";

interface DocumentNavigationProps {
  worldId: string;
  activePlugin: WorldPluginId;
  collapsed?: boolean;
}

export function DocumentNavigation({
  worldId,
  activePlugin,
  collapsed = false,
}: DocumentNavigationProps): React.JSX.Element {
  return (
    <StudioPluginNavigation<WorldPluginId>
      entityId={worldId}
      activePluginId={activePlugin}
      plugins={worldPluginRegistry}
      collapsed={collapsed}
      label="World sections"
      getHref={(plugin, entityId) => `/creative/worlds/${entityId}/${plugin.id}`}
    />
  );
}
