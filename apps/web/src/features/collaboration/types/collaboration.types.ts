import type {
  AIJobReference,
  AssignmentReference,
  AssetReference,
  CharacterReference,
  CommentReference,
  DiscussionReference,
  EpisodeReference,
  MentionReference,
  ModelReference,
  NotificationReference,
  ProductionTaskReference,
  PromptReference,
  PublicationReference,
  ReviewReference,
  WorldReference,
} from "@nabhaverse/studio-sdk";

export type CollaborationPluginId =
  | "overview"
  | "comments"
  | "mentions"
  | "assignments"
  | "reviews"
  | "activity-feed"
  | "notifications"
  | "discussions"
  | "attachments"
  | "history"
  | "settings";

export type CollaborationWorkspaceKind =
  "character" | "world" | "episode" | "asset" | "ai" | "production" | "publishing" | "cross-studio";

export type CollaborationNotificationType =
  "mention" | "assignment" | "review-request" | "approval" | "comment" | "system";

export type CollaborationActivityType =
  "comment" | "mention" | "assignment" | "review" | "notification" | "discussion" | "system";

export type CollaborationLinkedReference =
  | CharacterReference
  | WorldReference
  | EpisodeReference
  | AssetReference
  | PromptReference
  | ModelReference
  | AIJobReference
  | ProductionTaskReference
  | PublicationReference;

export interface CollaborationComment extends CommentReference {
  body: string;
  workspaceId: string;
  mentions: readonly string[];
  linkedTo?: CollaborationLinkedReference;
}

export interface CollaborationMention extends MentionReference {
  author: string;
  preview: string;
  workspaceId: string;
  linkedTo?: CollaborationLinkedReference;
}

export interface CollaborationAssignment extends AssignmentReference {
  workspaceId: string;
  priority: "low" | "medium" | "high" | "critical";
  linkedTo?: CollaborationLinkedReference;
}

export interface CollaborationNotification extends NotificationReference {
  message: string;
  workspaceId: string;
}

export interface CollaborationReview extends ReviewReference {
  reviewerNames: readonly string[];
  workspaceId: string;
  linkedTo?: CollaborationLinkedReference;
}

export interface CollaborationDiscussion extends DiscussionReference {
  owner: string;
  summary: string;
  participantNames: readonly string[];
  commentIds: readonly string[];
}

export interface CollaborationActivityItem {
  id: string;
  type: CollaborationActivityType;
  title: string;
  detail: string;
  actor: string;
  createdAt: string;
  studio: CollaborationWorkspaceKind;
  workspaceId: string;
  linkedTo?: CollaborationLinkedReference;
}

export interface CollaborationWorkspace {
  id: string;
  name: string;
  kind: CollaborationWorkspaceKind;
  summary: string;
  owner: string;
  team: readonly string[];
  assignedToMe: readonly CollaborationAssignment[];
  mentions: readonly CollaborationMention[];
  pendingReviews: readonly CollaborationReview[];
  openComments: readonly CollaborationComment[];
  recentActivity: readonly CollaborationActivityItem[];
  teamUpdates: readonly string[];
  notifications: readonly CollaborationNotification[];
  discussions: readonly CollaborationDiscussion[];
  attachments: readonly string[];
  history: readonly CollaborationActivityItem[];
}

export interface CollaborationDashboardState {
  workspaces: readonly CollaborationWorkspace[];
  activityFeed: readonly CollaborationActivityItem[];
}

export interface CollaborationStudioWorkspaceState {
  currentWorkspace: CollaborationWorkspace | null;
  currentPlugin: CollaborationPluginId;
  selectedDiscussionId: string | null;
  selectedCommentId: string | null;
  draftComment: string;
  unsavedChanges: boolean;
}
