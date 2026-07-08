import type { Meta, StoryObj } from "@storybook/react";

import { TimelineView } from "@/components/production/timeline-view";
import { mockProductions } from "@/features/production";

const milestones = mockProductions[0]?.milestones;

if (!milestones) {
  throw new Error("Expected production milestones");
}

const meta = {
  title: "Production/TimelineView",
  component: TimelineView,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    milestones,
  },
};
