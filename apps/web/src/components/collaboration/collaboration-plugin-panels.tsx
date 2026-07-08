import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@nabhaverse/ui";

import { ActivityFeed } from "@/components/collaboration/activity-feed";
import { AssignmentCard } from "@/components/collaboration/assignment-card";
import { CommentCard } from "@/components/collaboration/comment-card";
import { DiscussionThread } from "@/components/collaboration/discussion-thread";
import { MentionBadge } from "@/components/collaboration/mention-badge";
import { NotificationCard } from "@/components/collaboration/notification-card";
import { ReviewCard } from "@/components/collaboration/review-card";
import { useCollaborationWorkspaceState } from "@/features/collaboration/state/collaboration-workspace-state";
import type { CollaborationWorkspace } from "@/features/collaboration/types/collaboration.types";

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

export function CollaborationOverviewPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{workspace.name}</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">{workspace.summary}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Info label="Owner" value={workspace.owner} />
          <Info label="Workspace Kind" value={workspace.kind} />
          <Info label="Open Comments" value={`${workspace.openComments.length}`} />
          <Info label="Notifications" value={`${workspace.notifications.length}`} />
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ActivityFeed title="Recent Activity" items={workspace.recentActivity} />
        <Card>
          <CardHeader>
            <CardTitle>Team Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {workspace.teamUpdates.map((update) => (
              <p key={update} className="rounded-md border border-[var(--color-border)] px-3 py-2">
                {update}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function CommentsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  const { state, dispatch } = useCollaborationWorkspaceState();

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Draft Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            label="Comment draft"
            value={state.draftComment}
            onChange={(event) =>
              dispatch({ type: "update-draft-comment", draftComment: event.currentTarget.value })
            }
            placeholder="Add a collaboration note placeholder"
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch({ type: "mark-saved" })}
            >
              Mark draft saved
            </Button>
            <p className="text-xs text-[var(--color-text-muted)]">
              {state.unsavedChanges ? "Unsaved changes" : "No unsaved changes"}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {workspace.openComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            selected={state.selectedCommentId === comment.id}
            onSelect={(commentId) => dispatch({ type: "set-selected-comment", commentId })}
          />
        ))}
      </div>
    </section>
  );
}

export function MentionsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {workspace.mentions.map((mention) => (
            <MentionBadge key={mention.id} mention={mention} />
          ))}
        </div>
        {workspace.mentions.map((mention) => (
          <div
            key={mention.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{mention.author}</p>
            <p className="text-[var(--color-text-secondary)]">{mention.preview}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{mention.createdAt}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AssignmentsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workspace.assignedToMe.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </section>
  );
}

export function ReviewsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workspace.pendingReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </section>
  );
}

export function ActivityFeedPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return <ActivityFeed title="Shared Activity Feed" items={workspace.recentActivity} />;
}

export function NotificationsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workspace.notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </section>
  );
}

export function DiscussionsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  const { state, dispatch } = useCollaborationWorkspaceState();

  return (
    <section className="space-y-4">
      {workspace.discussions.map((discussion) => (
        <DiscussionThread
          key={discussion.id}
          discussion={discussion}
          comments={workspace.openComments.filter((comment) =>
            discussion.commentIds.includes(comment.id),
          )}
          selectedCommentId={state.selectedCommentId}
          onSelectComment={(commentId) => {
            dispatch({ type: "set-selected-discussion", discussionId: discussion.id });
            dispatch({ type: "set-selected-comment", commentId });
          }}
        />
      ))}
    </section>
  );
}

export function AttachmentsPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {workspace.attachments.map((attachment) => (
          <p key={attachment} className="rounded-md border border-[var(--color-border)] px-3 py-2">
            {attachment}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function HistoryPanel({
  workspace,
}: {
  workspace: CollaborationWorkspace;
}): React.JSX.Element {
  return <ActivityFeed title="Workspace History" items={workspace.history} />;
}

export function SettingsPanel(): React.JSX.Element {
  return (
    <PlaceholderCard
      title="Settings"
      description="Collaboration settings architecture is available; runtime rules remain future work."
    />
  );
}
