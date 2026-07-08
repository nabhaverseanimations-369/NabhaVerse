import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { assetPluginRegistry } from "@/features/asset/plugins/asset-plugin-registry";
import type { AssetPluginId } from "@/features/asset/plugins/asset-plugin-registry";

export function AssetNavigation({
  assetId,
  activePlugin,
  collapsed = false,
}: {
  assetId: string;
  activePlugin: AssetPluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<AssetPluginId>
      entityId={assetId}
      activePluginId={activePlugin}
      plugins={assetPluginRegistry}
      collapsed={collapsed}
      label="Asset sections"
      getHref={(plugin, entityId) => `/creative/assets/${entityId}/${plugin.id}`}
    />
  );
}
