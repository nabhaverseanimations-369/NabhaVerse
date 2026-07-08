import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { DistributionTarget } from "@/features/publishing/types/publishing.types";

export function DistributionTargetCard({
  target,
}: {
  target: DistributionTarget;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{target.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p>Provider: {target.provider}</p>
        <p>Status: {target.status}</p>
        <p>Region: {target.region}</p>
        <p>Channel: {target.channel}</p>
      </CardContent>
    </Card>
  );
}
