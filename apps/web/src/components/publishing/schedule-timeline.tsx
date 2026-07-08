import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { PublishingRelease } from "@/features/publishing/types/publishing.types";

export function ScheduleTimeline({
  releases,
}: {
  releases: readonly PublishingRelease[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {releases.map((release) => (
          <div
            key={release.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{release.name}</p>
            <p className="text-[var(--color-text-secondary)]">{release.scheduledAt ?? "TBD"}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{release.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
