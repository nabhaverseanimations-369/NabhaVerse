import type { Meta, StoryObj } from "@storybook/react";

import { ActivityTimeline } from "@/components/workspace/activity-timeline";

const meta = {
  title: "Workspace/ActivityTimeline",
  component: ActivityTimeline,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "AI Activity",
    items: [
      {
        id: "a1",
        title: "Prompt Library synced",
        detail: "14 prompts versioned by the creative team.",
        when: "4m ago",
      },
      {
        id: "a2",
        title: "Voice profile calibration",
        detail: "Three profiles tuned for scene rehearsals.",
        when: "21m ago",
      },
      {
        id: "a3",
        title: "Batch summary generated",
        detail: "Pipeline digest pushed to notifications center.",
        when: "1h ago",
      },
    ],
  },
};
