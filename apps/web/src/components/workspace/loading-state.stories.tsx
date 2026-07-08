import type { Meta, StoryObj } from "@storybook/react";

import { PanelSkeleton } from "@/components/workspace/loading-state";

const meta = {
  title: "Workspace/PanelSkeleton",
  component: PanelSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof PanelSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
