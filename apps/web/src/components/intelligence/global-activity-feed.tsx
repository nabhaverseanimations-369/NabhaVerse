import * as React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { IntelligenceActivityItem } from "@/features/intelligence";

export function GlobalActivityFeed({
  items,
}: {
  items: readonly IntelligenceActivityItem[];
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Activity</CardTitle>
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
                <p className="text-xs text-[var(--color-text-muted)]">
                  {item.actor} · {item.createdAt} · {item.studio}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-xs font-medium text-[var(--color-primary)]"
                  >
                    Open workspace
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
