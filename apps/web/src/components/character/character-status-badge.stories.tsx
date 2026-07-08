import type { Meta, StoryObj } from "@storybook/react";

import { CharacterStatusBadge } from "@/components/character/character-status-badge";

const meta = {
  title: "Character/CharacterStatusBadge",
  component: CharacterStatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {
  args: { status: "draft" },
};

export const InReview: Story = {
  args: { status: "in-review" },
};

export const Approved: Story = {
  args: { status: "approved" },
};
