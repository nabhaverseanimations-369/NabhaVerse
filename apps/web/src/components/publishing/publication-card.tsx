import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import {
  PublishingStatusBadge,
  ReleaseTypeBadge,
} from "@/components/publishing/publishing-status-badge";
import type { Publication } from "@/features/publishing/types/publishing.types";

export function PublicationCard({
  publication,
  href,
  onToggleFavorite,
}: {
  publication: Publication;
  href: string;
  onToggleFavorite: (publicationId: string) => void;
}): React.JSX.Element {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>
            <Link href={href} className="hover:underline">
              {publication.name}
            </Link>
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={publication.favorite ? "Unfavorite publication" : "Favorite publication"}
            onClick={() => onToggleFavorite(publication.id)}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={publication.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{publication.description}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <div className="flex flex-wrap gap-2">
          <PublishingStatusBadge status={publication.status} />
          <ReleaseTypeBadge type={publication.releaseType} />
        </div>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Owner:</span>{" "}
          {publication.owner}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Scheduled:</span>{" "}
          {publication.scheduledAt ?? "Not scheduled"}
        </p>
        <div className="flex flex-wrap gap-1">
          {publication.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
