import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ShotPipelineItem } from "@/features/production/types/production.types";

export function PipelineStage({ item }: { item: ShotPipelineItem }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.shotCode}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p className="font-medium text-[var(--color-text-primary)]">{item.title}</p>
        <p>Stage: {item.stage}</p>
        <p>Status: {item.status}</p>
        <p>Assignee: {item.assignee}</p>
        <p>Due: {item.dueDate}</p>
      </CardContent>
    </Card>
  );
}
