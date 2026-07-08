import type { Meta, StoryObj } from "@storybook/react";

import { TimelineActivity } from "@/components/collaboration/timeline-activity";
import { mockGlobalActivityFeed } from "@/features/collaboration";

const item = mockGlobalActivityFeed[0];

if (!item) {
  throw new Error("Expected collaboration activity mock");
}

const meta = {
  title: "Collaboration/TimelineActivity",
  component: TimelineActivity,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineActivity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item,
  },
  render: (args) => (
    <ol className="space-y-4">
      <TimelineActivity {...args} />
    </ol>
  ),
};
