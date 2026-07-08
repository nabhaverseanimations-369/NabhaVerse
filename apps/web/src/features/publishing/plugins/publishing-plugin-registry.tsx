import * as React from "react";
import {
  ActivitySquare,
  BarChart3,
  BookText,
  Boxes,
  CalendarDays,
  CheckSquare,
  FileArchive,
  Globe,
  LayoutDashboard,
  MessageSquareMore,
  Settings,
  SquareKanban,
} from "lucide-react";

import {
  createStudioDocumentPlugin,
  getStudioPluginOrThrow,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

import {
  ActivityPanel,
  AnalyticsPanel,
  ApprovalWorkflowPanel,
  AssetsPanel,
  CommentsPanel,
  DistributionTargetsPanel,
  ExportPackagePanel,
  PublishingOverviewPanel,
  ReleaseDetailsPanel,
  ReleaseNotesPanel,
  SchedulePanel,
  SettingsPanel,
} from "@/components/publishing/publishing-plugin-panels";
import type { Publication } from "@/features/publishing/types/publishing.types";

export type PublishingPluginId =
  | "overview"
  | "release-details"
  | "distribution-targets"
  | "schedule"
  | "approval-workflow"
  | "export-package"
  | "release-notes"
  | "assets"
  | "analytics"
  | "activity"
  | "comments"
  | "settings";

function buildPublishingPlugin(
  metadata: Omit<
    StudioPluginDefinition<Publication, PublishingPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: Publication }>,
): StudioPluginDefinition<Publication, PublishingPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["publishing:read", "publishing:write"],
    ["publishing-summary", "workspace-state", "draft-status"],
    ["publishing-studio"],
  );
}

export const publishingPluginRegistry: readonly StudioPluginDefinition<
  Publication,
  PublishingPluginId
>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: LayoutDashboard,
    category: "overview",
    order: 0,
    route: "/publishing/studio/:workspaceId/overview",
    component: ({ entity }) => <PublishingOverviewPanel publication={entity} />,
    permissions: ["publishing:read"],
    validation: ["publishing-summary", "workspace-state"],
    featureFlags: ["publishing-studio"],
    description: "Publishing orchestration summary",
  },
  buildPublishingPlugin(
    {
      id: "release-details",
      title: "Release Details",
      icon: SquareKanban,
      category: "reference",
      order: 10,
      route: "/publishing/studio/:workspaceId/release-details",
      description: "Release metadata and status details",
    },
    ({ entity }) => <ReleaseDetailsPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "distribution-targets",
      title: "Distribution Targets",
      icon: Globe,
      category: "systems",
      order: 20,
      route: "/publishing/studio/:workspaceId/distribution-targets",
      description: "Distribution target planning placeholders",
    },
    ({ entity }) => <DistributionTargetsPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "schedule",
      title: "Schedule",
      icon: CalendarDays,
      category: "systems",
      order: 30,
      route: "/publishing/studio/:workspaceId/schedule",
      description: "Publication schedule and timeline",
    },
    ({ entity }) => <SchedulePanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "approval-workflow",
      title: "Approval Workflow",
      icon: CheckSquare,
      category: "collaboration",
      order: 40,
      route: "/publishing/studio/:workspaceId/approval-workflow",
      description: "Approval status orchestration",
    },
    ({ entity }) => <ApprovalWorkflowPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "export-package",
      title: "Export Package",
      icon: FileArchive,
      category: "systems",
      order: 50,
      route: "/publishing/studio/:workspaceId/export-package",
      description: "Provider-agnostic export package placeholder",
    },
    ({ entity }) => <ExportPackagePanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "release-notes",
      title: "Release Notes",
      icon: BookText,
      category: "reference",
      order: 60,
      route: "/publishing/studio/:workspaceId/release-notes",
      description: "Release notes draft and review",
    },
    ({ entity }) => <ReleaseNotesPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "assets",
      title: "Assets",
      icon: Boxes,
      category: "reference",
      order: 70,
      route: "/publishing/studio/:workspaceId/assets",
      description: "Linked asset references",
    },
    ({ entity }) => <AssetsPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      category: "systems",
      order: 80,
      route: "/publishing/studio/:workspaceId/analytics",
      description: "Analytics placeholder, no provider integrations",
    },
    () => <AnalyticsPanel />,
  ),
  buildPublishingPlugin(
    {
      id: "activity",
      title: "Activity",
      icon: ActivitySquare,
      category: "collaboration",
      order: 90,
      route: "/publishing/studio/:workspaceId/activity",
      description: "Publishing activity feed",
    },
    ({ entity }) => <ActivityPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 100,
      route: "/publishing/studio/:workspaceId/comments",
      description: "Review comments placeholder",
    },
    ({ entity }) => <CommentsPanel publication={entity} />,
  ),
  buildPublishingPlugin(
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      category: "systems",
      order: 110,
      route: "/publishing/studio/:workspaceId/settings",
      description: "Workspace settings placeholder",
    },
    () => <SettingsPanel />,
  ),
] as const;

export function isPublishingPluginId(value: string): value is PublishingPluginId {
  return isStudioPluginId(value, publishingPluginRegistry);
}

export function getPublishingPlugin(
  id: PublishingPluginId,
): StudioPluginDefinition<Publication, PublishingPluginId> {
  return getStudioPluginOrThrow(publishingPluginRegistry, id, "publishing");
}
