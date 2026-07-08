import type { Meta, StoryObj } from "@storybook/react";

import { ActivityFeed } from "@/components/collaboration/activity-feed";
import { mockGlobalActivityFeed } from "@/features/collaboration";

const meta = {
  title: "Collaboration/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Global Activity",
    items: mockGlobalActivityFeed,
  },
};
