import * as React from "react";
import { notFound } from "next/navigation";

import { getCharacterSheetPlugin } from "@/features/character/constants/character-sections";
import { mockCharacters } from "@/features/character/data/character-mocks";

interface CharacterOverviewPageProps {
  params: Promise<{ characterId: string }>;
}

export default async function CharacterOverviewPage({
  params,
}: CharacterOverviewPageProps): Promise<React.JSX.Element> {
  const { characterId } = await params;
  const character = mockCharacters.find((entry) => entry.id === characterId);

  if (!character) {
    notFound();
  }

  const plugin = getCharacterSheetPlugin("overview");

  return <plugin.component entity={character} />;
}
