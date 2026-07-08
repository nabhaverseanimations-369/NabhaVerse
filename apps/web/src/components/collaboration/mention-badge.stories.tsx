import type { Meta, StoryObj } from "@storybook/react";

import { MentionBadge } from "@/components/collaboration/mention-badge";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const mention = mockCollaborationWorkspaces[0]?.mentions[0];

if (!mention) {
  throw new Error("Expected collaboration mention mock");
}

const meta = {
  title: "Collaboration/MentionBadge",
  component: MentionBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof MentionBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mention,
  },
};
