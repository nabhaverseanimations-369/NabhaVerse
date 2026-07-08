import type { Meta, StoryObj } from "@storybook/react";

import { IntelligenceCommandPalette } from "@/components/intelligence/command-palette";

const meta = {
  title: "Intelligence/CommandPalette",
  component: IntelligenceCommandPalette,
  tags: ["autodocs"],
} satisfies Meta<typeof IntelligenceCommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
