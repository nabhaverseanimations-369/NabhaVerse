import type { Meta, StoryObj } from "@storybook/react";

import { NotificationCard } from "@/components/collaboration/notification-card";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

const notification = mockCollaborationWorkspaces[0]?.notifications[0];

if (!notification) {
  throw new Error("Expected collaboration notification mock");
}

const meta = {
  title: "Collaboration/NotificationCard",
  component: NotificationCard,
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notification,
  },
};
