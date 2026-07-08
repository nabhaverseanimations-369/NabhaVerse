import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { EpisodeStatusBadge } from "@/components/episode/episode-status-badge";
import { mockCharacters } from "@/features/character/data/character-mocks";
import { mockWorlds } from "@/features/world/data/world-mocks";
import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeOverviewPanel({ episode }: { episode: Episode }): React.JSX.Element {
  const recentCharacters = mockCharacters.filter((character) =>
    episode.characterIds.includes(character.id),
  );
  const recentWorlds = mockWorlds.filter((world) => episode.worldIds.includes(world.id));

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              Episode {episode.episodeNumber}: {episode.title}
            </CardTitle>
            <EpisodeStatusBadge status={episode.status} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{episode.summary}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoBlock label="Season" value={`Season ${episode.season}`} />
          <InfoBlock label="Tags" value={episode.tags.join(", ")} />
          <InfoBlock label="Owner" value={episode.owner} />
          <InfoBlock label="Studio" value={episode.studio} />
          <InfoBlock label="Estimated Duration" value={episode.estimatedDuration} />
          <InfoBlock label="Version" value={episode.version} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {episode.recentActivity.map((item) => (
              <p key={item} className="rounded-md border border-[var(--color-border)] px-3 py-2">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Open Script
            </Button>
            <Button type="button" variant="outline">
              Open Scenes
            </Button>
            <Button type="button" variant="outline">
              Open Storyboard
            </Button>
            <Button type="button" variant="outline">
              Review References
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reference Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ReferenceBlock
            title="Characters"
            items={recentCharacters.map((character) => character.name)}
          />
          <ReferenceBlock title="Worlds" items={recentWorlds.map((world) => world.name)} />
          <ReferenceBlock title="Locations" items={episode.locationNames} />
          <ReferenceBlock title="Props" items={episode.propNames} />
          <ReferenceBlock title="Assets" items={episode.assetNames} />
        </CardContent>
      </Card>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

function ReferenceBlock({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </p>
      <div className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
