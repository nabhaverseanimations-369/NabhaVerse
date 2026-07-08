import * as React from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import type { CollaborationComment } from "@/features/collaboration/types/collaboration.types";

const statusVariant = {
  open: "warning",
  resolved: "success",
  archived: "secondary",
} as const;

export function CommentCard({
  comment,
  selected = false,
  onSelect,
}: {
  comment: CollaborationComment;
  selected?: boolean;
  onSelect?: (commentId: string) => void;
}): React.JSX.Element {
  return (
    <Card className={selected ? "border-[var(--color-primary)]" : undefined}>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{comment.author}</CardTitle>
          <Badge variant={statusVariant[comment.status]}>{comment.status}</Badge>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">{comment.createdAt}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        <p>{comment.body}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {comment.mentions.map((mention) => (
            <span key={mention} className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1">
              {mention}
            </span>
          ))}
        </div>
        {onSelect ? (
          <button
            type="button"
            className="text-sm font-medium text-[var(--color-primary)]"
            onClick={() => onSelect(comment.id)}
          >
            {selected ? "Selected" : "Select comment"}
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}
