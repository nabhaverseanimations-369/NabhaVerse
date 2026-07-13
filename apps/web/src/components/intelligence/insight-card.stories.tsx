import type { Meta, StoryObj } from "@storybook/react";

import { InsightCard } from "@/components/intelligence/insight-card";
import { mockInsights } from "@/features/intelligence";

const insight = mockInsights[0];

if (!insight) {
  throw new Error("Expected intelligence insight mock");
}

const meta = {
  title: "Intelligence/InsightCard",
  component: InsightCard,
  tags: ["autodocs"],
} satisfies Meta<typeof InsightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    insight,
  },
};
