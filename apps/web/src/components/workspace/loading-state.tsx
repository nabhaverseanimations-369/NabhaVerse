import * as React from "react";

import { Card, CardContent, CardHeader, Skeleton } from "@nabhaverse/ui";

export function PanelSkeleton(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </CardContent>
    </Card>
  );
}
