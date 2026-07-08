import type { Meta, StoryObj } from "@storybook/react";

import { ScheduleTimeline } from "@/components/publishing/schedule-timeline";
import { mockPublications } from "@/features/publishing";

const releases = mockPublications[0]?.releases;

if (!releases) {
  throw new Error("Expected publishing releases");
}

const meta = {
  title: "Publishing/ScheduleTimeline",
  component: ScheduleTimeline,
  tags: ["autodocs"],
} satisfies Meta<typeof ScheduleTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    releases,
  },
};
