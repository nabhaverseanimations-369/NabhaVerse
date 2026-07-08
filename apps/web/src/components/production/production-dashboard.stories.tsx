import type { Meta, StoryObj } from "@storybook/react";

import { ProductionDashboard } from "@/components/production/production-dashboard";

const meta = {
  title: "Production/ProductionDashboard",
  component: ProductionDashboard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductionDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
