import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { collaborationPluginRegistry } from "@/features/collaboration/plugins/collaboration-plugin-registry";
import type { CollaborationPluginId } from "@/features/collaboration/types/collaboration.types";

export function CollaborationNavigation({
  workspaceId,
  activePlugin,
  collapsed = false,
}: {
  workspaceId: string;
  activePlugin: CollaborationPluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<CollaborationPluginId>
      entityId={workspaceId}
      activePluginId={activePlugin}
      plugins={collaborationPluginRegistry}
      collapsed={collapsed}
      label="Collaboration sections"
      getHref={(plugin, entityId) => `/collaboration/studio/${entityId}/${plugin.id}`}
    />
  );
}
