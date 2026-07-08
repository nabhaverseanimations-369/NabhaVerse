import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { CollaborationNotification } from "@/features/collaboration/types/collaboration.types";

const typeVariant = {
  mention: "warning",
  assignment: "outline",
  "review-request": "warning",
  approval: "success",
  comment: "secondary",
  system: "outline",
} as const;

export function NotificationCard({
  notification,
}: {
  notification: CollaborationNotification;
}): React.JSX.Element {
  return (
    <Card className={!notification.read ? "border-[var(--color-primary)]" : undefined}>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{notification.title}</CardTitle>
          <Badge variant={typeVariant[notification.type]}>{notification.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--color-text-secondary)]">
        <p>{notification.message}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{notification.createdAt}</p>
      </CardContent>
    </Card>
  );
}
