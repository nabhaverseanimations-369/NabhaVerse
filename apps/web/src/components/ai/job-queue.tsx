import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { AIJob } from "@/features/ai/types/ai.types";

const statusVariant: Record<
  AIJob["status"],
  "secondary" | "warning" | "success" | "destructive" | "outline"
> = {
  pending: "secondary",
  running: "warning",
  completed: "success",
  failed: "destructive",
  cancelled: "outline",
};

export function JobQueue({ jobs }: { jobs: readonly AIJob[] }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-md border border-[var(--color-border)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{job.name}</p>
              <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Created {job.createdAt}</p>
            <div
              className="mt-3 h-2 rounded-full bg-[var(--color-surface-muted)]"
              aria-label={`${job.name} progress`}
            >
              <div
                className="h-2 rounded-full bg-[var(--color-primary)] transition-[width]"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
              <span>{job.progress}% complete</span>
              <span>{job.outputs} outputs</span>
            </div>
            {job.errorSummary ? (
              <p className="mt-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-[var(--color-text-secondary)]">
                {job.errorSummary}
              </p>
            ) : null}
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
