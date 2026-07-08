import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { TimelineActivity } from "@/components/collaboration/timeline-activity";
import type { CollaborationActivityItem } from "@/features/collaboration/types/collaboration.types";

export function ActivityFeed({
  title,
  items,
}: {
  title: string;
  items: readonly CollaborationActivityItem[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {items.map((item) => (
            <TimelineActivity key={item.id} item={item} />
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
