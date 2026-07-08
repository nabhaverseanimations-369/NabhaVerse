import type { Meta, StoryObj } from "@storybook/react";

import { CharacterCard } from "@/components/character/character-card";
import { mockCharacters } from "@/features/character/data/character-mocks";

const primaryCharacter = mockCharacters[0];

if (!primaryCharacter) {
  throw new Error("Expected at least one mock character");
}

const meta = {
  title: "Character/CharacterCard",
  component: CharacterCard,
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    character: primaryCharacter,
    href: "/creative/characters/chr_aurora/overview",
    onToggleFavorite: () => {},
  },
};
