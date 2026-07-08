import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";
import { StudioCommentPanel, StudioDocumentEditor } from "@nabhaverse/studio-sdk";

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
  const cast = episode.characters.map((character) => ({
    id: character.id,
    name: character.name,
    subtitle: character.description,
  }));

  return <ReferenceList title="Character Cast" items={cast} />;
}

export function EpisodeLocationsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  const locations = episode.locations.map((location) => ({
    id: location.id,
    name: location.name,
    subtitle: location.description,
  }));

  return <ReferenceList title="Locations" items={locations} />;
}

export function EpisodePropsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <ReferenceList
      title="Props"
      items={episode.props.map((prop) => ({
        id: prop.id,
        name: prop.name,
        subtitle: prop.description,
      }))}
    />
  );
}

export function EpisodeAssetsPanel({ episode }: { episode: Episode }): React.JSX.Element {
  return (
    <ReferenceList
      title="Assets"
      items={episode.assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        subtitle: asset.description,
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
