import * as React from "react";
import { notFound } from "next/navigation";

import { EpisodeWorkspaceShell } from "@/components/episode";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";
import { EpisodeWorkspaceProvider } from "@/features/episode/state/episode-workspace-state";

interface EpisodeWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ episodeId: string }>;
}

export default async function EpisodeWorkspaceLayout({
  children,
  params,
}: EpisodeWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { episodeId } = await params;
  const episode = mockEpisodes.find((entry) => entry.id === episodeId);

  if (!episode) {
    notFound();
  }

  return (
    <EpisodeWorkspaceProvider
      initialEpisode={episode}
      initialPlugin="overview"
      initialMarkdown={`# ${episode.title}\n\nEpisode workspace is ready.`}
    >
      <EpisodeWorkspaceShell episodeId={episodeId}>{children}</EpisodeWorkspaceShell>
    </EpisodeWorkspaceProvider>
  );
}
