import type { Meta, StoryObj } from "@storybook/react";

import { CommentCard } from "@/components/collaboration/comment-card";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const comment = mockCollaborationWorkspaces[0]?.openComments[0];

if (!comment) {
  throw new Error("Expected collaboration comment mock");
}

const meta = {
  title: "Collaboration/CommentCard",
  component: CommentCard,
  tags: ["autodocs"],
} satisfies Meta<typeof CommentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment,
  },
};
