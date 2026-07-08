import type { Meta, StoryObj } from "@storybook/react";

import { CalendarView } from "@/components/production/calendar-view";
import { mockProductions } from "@/features/production";

const milestones = mockProductions[0]?.milestones;

if (!milestones) {
  throw new Error("Expected production milestones");
}

const meta = {
  title: "Production/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    milestones,
  },
};
