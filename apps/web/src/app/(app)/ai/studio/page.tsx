import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { AIDashboard } from "@/components/ai";
import { mockAIWorkspace } from "@/features/ai";

export default function AIStudioPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>AI Studio</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Provider-agnostic orchestration workspace for prompts, models, jobs, outputs, and linked
            assets.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild type="button" variant="primary">
            <Link href={`/ai/studio/${mockAIWorkspace.id}/overview`}>Open Workspace</Link>
          </Button>
        </CardContent>
      </Card>

      <AIDashboard workspace={mockAIWorkspace} />
    </section>
  );
}
