import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { CollaborationAssignment } from "@/features/collaboration/types/collaboration.types";

const priorityVariant = {
  low: "secondary",
  medium: "outline",
  high: "warning",
  critical: "destructive",
} as const;

export function AssignmentCard({
  assignment,
}: {
  assignment: CollaborationAssignment;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{assignment.title}</CardTitle>
          <Badge variant={priorityVariant[assignment.priority]}>{assignment.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p>Assignee: {assignment.assignee}</p>
        <p>Status: {assignment.status}</p>
        <p>Due: {assignment.dueAt ?? "No due date"}</p>
      </CardContent>
    </Card>
  );
}
