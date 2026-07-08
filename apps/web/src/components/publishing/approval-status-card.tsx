import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { PublishingRelease } from "@/features/publishing/types/publishing.types";

const approvalVariant = {
  pending: "warning",
  approved: "success",
  "changes-requested": "destructive",
} as const;

export function ApprovalStatusCard({ release }: { release: PublishingRelease }): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{release.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-primary)]">Approval:</span>
          <Badge variant={approvalVariant[release.approvalStatus]}>{release.approvalStatus}</Badge>
        </div>
        <p>Status: {release.status}</p>
        <p>Scheduled: {release.scheduledAt ?? "TBD"}</p>
      </CardContent>
    </Card>
  );
}
