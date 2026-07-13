import * as React from "react";
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { IntelligenceRecommendation } from "@/features/intelligence";

const priorityVariant = {
  low: "secondary",
  medium: "outline",
  high: "warning",
} as const;

export function RecommendationCard({
  recommendation,
}: {
  recommendation: IntelligenceRecommendation;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{recommendation.title}</CardTitle>
          <Badge variant={priorityVariant[recommendation.priority]}>
            {recommendation.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <p>{recommendation.summary}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{recommendation.reason}</p>
        {recommendation.href ? (
          <Button asChild type="button" variant="outline" size="sm">
            <Link href={recommendation.href}>Open</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
