import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { ProductionTask } from "@/features/production/types/production.types";

export function DependencyGraph({
  tasks,
}: {
  tasks: readonly ProductionTask[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependency Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-md border border-[var(--color-border)] p-3">
            <p className="font-medium text-[var(--color-text-primary)]">{task.title}</p>
            <p>
              Depends on: {task.dependencies.length === 0 ? "none" : task.dependencies.join(", ")}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
