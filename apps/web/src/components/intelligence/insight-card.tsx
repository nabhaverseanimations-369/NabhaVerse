import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { IntelligenceInsight } from "@/features/intelligence";

const severityVariant = {
  info: "secondary",
  watch: "warning",
  critical: "destructive",
} as const;

export function InsightCard({ insight }: { insight: IntelligenceInsight }): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{insight.title}</CardTitle>
          <Badge variant={severityVariant[insight.severity]}>{insight.severity}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <p>{insight.summary}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{insight.detail}</p>
      </CardContent>
    </Card>
  );
}
