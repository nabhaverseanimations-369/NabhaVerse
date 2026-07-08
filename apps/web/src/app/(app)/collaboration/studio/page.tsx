import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { CollaborationDashboard } from "@/components/collaboration";
import { mockCollaborationWorkspaces } from "@/features/collaboration";

export default function CollaborationStudioPage(): React.JSX.Element {
  const firstWorkspace = mockCollaborationWorkspaces[0];

  if (!firstWorkspace) {
    throw new Error("Expected at least one collaboration workspace");
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Collaboration Studio</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Shared communication, review, assignment, and activity architecture across every studio.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild type="button" variant="primary">
            <Link href={`/collaboration/studio/${firstWorkspace.id}/overview`}>Open Workspace</Link>
          </Button>
        </CardContent>
      </Card>

      <CollaborationDashboard />
    </section>
  );
}
