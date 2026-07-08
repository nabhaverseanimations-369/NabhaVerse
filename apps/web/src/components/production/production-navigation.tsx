import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { productionPluginRegistry } from "@/features/production/plugins/production-plugin-registry";
import type { ProductionPluginId } from "@/features/production/plugins/production-plugin-registry";

export function ProductionNavigation({
  productionId,
  activePlugin,
  collapsed = false,
}: {
  productionId: string;
  activePlugin: ProductionPluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<ProductionPluginId>
      entityId={productionId}
      activePluginId={activePlugin}
      plugins={productionPluginRegistry}
      collapsed={collapsed}
      label="Production sections"
      getHref={(plugin, entityId) => `/production/studio/${entityId}/${plugin.id}`}
    />
  );
}
