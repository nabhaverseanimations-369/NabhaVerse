import * as React from "react";

import { Avatar, AvatarFallback } from "@nabhaverse/ui";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewerAvatarGroup({
  reviewers,
}: {
  reviewers: readonly string[];
}): React.JSX.Element {
  return (
    <div className="flex -space-x-2">
      {reviewers.map((reviewer) => (
        <Avatar key={reviewer} className="h-8 w-8 border border-[var(--color-border)]">
          <AvatarFallback>{initials(reviewer)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
