import * as React from "react";
import {
  Clapperboard,
  FileText,
  FolderKanban,
  Frame,
  GalleryVerticalEnd,
  Globe,
  MessageSquareMore,
  Mic,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";

import { EpisodeOverviewPanel } from "@/components/episode/episode-overview-panel";
import { EpisodeScriptEditor } from "@/components/episode/episode-script-editor";
import { EpisodeSceneList } from "@/components/episode/episode-scene-list";
import { EpisodeStoryboardPanel } from "@/components/episode/episode-storyboard-panel";
import { EpisodeShotListPanel } from "@/components/episode/episode-shot-list-panel";
import {
  EpisodeAssetsPanel,
  EpisodeActivityPanel,
  EpisodeCastPanel,
  EpisodeCommentsPanel,
  EpisodeLocationsPanel,
  EpisodeNotesPanel,
  EpisodePropsPanel,
  EpisodeVersionHistoryPanel,
} from "@/components/episode/episode-plugin-panels";
import type { Episode, EpisodePluginId } from "@/features/episode/types/episode.types";
import {
  createStudioDocumentPlugin,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

function createEpisodeDocumentPlugin(
  metadata: Omit<
    StudioPluginDefinition<Episode, EpisodePluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: Episode }>,
  validation: readonly string[] = ["episode-summary", "workspace-state", "draft-status"],
): StudioPluginDefinition<Episode, EpisodePluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["episodes:read", "episodes:write"],
    validation,
    ["episode-studio"],
  );
}

function OverviewPlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return <EpisodeOverviewPanel episode={episode} />;
}

function StoryOutlinePlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return (
    <EpisodeNotesPanel
      episode={episode}
      title="Story Outline"
      description="Beat sheet, act turns, and editorial notes for the episode outline."
    />
  );
}

function ScriptPlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return <EpisodeScriptEditor episode={episode} />;
}

function SceneListPlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return <EpisodeSceneList episode={episode} />;
}

function StoryboardPlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return <EpisodeStoryboardPanel episode={episode} />;
}

function ShotListPlugin({ entity: episode }: { entity: Episode }): React.JSX.Element {
  return <EpisodeShotListPanel episode={episode} />;
}

export const episodePluginRegistry: readonly StudioPluginDefinition<Episode, EpisodePluginId>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Sparkles,
    category: "overview",
    order: 0,
    route: "/production/episodes/:episodeId/overview",
    component: OverviewPlugin,
    permissions: ["episodes:read"],
    validation: ["episode-summary", "workspace-state"],
    featureFlags: ["episode-studio"],
    description: "Episode dashboard and summary",
  },
  createEpisodeDocumentPlugin(
    {
      id: "story-outline",
      title: "Story Outline",
      icon: ScrollText,
      category: "bible",
      order: 10,
      route: "/production/episodes/:episodeId/story-outline",
      description: "Beat sheet and story structure",
    },
    StoryOutlinePlugin,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "script",
      title: "Script",
      icon: FileText,
      category: "reference",
      order: 20,
      route: "/production/episodes/:episodeId/script",
      description: "Script draft and dialogue blocks",
    },
    ScriptPlugin,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "scene-list",
      title: "Scene List",
      icon: Clapperboard,
      category: "systems",
      order: 30,
      route: "/production/episodes/:episodeId/scene-list",
      description: "Scenes, order, and timing",
    },
    SceneListPlugin,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "storyboard",
      title: "Storyboard",
      icon: Frame,
      category: "systems",
      order: 40,
      route: "/production/episodes/:episodeId/storyboard",
      description: "Storyboard placeholder and timing",
    },
    StoryboardPlugin,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "shot-list",
      title: "Shot List",
      icon: GalleryVerticalEnd,
      category: "systems",
      order: 50,
      route: "/production/episodes/:episodeId/shot-list",
      description: "Shot breakdown and production notes",
    },
    ShotListPlugin,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "character-cast",
      title: "Character Cast",
      icon: Users,
      category: "collaboration",
      order: 60,
      route: "/production/episodes/:episodeId/character-cast",
      description: "Character references and cast mapping",
    },
    ({ entity }) => <EpisodeCastPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "locations",
      title: "Locations",
      icon: Globe,
      category: "geography",
      order: 70,
      route: "/production/episodes/:episodeId/locations",
      description: "World and location references",
    },
    ({ entity }) => <EpisodeLocationsPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "props",
      title: "Props",
      icon: FolderKanban,
      category: "reference",
      order: 80,
      route: "/production/episodes/:episodeId/props",
      description: "Props and continuity references",
    },
    ({ entity }) => <EpisodePropsPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "assets",
      title: "Assets",
      icon: GalleryVerticalEnd,
      category: "reference",
      order: 90,
      route: "/production/episodes/:episodeId/assets",
      description: "Reference assets and production boards",
    },
    ({ entity }) => <EpisodeAssetsPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "production-notes",
      title: "Production Notes",
      icon: Mic,
      category: "collaboration",
      order: 100,
      route: "/production/episodes/:episodeId/production-notes",
      description: "Editorial notes and production context",
    },
    ({ entity }) => (
      <EpisodeNotesPanel
        episode={entity}
        title="Production Notes"
        description="Editorial notes, tone markers, and production reminders for the episode."
      />
    ),
  ),
  createEpisodeDocumentPlugin(
    {
      id: "version-history",
      title: "Version History",
      icon: FolderKanban,
      category: "collaboration",
      order: 110,
      route: "/production/episodes/:episodeId/version-history",
      description: "Revision snapshots and milestones",
    },
    ({ entity }) => <EpisodeVersionHistoryPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessageSquareMore,
      category: "collaboration",
      order: 120,
      route: "/production/episodes/:episodeId/comments",
      description: "Review thread and feedback",
    },
    ({ entity }) => <EpisodeCommentsPanel episode={entity} />,
  ),
  createEpisodeDocumentPlugin(
    {
      id: "activity",
      title: "Activity",
      icon: FolderKanban,
      category: "collaboration",
      order: 130,
      route: "/production/episodes/:episodeId/activity",
      description: "Recent changes and events",
    },
    ({ entity }) => <EpisodeActivityPanel episode={entity} />,
  ),
] as const;

export const episodeWorkspaceSections = episodePluginRegistry.map((plugin) => ({
  id: plugin.id,
  label: plugin.title,
  description: plugin.description,
}));

export const episodeSectionIds = new Set(episodePluginRegistry.map((plugin) => plugin.id));

export function isEpisodePluginId(value: string): value is EpisodePluginId {
  return isStudioPluginId(value, episodePluginRegistry);
}

export function getEpisodePlugin(
  id: EpisodePluginId,
): StudioPluginDefinition<Episode, EpisodePluginId> {
  const plugin = episodePluginRegistry.find((entry) => entry.id === id);
  if (!plugin) {
    throw new Error(`Unknown episode plugin: ${id}`);
  }
  return plugin;
}
