import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ProductionHealthBadge } from "@/components/production/production-status-badge";
import type { Production } from "@/features/production/types/production.types";

export function ProductionHealthPanel({
  production,
}: {
  production: Production;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-primary)]">Health:</span>
          <ProductionHealthBadge health={production.health} />
        </div>
        <p>Pending reviews: {production.pendingReviews}</p>
        <p>Blockers: {production.blockers}</p>
        <p>Sprint progress: {production.sprintProgress}</p>
        <p>Team workload: {production.teamWorkload}</p>
      </CardContent>
    </Card>
  );
}
