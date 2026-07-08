import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { CommentCard } from "@/components/collaboration/comment-card";
import type {
  CollaborationComment,
  CollaborationDiscussion,
} from "@/features/collaboration/types/collaboration.types";

export function DiscussionThread({
  discussion,
  comments,
  selectedCommentId,
  onSelectComment,
}: {
  discussion: CollaborationDiscussion;
  comments: readonly CollaborationComment[];
  selectedCommentId?: string | null;
  onSelectComment?: (commentId: string) => void;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{discussion.title}</CardTitle>
        <p className="text-sm text-[var(--color-text-secondary)]">{discussion.summary}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
          {discussion.participantNames.map((participant) => (
            <span
              key={participant}
              className="rounded-full bg-[var(--color-surface-muted)] px-2 py-1"
            >
              {participant}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              selected={selectedCommentId === comment.id}
              {...(onSelectComment ? { onSelect: onSelectComment } : {})}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
