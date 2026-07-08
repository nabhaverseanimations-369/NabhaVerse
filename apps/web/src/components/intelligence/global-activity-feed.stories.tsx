import type { Meta, StoryObj } from "@storybook/react";

import { GlobalActivityFeed } from "@/components/intelligence/global-activity-feed";
import { mockIntelligenceActivity } from "@/features/intelligence";

const meta = {
  title: "Intelligence/GlobalActivityFeed",
  component: GlobalActivityFeed,
  tags: ["autodocs"],
} satisfies Meta<typeof GlobalActivityFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: mockIntelligenceActivity,
  },
};
