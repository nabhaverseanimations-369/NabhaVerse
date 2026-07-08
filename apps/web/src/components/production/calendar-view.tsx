import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ProductionMilestone } from "@/features/production/types/production.types";

export function CalendarView({
  milestones,
}: {
  milestones: readonly ProductionMilestone[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{milestone.targetDate}</p>
            <p>{milestone.title}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{milestone.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
