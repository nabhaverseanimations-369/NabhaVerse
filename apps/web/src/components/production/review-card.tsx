import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ProductionReview } from "@/features/production/types/production.types";

const variantByStatus = {
  pending: "warning",
  approved: "success",
  "changes-requested": "destructive",
} as const;

export function ReviewCard({ review }: { review: ProductionReview }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{review.title}</CardTitle>
          <Badge variant={variantByStatus[review.status]}>{review.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p>Owner: {review.owner}</p>
        <p>Due: {review.dueAt ?? "TBD"}</p>
      </CardContent>
    </Card>
  );
}
