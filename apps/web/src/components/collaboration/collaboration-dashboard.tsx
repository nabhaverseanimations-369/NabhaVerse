import * as React from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@nabhaverse/ui";

import { ActivityFeed } from "@/components/collaboration/activity-feed";
import { AssignmentCard } from "@/components/collaboration/assignment-card";
import { CommentCard } from "@/components/collaboration/comment-card";
import { MentionBadge } from "@/components/collaboration/mention-badge";
import { NotificationCard } from "@/components/collaboration/notification-card";
import { ReviewCard } from "@/components/collaboration/review-card";
import {
  collaborationDashboardState,
  summarizeNotifications,
  type CollaborationDashboardState,
} from "@/features/collaboration";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function CollaborationDashboard({
  state = collaborationDashboardState,
}: {
  state?: CollaborationDashboardState;
}): React.JSX.Element {
  const assignedToMe = state.workspaces.flatMap((workspace) => workspace.assignedToMe);
  const mentions = state.workspaces.flatMap((workspace) => workspace.mentions);
  const pendingReviews = state.workspaces.flatMap((workspace) => workspace.pendingReviews);
  const openComments = state.workspaces.flatMap((workspace) => workspace.openComments);
  const teamUpdates = state.workspaces.flatMap((workspace) => workspace.teamUpdates);
  const notifications = state.workspaces.flatMap((workspace) => workspace.notifications);
  const notificationSummary = summarizeNotifications(state);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Section title="Assigned To Me">
          {assignedToMe.slice(0, 2).map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </Section>
        <Section title="Mentions">
          <div className="flex flex-wrap gap-2">
            {mentions.slice(0, 4).map((mention) => (
              <MentionBadge key={mention.id} mention={mention} />
            ))}
          </div>
        </Section>
        <Section title="Pending Reviews">
          {pendingReviews.slice(0, 2).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Section>
        <Section title="Notification Summary">
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {notificationSummary.unread}/{notificationSummary.total}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Unread notifications in the mock queue.
          </p>
        </Section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <ActivityFeed title="Recent Activity" items={state.activityFeed} />
        <Section title="Quick Actions">
          <Button type="button" variant="outline">
            Open assignments
          </Button>
          <Button type="button" variant="outline">
            Review mentions
          </Button>
          <Button type="button" variant="outline">
            Triage notifications
          </Button>
          <Button type="button" variant="outline">
            Open discussions
          </Button>
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Section title="Open Comments">
          {openComments.slice(0, 2).map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </Section>
        <Section title="Team Updates">
          {teamUpdates.slice(0, 4).map((update) => (
            <p
              key={update}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              {update}
            </p>
          ))}
        </Section>
        <Section title="Notifications">
          {notifications.slice(0, 2).map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </Section>
      </div>
    </section>
  );
}
