import type { Meta, StoryObj } from "@storybook/react";

import { MilestoneCard } from "@/components/production/milestone-card";
import { mockProductions } from "@/features/production";

const milestone = mockProductions[0]?.milestones[0];

if (!milestone) {
  throw new Error("Expected at least one production milestone");
}

const meta = {
  title: "Production/MilestoneCard",
  component: MilestoneCard,
  tags: ["autodocs"],
} satisfies Meta<typeof MilestoneCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    milestone,
  },
};
