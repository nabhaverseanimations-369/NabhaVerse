import type { Meta, StoryObj } from "@storybook/react";

import { TimelineView } from "@/components/world/timeline-view";
import { mockWorldVersions } from "@/features/world/data/world-mocks";

const meta = {
  title: "World/TimelineView",
  component: TimelineView,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    versions: mockWorldVersions,
  },
};
