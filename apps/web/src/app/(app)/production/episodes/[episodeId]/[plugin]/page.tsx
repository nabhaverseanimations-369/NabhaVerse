import * as React from "react";
import { notFound } from "next/navigation";

import {
  getEpisodePlugin,
  isEpisodePluginId,
} from "@/features/episode/plugins/episode-plugin-registry";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

interface EpisodePluginPageProps {
  params: Promise<{ episodeId: string; plugin: string }>;
}

export default async function EpisodePluginPage({
  params,
}: EpisodePluginPageProps): Promise<React.JSX.Element> {
  const { episodeId, plugin } = await params;
  const episode = mockEpisodes.find((entry) => entry.id === episodeId);

  if (!episode || !isEpisodePluginId(plugin)) {
    notFound();
  }

  const EpisodePlugin = getEpisodePlugin(plugin).component;

  return <EpisodePlugin entity={episode} />;
}
