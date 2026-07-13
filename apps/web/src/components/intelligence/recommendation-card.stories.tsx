import type { Meta, StoryObj } from "@storybook/react";

import { RecommendationCard } from "@/components/intelligence/recommendation-card";
import { mockRecommendations } from "@/features/intelligence";

const recommendation = mockRecommendations[0];

if (!recommendation) {
  throw new Error("Expected intelligence recommendation mock");
}

const meta = {
  title: "Intelligence/RecommendationCard",
  component: RecommendationCard,
  tags: ["autodocs"],
} satisfies Meta<typeof RecommendationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recommendation,
  },
};
