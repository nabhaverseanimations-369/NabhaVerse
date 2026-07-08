import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
}

const trendVariantMap = {
  up: "primary",
  down: "destructive",
  neutral: "secondary",
} as const;

export function StatCard({ label, value, delta, trend }: StatCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-semibold text-[var(--color-text-primary)]">{value}</p>
        <Badge variant={trendVariantMap[trend]}>{delta}</Badge>
      </CardContent>
    </Card>
  );
}
