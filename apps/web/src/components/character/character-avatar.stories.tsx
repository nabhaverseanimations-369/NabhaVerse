import type { Meta, StoryObj } from "@storybook/react";

import { CharacterAvatar } from "@/components/character/character-avatar";

const meta = {
  title: "Character/CharacterAvatar",
  component: CharacterAvatar,
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Aurora Vale",
  },
};

export const WithImage: Story = {
  args: {
    name: "Aurora Vale",
    avatarUrl: "https://picsum.photos/seed/aurora-avatar/240/240",
    size: "lg",
  },
};
