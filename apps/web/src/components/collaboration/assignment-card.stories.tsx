import type { Meta, StoryObj } from "@storybook/react";

import { AssignmentCard } from "@/components/collaboration/assignment-card";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const assignment = mockCollaborationWorkspaces[0]?.assignedToMe[0];

if (!assignment) {
  throw new Error("Expected collaboration assignment mock");
}

const meta = {
  title: "Collaboration/AssignmentCard",
  component: AssignmentCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AssignmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    assignment,
  },
};
