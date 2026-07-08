import type {
  CollaborationActivityItem,
  CollaborationDashboardState,
  CollaborationWorkspace,
} from "@/features/collaboration/types/collaboration.types";

const activityTypeOrder: Record<CollaborationActivityItem["type"], number> = {
  review: 0,
  assignment: 1,
  mention: 2,
  comment: 3,
  notification: 4,
  discussion: 5,
  system: 6,
};

export function aggregateWorkspaceActivity(
  workspaces: readonly CollaborationWorkspace[],
): CollaborationActivityItem[] {
  return workspaces
    .flatMap((workspace) => workspace.recentActivity)
    .sort((left, right) => {
      const typeDiff = activityTypeOrder[left.type] - activityTypeOrder[right.type];
      if (typeDiff !== 0) {
        return typeDiff;
      }

      return left.createdAt.localeCompare(right.createdAt);
    });
}

export function summarizeNotifications(state: CollaborationDashboardState): {
  unread: number;
  total: number;
} {
  const notifications = state.workspaces.flatMap((workspace) => workspace.notifications);
  const unread = notifications.filter((notification) => !notification.read).length;
  return { unread, total: notifications.length };
}
