import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { EpisodeStatusBadge } from "@/components/episode/episode-status-badge";
import type { Episode } from "@/features/episode/types/episode.types";

export function EpisodeCard({
  episode,
  href,
  onToggleFavorite,
}: {
  episode: Episode;
  href: string;
  onToggleFavorite: (id: string) => void;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>
              <Link href={href} className="hover:underline">
                Episode {episode.episodeNumber}: {episode.title}
              </Link>
            </CardTitle>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Season {episode.season} · {episode.estimatedDuration}
            </p>
          </div>
          <EpisodeStatusBadge status={episode.status} />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{episode.summary}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {episode.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Owner {episode.owner} · Studio {episode.studio} · Updated {episode.updatedAt}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFavorite(episode.id)}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />{" "}
            {episode.favorite ? "Unfavorite" : "Favorite"}
          </Button>
          <Button type="button" size="sm" variant="ghost" asChild>
            <Link href={href}>Open workspace</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
