import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { publishingPluginRegistry } from "@/features/publishing/plugins/publishing-plugin-registry";
import type { PublishingPluginId } from "@/features/publishing/plugins/publishing-plugin-registry";

export function PublishingNavigation({
  workspaceId,
  activePlugin,
  collapsed = false,
}: {
  workspaceId: string;
  activePlugin: PublishingPluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<PublishingPluginId>
      entityId={workspaceId}
      activePluginId={activePlugin}
      plugins={publishingPluginRegistry}
      collapsed={collapsed}
      label="Publishing sections"
      getHref={(plugin, entityId) => `/publishing/studio/${entityId}/${plugin.id}`}
    />
  );
}
