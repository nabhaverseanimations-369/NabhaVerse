import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { aiPluginRegistry } from "@/features/ai/plugins/ai-plugin-registry";
import type { AIPluginId } from "@/features/ai/plugins/ai-plugin-registry";

export function AINavigation({
  workspaceId,
  activePlugin,
  collapsed = false,
}: {
  workspaceId: string;
  activePlugin: AIPluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<AIPluginId>
      entityId={workspaceId}
      activePluginId={activePlugin}
      plugins={aiPluginRegistry}
      collapsed={collapsed}
      label="AI Studio sections"
      getHref={(plugin, entityId) => `/ai/studio/${entityId}/${plugin.id}`}
    />
  );
}
