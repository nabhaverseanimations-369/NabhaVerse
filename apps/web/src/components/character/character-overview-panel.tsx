import * as React from "react";
import { Bolt, Clock3, FolderOpenDot, History, PenSquare } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { CharacterAvatar } from "@/components/character/character-avatar";
import { CharacterStatusBadge } from "@/components/character/character-status-badge";
import type { Character } from "@/features/character/types/character.types";

export function CharacterOverviewPanel({ character }: { character: Character }): React.JSX.Element {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <CharacterAvatar name={character.name} avatarUrl={character.avatarUrl} size="lg" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {character.name}
              </h2>
              <CharacterStatusBadge status={character.status} />
              <p className="text-sm text-[var(--color-text-secondary)]">{character.summary}</p>
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-text-muted)]">Owner</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{character.owner}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Studio</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{character.studio}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Version</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">{character.version}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-muted)]">Last Updated</dt>
              <dd className="font-medium text-[var(--color-text-primary)]">
                {character.updatedAt}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-[var(--color-text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button type="button" variant="outline" className="w-full justify-start">
            <PenSquare className="h-4 w-4" aria-hidden="true" /> Edit Character Bible
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start">
            <FolderOpenDot className="h-4 w-4" aria-hidden="true" /> Open Assets
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start">
            <History className="h-4 w-4" aria-hidden="true" /> Review Versions
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start">
            <Bolt className="h-4 w-4" aria-hidden="true" /> Start Review Round
          </Button>
          <p className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Last opened{" "}
            {character.recentlyOpenedAt ?? "recently"}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
