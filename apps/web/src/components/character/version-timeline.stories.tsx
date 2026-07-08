import type { Meta, StoryObj } from "@storybook/react";

import { VersionTimeline } from "@/components/character/version-timeline";
import { mockCharacterVersions } from "@/features/character/data/character-mocks";

const meta = {
  title: "Character/VersionTimeline",
  component: VersionTimeline,
  tags: ["autodocs"],
} satisfies Meta<typeof VersionTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    versions: mockCharacterVersions,
  },
};
