import type { Meta, StoryObj } from "@storybook/react";

import { DistributionTargetCard } from "@/components/publishing/distribution-target-card";
import { mockPublications } from "@/features/publishing";

const target = mockPublications[0]?.releases[0]?.targets[0];

if (!target) {
  throw new Error("Expected distribution target mock");
}

const meta = {
  title: "Publishing/DistributionTargetCard",
  component: DistributionTargetCard,
  tags: ["autodocs"],
} satisfies Meta<typeof DistributionTargetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    target,
  },
};
