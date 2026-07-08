import type { Meta, StoryObj } from "@storybook/react";

import { ProductionHealthPanel } from "@/components/production/production-health-panel";
import { mockProductions } from "@/features/production";

const production = mockProductions[0];

if (!production) {
  throw new Error("Expected at least one production mock");
}

const meta = {
  title: "Production/ProductionHealthPanel",
  component: ProductionHealthPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductionHealthPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    production,
  },
};
