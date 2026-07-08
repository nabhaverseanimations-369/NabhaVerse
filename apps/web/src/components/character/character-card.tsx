import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nabhaverse/ui";

import { CharacterAvatar } from "@/components/character/character-avatar";
import { CharacterStatusBadge } from "@/components/character/character-status-badge";
import type { Character } from "@/features/character/types/character.types";

interface CharacterCardProps {
  character: Character;
  href: string;
  onToggleFavorite: (characterId: string) => void;
}

export function CharacterCard({
  character,
  href,
  onToggleFavorite,
}: CharacterCardProps): React.JSX.Element {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={href}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          >
            <CharacterAvatar name={character.name} avatarUrl={character.avatarUrl} size="lg" />
            <div>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>{character.owner}</CardDescription>
            </div>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={character.favorite ? "Remove favorite" : "Add favorite"}
            onClick={() => {
              onToggleFavorite(character.id);
            }}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={character.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <CharacterStatusBadge status={character.status} />
        <p>{character.summary}</p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Version:</span>{" "}
          {character.version}
        </p>
        <div className="flex flex-wrap gap-1">
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
  );
}
