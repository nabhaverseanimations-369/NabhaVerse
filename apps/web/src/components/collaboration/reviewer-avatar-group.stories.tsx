import type { Meta, StoryObj } from "@storybook/react";

import { ReviewerAvatarGroup } from "@/components/collaboration/reviewer-avatar-group";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const reviewers = mockCollaborationWorkspaces[0]?.pendingReviews[0]?.reviewerNames;

if (!reviewers) {
  throw new Error("Expected collaboration reviewers mock");
}

const meta = {
  title: "Collaboration/ReviewerAvatarGroup",
  component: ReviewerAvatarGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewerAvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reviewers,
  },
};
