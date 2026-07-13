import type { Meta, StoryObj } from "@storybook/react";

import { IntelligenceDashboard } from "@/components/intelligence/intelligence-dashboard";

const meta = {
  title: "Intelligence/IntelligenceDashboard",
  component: IntelligenceDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof IntelligenceDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
