import type { Meta, StoryObj } from "@storybook/react";

import { WorldStatusBadge } from "@/components/world/world-status-badge";

const meta = {
  title: "World/WorldStatusBadge",
  component: WorldStatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof WorldStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {
  args: {
    status: "draft",
  },
};

export const Published: Story = {
  args: {
    status: "published",
  },
};
