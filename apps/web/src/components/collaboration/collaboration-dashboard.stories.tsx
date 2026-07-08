import type { Meta, StoryObj } from "@storybook/react";

import { CollaborationDashboard } from "@/components/collaboration/collaboration-dashboard";

const meta = {
  title: "Collaboration/CollaborationDashboard",
  component: CollaborationDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof CollaborationDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
