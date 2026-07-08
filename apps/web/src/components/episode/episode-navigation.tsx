import * as React from "react";

import { StudioPluginNavigation } from "@nabhaverse/studio-sdk";

import { episodePluginRegistry } from "@/features/episode/plugins/episode-plugin-registry";
import type { EpisodePluginId } from "@/features/episode/types/episode.types";

export function EpisodeNavigation({
  episodeId,
  activePlugin,
  collapsed = false,
}: {
  episodeId: string;
  activePlugin: EpisodePluginId;
  collapsed?: boolean;
}): React.JSX.Element {
  return (
    <StudioPluginNavigation<EpisodePluginId>
      entityId={episodeId}
      activePluginId={activePlugin}
      plugins={episodePluginRegistry}
      collapsed={collapsed}
      label="Episode sections"
      getHref={(plugin, entityId) => `/production/episodes/${entityId}/${plugin.id}`}
    />
  );
}
