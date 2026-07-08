import type { Meta, StoryObj } from "@storybook/react";

import { DiscussionThread } from "@/components/collaboration/discussion-thread";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const workspace = mockCollaborationWorkspaces[0];
const discussion = workspace?.discussions[0];

if (!workspace || !discussion) {
  throw new Error("Expected collaboration discussion mock");
}

const meta = {
  title: "Collaboration/DiscussionThread",
  component: DiscussionThread,
  tags: ["autodocs"],
} satisfies Meta<typeof DiscussionThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    discussion,
    comments: workspace.openComments,
    selectedCommentId: workspace.openComments[0]?.id ?? null,
  },
};
