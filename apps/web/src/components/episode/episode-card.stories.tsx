import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeCard } from "@/components/episode/episode-card";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

const episode = mockEpisodes[0];

if (!episode) {
  throw new Error("Expected at least one mock episode");
}

const meta = {
  title: "Episode/EpisodeCard",
  component: EpisodeCard,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    episode,
    href: "/production/episodes/eps_012/overview",
    onToggleFavorite: () => {},
  },
};
