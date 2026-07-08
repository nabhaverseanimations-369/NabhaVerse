import type { Meta, StoryObj } from "@storybook/react";

import { WorldLibrary } from "@/components/world/world-library";

const meta = {
  title: "World/WorldLibrary",
  component: WorldLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof WorldLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialLoading: false,
  },
};

export const LoadingState: Story = {
  args: {
    initialLoading: true,
    loadingDelayMs: 120000,
  },
};

export const EmptyState: Story = {
  args: {
    initialLoading: false,
    initialWorlds: [],
  },
};
