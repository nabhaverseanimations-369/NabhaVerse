import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";
import { StudioCommentPanel, StudioDocumentEditor } from "@nabhaverse/studio-sdk";

import { mockCharacters } from "@/features/character/data/character-mocks";
import { mockWorlds } from "@/features/world/data/world-mocks";
import { mockEpisodeReferences } from "@/features/episode/data/episode-mocks";
import type { Episode } from "@/features/episode/types/episode.types";

function ReferenceList({
  title,
  items,
}: {
  title: string;
  items: readonly { id: string; name: string; subtitle: string }[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{item.name}</p>
            <p className="text-[var(--color-text-secondary)]">{item.subtitle}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function SimpleCard({ title, body }: { title: string; body: string }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{body}</p>
      </CardContent>
    </Card>
  );
}

export function EpisodeCastPanel({ episode }: { episode: Episode }): React.JSX.Element {
  const cast = mockCharacters
    .filter((character) => episode.characterIds.includes(character.id))
    .map((character) => ({ id: character.id, name: character.name, subtitle: character.summary }));

  return (
    <ReferenceList
      title="Character Cast"
      items={
        cast.length > 0
          ? cast
          : mockEpisodeReferences.map((item) => ({
              id: item.id,
              name: item.title,
              subtitle: item.subtitle,
            }))
      }
    />
  );
}

export function EpisodeLocationsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  const locations = mockWorlds
    .filter((world) => episode.worldIds.includes(world.id))
    .map((world) => ({ id: world.id, name: world.name, subtitle: world.description }));

  const fallback = episode.locationNames.map((location) => ({
    id: location,
    name: location,
    subtitle: "Referenced location from episode planning",
  }));

  return <ReferenceList title="Locations" items={locations.length > 0 ? locations : fallback} />;
}

export function EpisodePropsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <ReferenceList
      title="Props"
      items={episode.propNames.map((prop) => ({
        id: prop,
        name: prop,
        subtitle: "Continuity reference",
      }))}
    />
  );
}

export function EpisodeAssetsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <ReferenceList
      title="Assets"
      items={episode.assetNames.map((asset) => ({
        id: asset,
        name: asset,
        subtitle: "Storyboard or production asset",
      }))}
    />
  );
}

export function EpisodeNotesPanel({
  episode,
  title,
  description,
}: {
  episode: Episode;
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <StudioDocumentEditor
      title={title}
      description={description}
      version={episode.version}
      markdown={episode.notes}
      saveStatus="saved"
      unsavedChanges={false}
      onChange={() => {}}
      onSave={() => {}}
      commentsLabel="episode notes"
    />
  );
}

export function EpisodeVersionHistoryPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <SimpleCard
      title="Version History"
      body={`Version ${episode.version} is the active revision placeholder for this episode.`}
    />
  );
}

export function EpisodeCommentsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return <StudioCommentPanel sectionLabel={`${episode.title} comments`} />;
}

export function EpisodeActivityPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <SimpleCard
      title="Activity"
      body={`Recent activity tracking is stubbed for ${episode.recentActivity.join(" · ")}.`}
    />
  );
}
