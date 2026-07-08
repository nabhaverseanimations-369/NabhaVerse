import type { Meta, StoryObj } from "@storybook/react";

import { PublishingDashboard } from "@/components/publishing/publishing-dashboard";

const meta = {
  title: "Publishing/PublishingDashboard",
  component: PublishingDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof PublishingDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
