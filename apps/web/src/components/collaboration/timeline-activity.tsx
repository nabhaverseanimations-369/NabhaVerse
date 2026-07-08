import * as React from "react";

import type { CollaborationActivityItem } from "@/features/collaboration/types/collaboration.types";

export function TimelineActivity({ item }: { item: CollaborationActivityItem }): React.JSX.Element {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.title}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{item.detail}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {item.actor} · {item.createdAt} · {item.studio}
        </p>
      </div>
    </li>
  );
}
