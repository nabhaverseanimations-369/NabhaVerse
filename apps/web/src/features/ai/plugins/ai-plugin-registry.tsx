import * as React from "react";
import {
  ActivitySquare,
  Bot,
  Braces,
  Cable,
  FilePenLine,
  FolderCog,
  GalleryHorizontal,
  History,
  LayoutDashboard,
  Link,
  ListOrdered,
  MessageSquareMore,
  NotebookTabs,
  TestTubeDiagonal,
} from "lucide-react";

import {
  createStudioDocumentPlugin,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

import { AIDashboard } from "@/components/ai/ai-dashboard";
import {
  ActivityPanel,
  AssetLinksPanel,
  CommentsPanel,
  EvaluationPanel,
  JobHistoryPanel,
  JobQueuePanel,
  ModelCatalogPanel,
  OutputGalleryPanel,
  PromptLibraryPanel,
  PromptVersionsPanel,
  ProviderConfigurationPanel,
  SettingsPanel,
} from "@/components/ai/ai-plugin-panels";
import { PromptEditor } from "@/components/ai/prompt-editor";
import { mockPrompts } from "@/features/ai/data/ai-mocks";
import type { AIStudioWorkspace } from "@/features/ai/types/ai.types";

export type AIPluginId =
  | "overview"
  | "prompt-library"
  | "prompt-editor"
  | "prompt-versions"
  | "model-catalog"
  | "provider-configuration"
  | "job-queue"
  | "job-history"
  | "output-gallery"
  | "asset-links"
  | "evaluation"
  | "settings"
  | "activity"
  | "comments";

function buildAIPlugin(
  metadata: Omit<
    StudioPluginDefinition<AIStudioWorkspace, AIPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: AIStudioWorkspace }>,
): StudioPluginDefinition<AIStudioWorkspace, AIPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["ai:read", "ai:write"],
    ["ai-summary", "workspace-state", "draft-status"],
    ["ai-studio"],
  );
}

const selectedPrompt = mockPrompts[0];

if (!selectedPrompt) {
  throw new Error("Expected at least one AI prompt");
}

export const aiPluginRegistry: readonly StudioPluginDefinition<AIStudioWorkspace, AIPluginId>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: LayoutDashboard,
    category: "overview",
    order: 0,
    route: "/ai/studio/:workspaceId/overview",
    component: ({ entity }) => <AIDashboard workspace={entity} />,
    permissions: ["ai:read"],
    validation: ["ai-summary", "workspace-state"],
    featureFlags: ["ai-studio"],
    description: "AI orchestration dashboard",
  },
  buildAIPlugin(
    {
      id: "prompt-library",
      title: "Prompt Library",
      icon: NotebookTabs,
      category: "reference",
      order: 10,
      route: "/ai/studio/:workspaceId/prompt-library",
      description: "Prompt catalog with categories, tags, and search",
    },
    ({ entity }) => <PromptLibraryPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "prompt-editor",
      title: "Prompt Editor",
      icon: FilePenLine,
      category: "reference",
      order: 20,
      route: "/ai/studio/:workspaceId/prompt-editor",
      description: "Markdown prompt editor with variables and previews",
    },
    () => <PromptEditor prompt={selectedPrompt} />,
  ),
  buildAIPlugin(
    {
      id: "prompt-versions",
      title: "Prompt Versions",
      icon: History,
      category: "collaboration",
      order: 30,
      route: "/ai/studio/:workspaceId/prompt-versions",
      description: "Prompt version timeline and snapshots",
    },
    ({ entity }) => <PromptVersionsPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "model-catalog",
      title: "Model Catalog",
      icon: Bot,
      category: "systems",
      order: 40,
      route: "/ai/studio/:workspaceId/model-catalog",
      description: "Provider-agnostic model library",
    },
    ({ entity }) => <ModelCatalogPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "provider-configuration",
      title: "Provider Configuration",
      icon: Cable,
      category: "systems",
      order: 50,
      route: "/ai/studio/:workspaceId/provider-configuration",
      description: "Provider status and configuration placeholders",
    },
    ({ entity }) => <ProviderConfigurationPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "job-queue",
      title: "Job Queue",
      icon: ListOrdered,
      category: "systems",
      order: 60,
      route: "/ai/studio/:workspaceId/job-queue",
      description: "Pending and running jobs with progress",
    },
    ({ entity }) => <JobQueuePanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "job-history",
      title: "Job History",
      icon: FolderCog,
      category: "collaboration",
      order: 70,
      route: "/ai/studio/:workspaceId/job-history",
      description: "Completed, failed, and cancelled jobs",
    },
    ({ entity }) => <JobHistoryPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "output-gallery",
      title: "Output Gallery",
      icon: GalleryHorizontal,
      category: "reference",
      order: 80,
      route: "/ai/studio/:workspaceId/output-gallery",
      description: "Recent outputs linked to Asset Studio",
    },
    ({ entity }) => <OutputGalleryPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "asset-links",
      title: "Asset Links",
      icon: Link,
      category: "reference",
      order: 90,
      route: "/ai/studio/:workspaceId/asset-links",
      description: "Output-to-asset references",
    },
    ({ entity }) => <AssetLinksPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "evaluation",
      title: "Evaluation",
      icon: TestTubeDiagonal,
      category: "collaboration",
      order: 100,
      route: "/ai/studio/:workspaceId/evaluation",
      description: "Evaluation placeholders for quality scoring",
    },
    () => <EvaluationPanel />,
  ),
  buildAIPlugin(
    {
      id: "settings",
      title: "Settings",
      icon: Braces,
      category: "systems",
      order: 110,
      route: "/ai/studio/:workspaceId/settings",
      description: "Workspace settings placeholders",
    },
    () => <SettingsPanel />,
  ),
  buildAIPlugin(
    {
      id: "activity",
      title: "Activity",
      icon: ActivitySquare,
      category: "collaboration",
      order: 120,
      route: "/ai/studio/:workspaceId/activity",
      description: "Recent orchestration activity",
    },
    ({ entity }) => <ActivityPanel workspace={entity} />,
  ),
  buildAIPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 130,
      route: "/ai/studio/:workspaceId/comments",
      description: "Review thread placeholders",
    },
    ({ entity }) => <CommentsPanel workspace={entity} />,
  ),
] as const;

export function isAIPluginId(value: string): value is AIPluginId {
  return isStudioPluginId(value, aiPluginRegistry);
}

export function getAIPlugin(id: AIPluginId): StudioPluginDefinition<AIStudioWorkspace, AIPluginId> {
  const plugin = aiPluginRegistry.find((entry) => entry.id === id);
  if (!plugin) {
    throw new Error(`Unknown AI plugin: ${id}`);
  }
  return plugin;
}
