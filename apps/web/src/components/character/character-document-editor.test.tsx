import * as React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CharacterDocumentEditor } from "@/components/character/character-document-editor";
import { mockCharacters } from "@/features/character/data/character-mocks";
import { CharacterWorkspaceProvider } from "@/features/character/state/character-workspace-state";
import type { Character } from "@/features/character/types/character.types";
import { renderWithProviders } from "@/test/test-utils";

function getPrimaryCharacter(): Character {
  const character = mockCharacters[0];
  if (!character) {
    throw new Error("Expected at least one mock character");
  }
  return character;
}

function WrappedEditor(): React.JSX.Element {
  const primaryCharacter = getPrimaryCharacter();

  return (
    <CharacterWorkspaceProvider
      initialCharacter={primaryCharacter}
      initialSheet="character-bible"
      initialMarkdown="Starter content"
    >
      <CharacterDocumentEditor
        title="Character Bible"
        description="Canonical profile"
        version="v2.8"
      />
    </CharacterWorkspaceProvider>
  );
}

describe("CharacterDocumentEditor", () => {
  it("tracks unsaved changes while editing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WrappedEditor />);

    expect(screen.getByText("All changes saved")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Character Bible content" }), " updated");

    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
  });
});
