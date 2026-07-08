import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ReviewerAvatarGroup } from "@/components/collaboration/reviewer-avatar-group";
import type { CollaborationReview } from "@/features/collaboration/types/collaboration.types";

const statusVariant = {
  pending: "warning",
  approved: "success",
  "changes-requested": "destructive",
} as const;

export function ReviewCard({ review }: { review: CollaborationReview }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{review.title}</CardTitle>
          <Badge variant={statusVariant[review.status]}>{review.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <p>Due: {review.dueAt ?? "No due date"}</p>
        <ReviewerAvatarGroup reviewers={review.reviewerNames} />
      </CardContent>
    </Card>
  );
}
