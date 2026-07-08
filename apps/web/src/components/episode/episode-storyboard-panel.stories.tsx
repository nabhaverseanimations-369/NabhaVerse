import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeStoryboardPanel } from "@/components/episode/episode-storyboard-panel";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

const episode = mockEpisodes[0];

if (!episode) {
  throw new Error("Expected at least one mock episode");
}

const meta = {
  title: "Episode/EpisodeStoryboardPanel",
  component: EpisodeStoryboardPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeStoryboardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    episode,
  },
};
