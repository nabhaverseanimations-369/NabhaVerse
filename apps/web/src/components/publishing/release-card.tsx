import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import {
  PublishingStatusBadge,
  ReleaseTypeBadge,
} from "@/components/publishing/publishing-status-badge";
import type { PublishingRelease } from "@/features/publishing/types/publishing.types";

export function ReleaseCard({ release }: { release: PublishingRelease }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{release.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex flex-wrap gap-2">
          <PublishingStatusBadge status={release.status} />
          <ReleaseTypeBadge type={release.releaseType} />
        </div>
        <p>Scheduled: {release.scheduledAt ?? "TBD"}</p>
        <p>Approval: {release.approvalStatus}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{release.notes}</p>
      </CardContent>
    </Card>
  );
}
