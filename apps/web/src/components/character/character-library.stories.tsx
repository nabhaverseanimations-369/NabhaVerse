import type { Meta, StoryObj } from "@storybook/react";

import { CharacterLibrary } from "@/components/character/character-library";

const meta = {
  title: "Character/CharacterLibrary",
  component: CharacterLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
