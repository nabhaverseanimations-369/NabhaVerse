import * as React from "react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { IntelligenceQuickAction } from "@/features/intelligence";

export function QuickActionCard({
  action,
}: {
  action: IntelligenceQuickAction;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{action.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <p>{action.description}</p>
        <Button asChild type="button" variant="outline" size="sm">
          <Link href={action.href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
