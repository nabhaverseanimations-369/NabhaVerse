import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { Publication } from "@/features/publishing/types/publishing.types";

export function ReleaseHealthPanel({
  publication,
}: {
  publication: Publication;
}): React.JSX.Element {
  const failed = publication.releases.filter((release) => release.status === "failed").length;
  const scheduled = publication.releases.filter((release) => release.status === "scheduled").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Release Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Health:</span>{" "}
          {publication.health}
        </p>
        <p>Scheduled releases: {scheduled}</p>
        <p>Failed publications (placeholder): {failed}</p>
        <p>Distribution health (placeholder): {publication.health}</p>
      </CardContent>
    </Card>
  );
}
