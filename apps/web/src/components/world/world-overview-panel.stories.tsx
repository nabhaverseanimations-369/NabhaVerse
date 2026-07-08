import type { Meta, StoryObj } from "@storybook/react";

import { WorldOverviewPanel } from "@/components/world/world-overview-panel";
import { mockWorlds } from "@/features/world/data/world-mocks";

const world = mockWorlds[0];

if (!world) {
  throw new Error("Expected at least one mock world");
}

const meta = {
  title: "World/WorldOverview",
  component: WorldOverviewPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof WorldOverviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    world,
  },
};
