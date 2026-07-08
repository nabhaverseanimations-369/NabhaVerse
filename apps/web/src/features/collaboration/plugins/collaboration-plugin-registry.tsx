import * as React from "react";
import {
  ActivitySquare,
  AtSign,
  Bell,
  BookText,
  CheckSquare,
  History,
  LayoutDashboard,
  MessageSquareMore,
  Paperclip,
  Settings,
} from "lucide-react";

import {
  createStudioDocumentPlugin,
  getStudioPluginOrThrow,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

import {
  ActivityFeedPanel,
  AssignmentsPanel,
  AttachmentsPanel,
  CollaborationOverviewPanel,
  CommentsPanel,
  DiscussionsPanel,
  HistoryPanel,
  MentionsPanel,
  NotificationsPanel,
  ReviewsPanel,
  SettingsPanel,
} from "@/components/collaboration/collaboration-plugin-panels";
import type {
  CollaborationPluginId,
  CollaborationWorkspace,
} from "@/features/collaboration/types/collaboration.types";

function buildCollaborationPlugin(
  metadata: Omit<
    StudioPluginDefinition<CollaborationWorkspace, CollaborationPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: CollaborationWorkspace }>,
): StudioPluginDefinition<CollaborationWorkspace, CollaborationPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["collaboration:read", "collaboration:write"],
    ["collaboration-summary", "workspace-state"],
    ["collaboration-studio"],
  );
}

export const collaborationPluginRegistry: readonly StudioPluginDefinition<
  CollaborationWorkspace,
  CollaborationPluginId
>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: LayoutDashboard,
    category: "overview",
    order: 0,
    route: "/collaboration/studio/:workspaceId/overview",
    component: ({ entity }) => <CollaborationOverviewPanel workspace={entity} />,
    permissions: ["collaboration:read"],
    validation: ["collaboration-summary", "workspace-state"],
    featureFlags: ["collaboration-studio"],
    description: "Shared collaboration overview",
  },
  buildCollaborationPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 10,
      route: "/collaboration/studio/:workspaceId/comments",
      description: "Comment queue and draft surface",
    },
    ({ entity }) => <CommentsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "mentions",
      title: "Mentions",
      icon: AtSign,
      category: "collaboration",
      order: 20,
      route: "/collaboration/studio/:workspaceId/mentions",
      description: "Mentions and directed feedback",
    },
    ({ entity }) => <MentionsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "assignments",
      title: "Assignments",
      icon: CheckSquare,
      category: "collaboration",
      order: 30,
      route: "/collaboration/studio/:workspaceId/assignments",
      description: "Assignment planning and workload placeholders",
    },
    ({ entity }) => <AssignmentsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "reviews",
      title: "Reviews",
      icon: BookText,
      category: "collaboration",
      order: 40,
      route: "/collaboration/studio/:workspaceId/reviews",
      description: "Review requests and approvals",
    },
    ({ entity }) => <ReviewsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "activity-feed",
      title: "Activity Feed",
      icon: ActivitySquare,
      category: "systems",
      order: 50,
      route: "/collaboration/studio/:workspaceId/activity-feed",
      description: "Cross-studio activity aggregation",
    },
    ({ entity }) => <ActivityFeedPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      category: "systems",
      order: 60,
      route: "/collaboration/studio/:workspaceId/notifications",
      description: "Mock notification architecture with no delivery mechanisms",
    },
    ({ entity }) => <NotificationsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "discussions",
      title: "Discussions",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 70,
      route: "/collaboration/studio/:workspaceId/discussions",
      description: "Discussion threads across studios",
    },
    ({ entity }) => <DiscussionsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "attachments",
      title: "Attachments",
      icon: Paperclip,
      category: "reference",
      order: 80,
      route: "/collaboration/studio/:workspaceId/attachments",
      description: "Shared attachment list placeholders",
    },
    ({ entity }) => <AttachmentsPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "history",
      title: "History",
      icon: History,
      category: "reference",
      order: 90,
      route: "/collaboration/studio/:workspaceId/history",
      description: "Historical collaboration events",
    },
    ({ entity }) => <HistoryPanel workspace={entity} />,
  ),
  buildCollaborationPlugin(
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      category: "systems",
      order: 100,
      route: "/collaboration/studio/:workspaceId/settings",
      description: "Collaboration workspace settings placeholder",
    },
    () => <SettingsPanel />,
  ),
] as const;

export function isCollaborationPluginId(value: string): value is CollaborationPluginId {
  return isStudioPluginId(value, collaborationPluginRegistry);
}

export function getCollaborationPlugin(
  id: CollaborationPluginId,
): StudioPluginDefinition<CollaborationWorkspace, CollaborationPluginId> {
  return getStudioPluginOrThrow(collaborationPluginRegistry, id, "collaboration");
}
