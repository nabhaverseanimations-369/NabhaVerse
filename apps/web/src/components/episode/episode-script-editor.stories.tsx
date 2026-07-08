import type { Meta, StoryObj } from "@storybook/react";

import { EpisodeScriptEditor } from "@/components/episode/episode-script-editor";
import { mockEpisodes } from "@/features/episode/data/episode-mocks";

const episode = mockEpisodes[0];

if (!episode) {
  throw new Error("Expected at least one mock episode");
}

const meta = {
  title: "Episode/EpisodeScriptEditor",
  component: EpisodeScriptEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeScriptEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    episode,
  },
};
