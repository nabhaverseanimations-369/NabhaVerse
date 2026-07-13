import type { Meta, StoryObj } from "@storybook/react";

import { QuickActionCard } from "@/components/intelligence/quick-action-card";
import { mockQuickActions } from "@/features/intelligence";

const action = mockQuickActions[0];

if (!action) {
  throw new Error("Expected quick action mock");
}

const meta = {
  title: "Intelligence/QuickActionCard",
  component: QuickActionCard,
  tags: ["autodocs"],
} satisfies Meta<typeof QuickActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action,
  },
};
