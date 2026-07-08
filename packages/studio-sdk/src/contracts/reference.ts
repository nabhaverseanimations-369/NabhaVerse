export interface CharacterReference {
  id: string;
  name: string;
  description: string;
}

export interface WorldReference {
  id: string;
  name: string;
  description: string;
}

export interface LocationReference {
  id: string;
  name: string;
  description: string;
  worldId?: string;
}

export interface AssetReference {
  id: string;
  name: string;
  description: string;
  kind?: string;
}

export interface EpisodeReference {
  id: string;
  name: string;
  description: string;
  season?: number;
  episodeNumber?: number;
}

export interface AIJobReference {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
}

export interface PromptReference {
  id: string;
  name: string;
  description: string;
  version: string;
}

export interface ModelReference {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export interface ProductionTaskReference {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "in-review" | "blocked" | "done";
  priority: "low" | "medium" | "high" | "critical";
}

export interface ReviewReference {
  id: string;
  title: string;
  status: "pending" | "approved" | "changes-requested";
  dueAt?: string;
}

export interface MilestoneReference {
  id: string;
  title: string;
  targetDate: string;
  completion: number;
  status: "planned" | "at-risk" | "on-track" | "completed";
}

export interface PublicationReference {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "approved" | "published" | "failed";
  releaseType: "episode" | "trailer" | "short" | "bundle";
}

export interface ReleaseReference {
  id: string;
  name: string;
  scheduledAt?: string;
  status: "draft" | "scheduled" | "approved" | "published" | "failed";
}

export interface DistributionTargetReference {
  id: string;
  name: string;
  provider: "internal" | "youtube" | "social" | "partner" | "custom";
  status: "ready" | "pending" | "error";
}

export interface CommentReference {
  id: string;
  author: string;
  createdAt: string;
  status: "open" | "resolved" | "archived";
}

export interface MentionReference {
  id: string;
  subject: string;
  createdAt: string;
  status: "unread" | "read" | "archived";
}

export interface AssignmentReference {
  id: string;
  title: string;
  assignee: string;
  dueAt?: string;
  status: "todo" | "in-progress" | "in-review" | "completed" | "blocked";
}

export interface NotificationReference {
  id: string;
  title: string;
  createdAt: string;
  type: "mention" | "assignment" | "review-request" | "approval" | "comment" | "system";
  read: boolean;
}

export interface DiscussionReference {
  id: string;
  title: string;
  createdAt: string;
  status: "active" | "paused" | "closed";
}

export interface SearchResultReference {
  id: string;
  title: string;
  category:
    | "navigation"
    | "character"
    | "world"
    | "episode"
    | "asset"
    | "ai"
    | "production"
    | "publishing"
    | "collaboration"
    | "intelligence"
    | "documentation"
    | "command";
  description: string;
  href?: string;
}

export interface CommandReference {
  id: string;
  title: string;
  category: "navigation" | "workspace" | "editing" | "review" | "system" | "developer";
  description: string;
}

export interface InsightReference {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "watch" | "critical";
  studio: string;
}

export interface RecommendationReference {
  id: string;
  title: string;
  summary: string;
  reason: string;
  priority: "low" | "medium" | "high";
}
