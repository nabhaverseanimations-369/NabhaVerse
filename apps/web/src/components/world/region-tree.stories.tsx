import type { Meta, StoryObj } from "@storybook/react";

import { RegionTree } from "@/components/world/region-tree";

const meta = {
  title: "World/RegionTree",
  component: RegionTree,
  tags: ["autodocs"],
} satisfies Meta<typeof RegionTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
