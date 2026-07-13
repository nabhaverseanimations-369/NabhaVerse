import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { PlatformHealthMetric } from "@/features/intelligence";

const statusVariant = {
  healthy: "success",
  watch: "warning",
  "at-risk": "destructive",
} as const;

export function PlatformHealthCard({
  metric,
}: {
  metric: PlatformHealthMetric;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{metric.title}</CardTitle>
          <Badge variant={statusVariant[metric.status]}>{metric.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{metric.summary}</p>
      </CardContent>
    </Card>
  );
}
