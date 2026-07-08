import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeOverviewPanel } from "@/components/episode/episode-overview-panel";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

const episode = mockEpisodes[0];

if (!episode) {
  throw new Error("Expected at least one mock episode");
}

const meta = {
  title: "Episode/EpisodeOverviewPanel",
  component: EpisodeOverviewPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeOverviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    episode,
  },
};
