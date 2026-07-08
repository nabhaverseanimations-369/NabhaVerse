import type { Meta, StoryObj } from "@storybook/react";

import { ProductionCard } from "@/components/production/production-card";
import { mockProductions } from "@/features/production";

const production = mockProductions[0];

if (!production) {
  throw new Error("Expected at least one production mock");
}

const meta = {
  title: "Production/ProductionCard",
  component: ProductionCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    production,
    href: `/production/studio/${production.id}/overview`,
    onToggleFavorite: () => undefined,
  },
};
