import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ProductionMilestone } from "@/features/production/types/production.types";

export function MilestoneCard({
  milestone,
}: {
  milestone: ProductionMilestone;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{milestone.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p>Owner: {milestone.owner}</p>
        <p>Target: {milestone.targetDate}</p>
        <p>Completion: {milestone.completion}%</p>
        <p>Status: {milestone.status}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{milestone.notes}</p>
      </CardContent>
    </Card>
  );
}
