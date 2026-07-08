import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeSceneCard } from "@/components/episode/episode-scene-card";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

const scene = mockEpisodes[0]?.scenes[0];

if (!scene) {
  throw new Error("Expected at least one mock scene");
}

const meta = {
  title: "Episode/EpisodeSceneCard",
  component: EpisodeSceneCard,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeSceneCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scene,
    onMoveUp: () => {},
    onMoveDown: () => {},
  },
};
