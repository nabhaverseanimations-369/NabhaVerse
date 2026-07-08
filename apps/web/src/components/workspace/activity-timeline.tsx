import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  when: string;
}

interface ActivityTimelineProps {
  title: string;
  items: ActivityItem[];
}

export function ActivityTimeline({ title, items }: ActivityTimelineProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{item.detail}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.when}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
