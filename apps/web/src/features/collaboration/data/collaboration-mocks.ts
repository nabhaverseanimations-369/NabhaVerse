import type {
  CollaborationActivityItem,
  CollaborationAssignment,
  CollaborationComment,
  CollaborationDashboardState,
  CollaborationDiscussion,
  CollaborationMention,
  CollaborationNotification,
  CollaborationWorkspace,
} from "@/features/collaboration/types/collaboration.types";

const linkedCharacter = {
  id: "char_lunara",
  name: "Lunara",
  description: "Lead protagonist silhouette and expression pack.",
} as const;

const linkedEpisode = {
  id: "ep_012",
  name: "Episode 12",
  description: "Season finale delivery planning.",
  season: 1,
  episodeNumber: 12,
} as const;

const linkedAsset = {
  id: "asset_keyart_12",
  name: "Episode 12 Key Art",
  description: "Primary launch visual for distribution surfaces.",
  kind: "image",
} as const;

const linkedPublication = {
  id: "pub_lunara_s1e12",
  name: "Lunara Episode 12",
  status: "scheduled",
  releaseType: "episode",
} as const;

const assignments: readonly CollaborationAssignment[] = [
  {
    id: "assign_review_keyart",
    title: "Review episode key art annotations",
    assignee: "Aarya Patel",
    dueAt: "2026-07-10T16:00:00Z",
    status: "in-review",
    priority: "high",
    workspaceId: "collab_launch_readiness",
    linkedTo: linkedAsset,
  },
  {
    id: "assign_finalize_notes",
    title: "Finalize release note approvals",
    assignee: "Leena Roy",
    dueAt: "2026-07-11T10:00:00Z",
    status: "todo",
    priority: "medium",
    workspaceId: "collab_publish_rollout",
    linkedTo: linkedPublication,
  },
];

const comments: readonly CollaborationComment[] = [
  {
    id: "comment_timing_01",
    author: "Ravi Khanna",
    createdAt: "12m ago",
    status: "open",
    body: "Timing note: keep the reveal beat aligned with the approval window placeholder.",
    workspaceId: "collab_launch_readiness",
    mentions: ["@Aarya", "@Leena"],
    linkedTo: linkedEpisode,
  },
  {
    id: "comment_lighting_02",
    author: "Mina Das",
    createdAt: "45m ago",
    status: "resolved",
    body: "Updated the fallback crop notes to match the current asset package.",
    workspaceId: "collab_launch_readiness",
    mentions: ["@Ravi"],
    linkedTo: linkedAsset,
  },
];

const mentions: readonly CollaborationMention[] = [
  {
    id: "mention_01",
    subject: "Episode 12 launch thread",
    createdAt: "8m ago",
    status: "unread",
    author: "Aarya Patel",
    preview: "Please confirm the review handoff before tomorrow's placeholder publish window.",
    workspaceId: "collab_launch_readiness",
    linkedTo: linkedEpisode,
  },
  {
    id: "mention_02",
    subject: "Publishing checklist",
    createdAt: "1h ago",
    status: "read",
    author: "Leena Roy",
    preview: "Need a final pass on release notes consistency across the launch kit.",
    workspaceId: "collab_publish_rollout",
    linkedTo: linkedPublication,
  },
];

const notifications: readonly CollaborationNotification[] = [
  {
    id: "notify_01",
    title: "Review requested",
    createdAt: "5m ago",
    type: "review-request",
    read: false,
    message: "Episode 12 key art review needs acknowledgement.",
    workspaceId: "collab_launch_readiness",
  },
  {
    id: "notify_02",
    title: "Mention from publishing",
    createdAt: "39m ago",
    type: "mention",
    read: false,
    message: "Release notes discussion referenced your approval checklist.",
    workspaceId: "collab_publish_rollout",
  },
  {
    id: "notify_03",
    title: "System digest",
    createdAt: "2h ago",
    type: "system",
    read: true,
    message: "Mock activity summary was refreshed across all studios.",
    workspaceId: "collab_global_ops",
  },
];

const discussions: readonly CollaborationDiscussion[] = [
  {
    id: "discussion_launch_readiness",
    title: "Launch readiness alignment",
    createdAt: "2026-07-08T08:30:00Z",
    status: "active",
    owner: "Aarya Patel",
    summary: "Cross-studio thread tracking review, notes, and approval handoff before release.",
    participantNames: ["Aarya Patel", "Leena Roy", "Ravi Khanna", "Mina Das"],
    commentIds: comments.map((comment) => comment.id),
  },
  {
    id: "discussion_docs_sync",
    title: "Documentation sync",
    createdAt: "2026-07-07T18:00:00Z",
    status: "paused",
    owner: "Leena Roy",
    summary: "Shared notes on how placeholders should remain provider-agnostic in UI copy.",
    participantNames: ["Leena Roy", "Aarya Patel"],
    commentIds: [comments[1]?.id ?? "comment_lighting_02"],
  },
];

const activityFeed: readonly CollaborationActivityItem[] = [
  {
    id: "activity_01",
    type: "review",
    title: "Review requested on Episode 12 key art",
    detail: "Asset Studio delivery entered the shared collaboration queue.",
    actor: "Aarya Patel",
    createdAt: "5m ago",
    studio: "asset",
    workspaceId: "collab_launch_readiness",
    linkedTo: linkedAsset,
  },
  {
    id: "activity_02",
    type: "comment",
    title: "New comment in launch readiness thread",
    detail: "Timing note added to the delivery handoff discussion.",
    actor: "Ravi Khanna",
    createdAt: "12m ago",
    studio: "episode",
    workspaceId: "collab_launch_readiness",
    linkedTo: linkedEpisode,
  },
  {
    id: "activity_03",
    type: "assignment",
    title: "Assignment created for release notes approvals",
    detail: "Publishing Studio review pass added to the mock queue.",
    actor: "Leena Roy",
    createdAt: "35m ago",
    studio: "publishing",
    workspaceId: "collab_publish_rollout",
    linkedTo: linkedPublication,
  },
  {
    id: "activity_04",
    type: "mention",
    title: "Mention from Character Studio",
    detail: "Expression pack decision referenced in the launch thread.",
    actor: "Mina Das",
    createdAt: "1h ago",
    studio: "character",
    workspaceId: "collab_global_ops",
    linkedTo: linkedCharacter,
  },
  {
    id: "activity_05",
    type: "system",
    title: "Notification summary refreshed",
    detail: "Mock notification digest regenerated for dashboard consumption.",
    actor: "System",
    createdAt: "2h ago",
    studio: "cross-studio",
    workspaceId: "collab_global_ops",
  },
];

export const mockCollaborationWorkspaces: readonly CollaborationWorkspace[] = [
  {
    id: "collab_launch_readiness",
    name: "Launch Readiness",
    kind: "cross-studio",
    summary: "Shared coordination for episode delivery, review, and publishing readiness.",
    owner: "Aarya Patel",
    team: ["Aarya Patel", "Leena Roy", "Ravi Khanna", "Mina Das"],
    assignedToMe: assignments.slice(0, 1),
    mentions: mentions.slice(0, 1),
    pendingReviews: [
      {
        id: "review_launch_01",
        title: "Episode 12 key art review",
        status: "pending",
        dueAt: "2026-07-10T16:00:00Z",
        reviewerNames: ["Aarya Patel", "Mina Das", "Ravi Khanna"],
        workspaceId: "collab_launch_readiness",
        linkedTo: linkedAsset,
      },
    ],
    openComments: comments,
    recentActivity: activityFeed.slice(0, 3),
    teamUpdates: [
      "Asset Studio approved fallback crop guidance.",
      "Publishing notes copy aligned with placeholder launch messaging.",
    ],
    notifications: notifications.slice(0, 2),
    discussions,
    attachments: ["Launch checklist v3", "Review handoff notes", "Approval matrix placeholder"],
    history: activityFeed,
  },
  {
    id: "collab_publish_rollout",
    name: "Publishing Rollout",
    kind: "publishing",
    summary:
      "Cross-functional review board for release notes, approvals, and notification planning.",
    owner: "Leena Roy",
    team: ["Leena Roy", "Aarya Patel", "Ravi Khanna"],
    assignedToMe: assignments.slice(1),
    mentions: mentions.slice(1),
    pendingReviews: [
      {
        id: "review_publish_01",
        title: "Release notes consistency pass",
        status: "approved",
        dueAt: "2026-07-11T10:00:00Z",
        reviewerNames: ["Leena Roy", "Aarya Patel"],
        workspaceId: "collab_publish_rollout",
        linkedTo: linkedPublication,
      },
    ],
    openComments: comments.slice(0, 1),
    recentActivity: activityFeed.slice(2),
    teamUpdates: [
      "Approval placeholder rules remain provider-agnostic.",
      "Notification summary grouped by mock delivery type.",
    ],
    notifications,
    discussions: discussions.slice(1),
    attachments: ["Release note draft", "Partner briefing placeholder"],
    history: activityFeed.slice(1),
  },
];

export const mockGlobalActivityFeed: readonly CollaborationActivityItem[] = activityFeed;

export const collaborationDashboardState: CollaborationDashboardState = {
  workspaces: mockCollaborationWorkspaces,
  activityFeed: mockGlobalActivityFeed,
};
