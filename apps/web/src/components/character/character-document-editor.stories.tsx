import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { CharacterDocumentEditor } from "@/components/character/character-document-editor";
import { mockCharacters } from "@/features/character/data/character-mocks";
import { CharacterWorkspaceProvider } from "@/features/character/state/character-workspace-state";
import type { Character } from "@/features/character/types/character.types";

function getPrimaryCharacter(): Character {
  const character = mockCharacters[0];
  if (!character) {
    throw new Error("Expected at least one mock character");
  }
  return character;
}

const meta: Meta<typeof CharacterDocumentEditor> = {
  title: "Character/CharacterDocumentEditor",
  component: CharacterDocumentEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const primaryCharacter = getPrimaryCharacter();
      return (
        <CharacterWorkspaceProvider
          initialCharacter={primaryCharacter}
          initialSheet="character-bible"
          initialMarkdown="Character bible draft content"
        >
          <Story />
        </CharacterWorkspaceProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Character Bible",
    description: "Canonical profile and story continuity notes.",
    version: "v2.8",
  },
};
