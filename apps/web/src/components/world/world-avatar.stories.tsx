import type { Meta, StoryObj } from "@storybook/react";

import { WorldAvatar } from "@/components/world/world-avatar";
import { mockWorlds } from "@/features/world/data/world-mocks";

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

const meta = {
  title: "World/WorldAvatar",
  component: WorldAvatar,
  tags: ["autodocs"],
} satisfies Meta<typeof WorldAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: world.name,
    coverImageUrl: world.coverImageUrl,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    name: world.name,
    coverImageUrl: world.coverImageUrl,
    size: "lg",
  },
};
