import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import {
  ProductionHealthBadge,
  ProductionPriorityBadge,
  ProductionStatusBadge,
} from "@/components/production/production-status-badge";
import type { Production } from "@/features/production/types/production.types";

export function ProductionCard({
  production,
  href,
  onToggleFavorite,
}: {
  production: Production;
  href: string;
  onToggleFavorite: (productionId: string) => void;
}): React.JSX.Element {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>
            <Link href={href} className="hover:underline">
              {production.name}
            </Link>
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={production.favorite ? "Unfavorite production" : "Favorite production"}
            onClick={() => onToggleFavorite(production.id)}
          >
            <Star
              className="h-4 w-4"
              aria-hidden="true"
              fill={production.favorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{production.description}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <div className="flex flex-wrap gap-2">
          <ProductionStatusBadge status={production.status} />
          <ProductionPriorityBadge priority={production.priority} />
          <ProductionHealthBadge health={production.health} />
        </div>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Owner:</span>{" "}
          {production.owner}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Studio:</span>{" "}
          {production.studio}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Completion:</span>{" "}
          {production.completion}%
        </p>
        <div className="flex flex-wrap gap-1">
          {production.tags.map((tag) => (
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
