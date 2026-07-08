import type { Meta, StoryObj } from "@storybook/react";

import { WorldCard } from "@/components/world/world-card";
import { mockWorlds } from "@/features/world/data/world-mocks";

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

const meta = {
  title: "World/WorldCard",
  component: WorldCard,
  tags: ["autodocs"],
} satisfies Meta<typeof WorldCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    world,
    href: "/creative/worlds/wld_lunara/overview",
    onToggleFavorite: () => {},
  },
};
