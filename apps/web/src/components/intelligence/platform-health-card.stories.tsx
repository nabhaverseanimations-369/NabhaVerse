import type { Meta, StoryObj } from "@storybook/react";

import { PlatformHealthCard } from "@/components/intelligence/platform-health-card";
import { mockPlatformHealth } from "@/features/intelligence";

const metric = mockPlatformHealth[0];

if (!metric) {
  throw new Error("Expected platform health mock");
}

const meta = {
  title: "Intelligence/PlatformHealthCard",
  component: PlatformHealthCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PlatformHealthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metric,
  },
};
