import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ProductionDashboard, ProductionLibrary } from "@/components/production";
import { mockProductions } from "@/features/production";

export default function ProductionStudioPage(): React.JSX.Element {
  const firstProduction = mockProductions[0];

  if (!firstProduction) {
    throw new Error("Expected at least one production mock");
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Production Studio</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Production planning and delivery workspace for tasks, milestones, reviews, dependencies,
            and reports.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild type="button" variant="primary">
            <Link href={`/production/studio/${firstProduction.id}/overview`}>Open Workspace</Link>
          </Button>
        </CardContent>
      </Card>

      <ProductionDashboard />
      <ProductionLibrary initialLoading={false} />
    </section>
  );
}
