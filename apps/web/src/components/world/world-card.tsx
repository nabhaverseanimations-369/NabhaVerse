import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nabhaverse/ui";

import { WorldAvatar } from "@/components/world/world-avatar";
import { WorldStatusBadge } from "@/components/world/world-status-badge";
import type { World } from "@/features/world/types/world.types";

interface WorldCardProps {
  world: World;
  href: string;
  onToggleFavorite: (worldId: string) => void;
}

export function WorldCard({ world, href, onToggleFavorite }: WorldCardProps): React.JSX.Element {
  return (
    <Card className="h-full overflow-hidden">
      <div
        role="img"
        aria-label={`${world.name} cover`}
        className="h-32 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${world.coverImageUrl ?? "https://picsum.photos/seed/world-cover/1280/720"})`,
        }}
      />
      <CardHeader className="gap-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={href}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          >
            <WorldAvatar name={world.name} coverImageUrl={world.coverImageUrl} size="lg" />
            <div>
              <CardTitle>{world.name}</CardTitle>
              <CardDescription>{world.studio}</CardDescription>
            </div>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={world.favorite ? "Remove favorite" : "Add favorite"}
            onClick={() => {
              onToggleFavorite(world.id);
            }}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={world.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <WorldStatusBadge status={world.status} />
        <p>{world.description}</p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Version:</span>{" "}
          {world.version}
        </p>
        <div className="flex flex-wrap gap-1">
          {world.tags.map((tag) => (
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
