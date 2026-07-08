import * as React from "react";
import { notFound } from "next/navigation";

import {
  getCharacterSheetPlugin,
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

  const plugin = getCharacterSheetPlugin(section);

  return <plugin.component entity={character} />;
}
