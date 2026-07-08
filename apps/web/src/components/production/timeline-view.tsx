import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ProductionMilestone } from "@/features/production/types/production.types";

export function TimelineView({
  milestones,
}: {
  milestones: readonly ProductionMilestone[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{milestone.title}</p>
            <p>{milestone.targetDate}</p>
            <p>
              {milestone.completion}% complete · {milestone.status}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
