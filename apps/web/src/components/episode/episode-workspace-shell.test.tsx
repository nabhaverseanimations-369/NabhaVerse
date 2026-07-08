import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { EpisodeWorkspaceProvider } from "@/features/episode/state/episode-workspace-state";
import { EpisodeWorkspaceShell } from "@/components/episode/episode-workspace-shell";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";
import { renderWithProviders } from "@/test/test-utils";

describe("EpisodeWorkspaceShell", () => {
  it("renders navigation and workspace content", () => {
    const episode = mockEpisodes[0];

    if (!episode) {
      throw new Error("Expected at least one mock episode");
    }

    renderWithProviders(
      <EpisodeWorkspaceProvider
        initialEpisode={episode}
        initialPlugin="overview"
        initialMarkdown="# Episode overview"
      >
        <EpisodeWorkspaceShell episodeId={episode.id}>
          <div>Episode workspace content</div>
        </EpisodeWorkspaceShell>
      </EpisodeWorkspaceProvider>,
    );

    expect(screen.getByText("Episode Workspace")).toBeInTheDocument();
    expect(screen.getByText("Episode workspace content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });
});
