import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { PublishingDashboard, PublishingLibrary } from "@/components/publishing";
import { mockPublications } from "@/features/publishing";

export default function PublishingStudioPage(): React.JSX.Element {
  const firstPublication = mockPublications[0];

  if (!firstPublication) {
    throw new Error("Expected at least one publishing workspace");
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Publishing Studio</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Provider-agnostic publishing orchestration workspace for releases, exports, scheduling,
            approvals, and distribution planning.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild type="button" variant="primary">
            <Link href={`/publishing/studio/${firstPublication.id}/overview`}>Open Workspace</Link>
          </Button>
        </CardContent>
      </Card>

      <PublishingDashboard />
      <PublishingLibrary initialLoading={false} />
    </section>
  );
}
