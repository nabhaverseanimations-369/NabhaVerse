import * as React from "react";
import {
  ActivitySquare,
  CalendarDays,
  CheckCheck,
  Clock3,
  FileBarChart,
  Flag,
  FolderKanban,
  Gauge,
  GitMerge,
  Layers3,
  MessageSquareMore,
  Network,
  Package,
  SquareStack,
} from "lucide-react";

import {
  createStudioDocumentPlugin,
  getStudioPluginOrThrow,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

import {
  ActivityPanel,
  ApprovalsPanel,
  CalendarPanel,
  CommentsPanel,
  DeliverablesPanel,
  DependenciesPanel,
  ProductionBoardPanel,
  ProductionOverviewPanel,
  ReportsPanel,
  ReviewQueuePanel,
  RisksPanel,
  ShotPipelinePanel,
  TaskQueuePanel,
  TimelinePanel,
} from "@/components/production/production-plugin-panels";
import type { Production } from "@/features/production/types/production.types";

export type ProductionPluginId =
  | "overview"
  | "production-board"
  | "task-queue"
  | "shot-pipeline"
  | "review-queue"
  | "approvals"
  | "dependencies"
  | "timeline"
  | "calendar"
  | "deliverables"
  | "risks"
  | "reports"
  | "activity"
  | "comments";

function buildProductionPlugin(
  metadata: Omit<
    StudioPluginDefinition<Production, ProductionPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: Production }>,
): StudioPluginDefinition<Production, ProductionPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["production:read", "production:write"],
    ["production-summary", "workspace-state", "draft-status"],
    ["production-studio"],
  );
}

export const productionPluginRegistry: readonly StudioPluginDefinition<
  Production,
  ProductionPluginId
>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Gauge,
    category: "overview",
    order: 0,
    route: "/production/studio/:productionId/overview",
    component: ({ entity }) => <ProductionOverviewPanel production={entity} />,
    permissions: ["production:read"],
    validation: ["production-summary", "workspace-state"],
    featureFlags: ["production-studio"],
    description: "Production summary and health",
  },
  buildProductionPlugin(
    {
      id: "production-board",
      title: "Production Board",
      icon: FolderKanban,
      category: "systems",
      order: 10,
      route: "/production/studio/:productionId/production-board",
      description: "Task board placeholder with workflow columns",
    },
    ({ entity }) => <ProductionBoardPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "task-queue",
      title: "Task Queue",
      icon: SquareStack,
      category: "systems",
      order: 20,
      route: "/production/studio/:productionId/task-queue",
      description: "Prioritized production tasks",
    },
    ({ entity }) => <TaskQueuePanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "shot-pipeline",
      title: "Shot Pipeline",
      icon: Layers3,
      category: "systems",
      order: 30,
      route: "/production/studio/:productionId/shot-pipeline",
      description: "Shot stages from script to approval",
    },
    ({ entity }) => <ShotPipelinePanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "review-queue",
      title: "Review Queue",
      icon: Clock3,
      category: "collaboration",
      order: 40,
      route: "/production/studio/:productionId/review-queue",
      description: "Pending and active reviews",
    },
    ({ entity }) => <ReviewQueuePanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "approvals",
      title: "Approvals",
      icon: CheckCheck,
      category: "collaboration",
      order: 50,
      route: "/production/studio/:productionId/approvals",
      description: "Approval status overview",
    },
    ({ entity }) => <ApprovalsPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "dependencies",
      title: "Dependencies",
      icon: GitMerge,
      category: "systems",
      order: 60,
      route: "/production/studio/:productionId/dependencies",
      description: "Task and milestone dependency graph",
    },
    ({ entity }) => <DependenciesPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "timeline",
      title: "Timeline",
      icon: Network,
      category: "systems",
      order: 70,
      route: "/production/studio/:productionId/timeline",
      description: "Milestone timeline view",
    },
    ({ entity }) => <TimelinePanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "calendar",
      title: "Calendar",
      icon: CalendarDays,
      category: "systems",
      order: 80,
      route: "/production/studio/:productionId/calendar",
      description: "Milestone calendar view",
    },
    ({ entity }) => <CalendarPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "deliverables",
      title: "Deliverables",
      icon: Package,
      category: "reference",
      order: 90,
      route: "/production/studio/:productionId/deliverables",
      description: "Delivery package checkpoints",
    },
    ({ entity }) => <DeliverablesPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "risks",
      title: "Risks",
      icon: Flag,
      category: "collaboration",
      order: 100,
      route: "/production/studio/:productionId/risks",
      description: "Current blockers and risk signals",
    },
    ({ entity }) => <RisksPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "reports",
      title: "Reports",
      icon: FileBarChart,
      category: "reference",
      order: 110,
      route: "/production/studio/:productionId/reports",
      description: "Operational report snapshots",
    },
    ({ entity }) => <ReportsPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "activity",
      title: "Activity",
      icon: ActivitySquare,
      category: "collaboration",
      order: 120,
      route: "/production/studio/:productionId/activity",
      description: "Recent production events",
    },
    ({ entity }) => <ActivityPanel production={entity} />,
  ),
  buildProductionPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 130,
      route: "/production/studio/:productionId/comments",
      description: "Review comments placeholder",
    },
    ({ entity }) => <CommentsPanel production={entity} />,
  ),
] as const;

export function isProductionPluginId(value: string): value is ProductionPluginId {
  return isStudioPluginId(value, productionPluginRegistry);
}

export function getProductionPlugin(
  id: ProductionPluginId,
): StudioPluginDefinition<Production, ProductionPluginId> {
  return getStudioPluginOrThrow(productionPluginRegistry, id, "production");
}
