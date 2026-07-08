import * as React from "react";
import { notFound } from "next/navigation";

import { CharacterWorkspaceShell } from "@/components/character/character-workspace-shell";
import { mockCharacters } from "@/features/character/data/character-mocks";
import { CharacterWorkspaceProvider } from "@/features/character/state/character-workspace-state";

interface CharacterWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ characterId: string }>;
}

export default async function CharacterWorkspaceLayout({
  children,
  params,
}: CharacterWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { characterId } = await params;
  const character = mockCharacters.find((entry) => entry.id === characterId);

  if (!character) {
    notFound();
  }

  return (
    <CharacterWorkspaceProvider
      initialCharacter={character}
      initialSheet="overview"
      initialMarkdown={`# ${character.name}\n\nCharacter workspace is ready.`}
    >
      <CharacterWorkspaceShell characterId={characterId}>{children}</CharacterWorkspaceShell>
    </CharacterWorkspaceProvider>
  );
}
