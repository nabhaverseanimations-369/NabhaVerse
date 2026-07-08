import * as React from "react";
import { notFound } from "next/navigation";

import { CharacterDocumentEditor } from "@/components/character";
import {
  characterWorkspaceSections,
  isCharacterSection,
} from "@/features/character/constants/character-sections";
import { mockCharacters } from "@/features/character/data/character-mocks";

interface CharacterSectionPageProps {
  params: Promise<{ characterId: string; section: string }>;
}

export default async function CharacterSectionPage({
  params,
}: CharacterSectionPageProps): Promise<React.JSX.Element> {
  const { characterId, section } = await params;
  const character = mockCharacters.find((entry) => entry.id === characterId);

  if (!character || !isCharacterSection(section) || section === "overview") {
    notFound();
  }

  const sectionMeta = characterWorkspaceSections.find((entry) => entry.id === section);
  if (!sectionMeta) {
    notFound();
  }

  return (
    <CharacterDocumentEditor
      title={sectionMeta.label}
      description={sectionMeta.description}
      version={character.version}
    />
  );
}
