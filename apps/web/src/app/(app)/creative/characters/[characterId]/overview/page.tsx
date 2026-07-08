import * as React from "react";
import { notFound } from "next/navigation";

import {
  AssetGallery,
  CharacterDocumentEditor,
  CharacterOverviewPanel,
  RelationshipGraphPlaceholder,
  VersionTimeline,
} from "@/components/character";
import {
  mockCharacterAssets,
  mockCharacterRelationships,
  mockCharacterVersions,
  mockCharacters,
} from "@/features/character/data/character-mocks";

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

  return (
    <section className="space-y-4">
      <CharacterOverviewPanel character={character} />
      <div className="grid gap-4 xl:grid-cols-2">
        <VersionTimeline
          versions={mockCharacterVersions.filter((version) => version.characterId === character.id)}
        />
        <RelationshipGraphPlaceholder
          relationships={mockCharacterRelationships.filter(
            (relationship) => relationship.characterId === character.id,
          )}
        />
      </div>
      <AssetGallery
        assets={mockCharacterAssets.filter((asset) => asset.characterId === character.id)}
      />
      <CharacterDocumentEditor
        title="Overview Notes"
        description="Working notes and creative alignment context for this character."
        version={character.version}
      />
    </section>
  );
}
