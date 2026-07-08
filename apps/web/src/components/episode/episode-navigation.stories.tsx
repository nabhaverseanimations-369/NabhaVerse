import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeNavigation } from "@/components/episode/episode-navigation";

const meta = {
  title: "Episode/EpisodeNavigation",
  component: EpisodeNavigation,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    episodeId: "eps_012",
    activePlugin: "overview",
  },
};
