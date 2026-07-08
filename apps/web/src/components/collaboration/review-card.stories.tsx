import type { Meta, StoryObj } from "@storybook/react";

import { ReviewCard } from "@/components/collaboration/review-card";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const review = mockCollaborationWorkspaces[0]?.pendingReviews[0];

if (!review) {
  throw new Error("Expected collaboration review mock");
}

const meta = {
  title: "Collaboration/ReviewCard",
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
