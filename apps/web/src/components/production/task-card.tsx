import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ProductionPriorityBadge } from "@/components/production/production-status-badge";
import type { ProductionTask } from "@/features/production/types/production.types";

export function TaskCard({ task }: { task: ProductionTask }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--color-border)] px-2 py-1 text-xs">
            {task.status}
          </span>
          <ProductionPriorityBadge priority={task.priority} />
        </div>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Assignee:</span>{" "}
          {task.assignee}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Due:</span> {task.dueDate}
        </p>
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Dependencies:</span>{" "}
          {task.dependencies.length === 0 ? "None" : task.dependencies.join(", ")}
        </p>
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs"
            >
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
