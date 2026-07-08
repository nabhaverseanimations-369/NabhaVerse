import type { Meta, StoryObj } from "@storybook/react";

import { AIDashboard } from "@/components/ai/ai-dashboard";
import { mockAIWorkspace } from "@/features/ai";

const meta = {
  title: "AI/AIDashboard",
  component: AIDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof AIDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    workspace: mockAIWorkspace,
  },
};
