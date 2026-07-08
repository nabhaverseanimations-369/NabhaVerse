import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeLibrary } from "@/components/episode/episode-library";

const meta = {
  title: "Episode/EpisodeLibrary",
  component: EpisodeLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialLoading: false,
  },
};
