import type { Meta, StoryObj } from "@storybook/react";

import { ReviewCard } from "@/components/production/review-card";
import { mockProductions } from "@/features/production";

const review = mockProductions[0]?.reviews[0];

if (!review) {
  throw new Error("Expected at least one production review");
}

const meta = {
  title: "Production/ReviewCard",
  component: ReviewCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    review,
  },
};
