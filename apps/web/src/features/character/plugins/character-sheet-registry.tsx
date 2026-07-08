import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Asterisk,
  Bot,
  ClipboardList,
  FolderKanban,
  Frame,
  GalleryVerticalEnd,
  Globe,
  MessageSquareMore,
  Mic,
  Sparkles,
  Users,
} from "lucide-react";

import { AssetGallery } from "@/components/character/asset-gallery";
import { CharacterDocumentEditor } from "@/components/character/character-document-editor";
import { CharacterOverviewPanel } from "@/components/character/character-overview-panel";
import { RelationshipGraphPlaceholder } from "@/components/character/relationship-graph-placeholder";
import { VersionTimeline } from "@/components/character/version-timeline";
import {
  mockCharacterAssets,
  mockCharacterRelationships,
  mockCharacterVersions,
} from "@/features/character/data/character-mocks";
import type { Character, CharacterDocumentType } from "@/features/character/types/character.types";

export interface CharacterSheetPluginProps {
  character: Character;
}

export interface CharacterSheetPlugin {
  id: CharacterDocumentType;
  title: string;
  icon: LucideIcon;
  category: "overview" | "bible" | "design" | "ai" | "reference" | "collaboration";
  order: number;
  route: string;
  component: React.ComponentType<CharacterSheetPluginProps>;
  permissions: readonly string[];
  validation: readonly string[];
  featureFlags: readonly string[];
  description: string;
}

function createDocumentPlugin(
  metadata: Omit<CharacterSheetPlugin, "component" | "permissions" | "validation" | "featureFlags">,
): CharacterSheetPlugin {
  return {
    ...metadata,
    permissions: ["characters:read", "characters:write"],
    validation: ["markdown-placeholder", "attachments-placeholder", "save-state-placeholder"],
    featureFlags: ["character-studio"],
    component: ({ character }: CharacterSheetPluginProps) => (
      <CharacterDocumentEditor
        title={metadata.title}
        description={metadata.description}
        version={character.version}
      />
    ),
  };
}

function OverviewPlugin({ character }: CharacterSheetPluginProps): React.JSX.Element {
  const versions = mockCharacterVersions.filter((version) => version.characterId === character.id);
  const relationships = mockCharacterRelationships.filter(
    (relationship) => relationship.characterId === character.id,
  );
  const assets = mockCharacterAssets.filter((asset) => asset.characterId === character.id);

  return (
    <section className="space-y-4">
      <CharacterOverviewPanel character={character} />
      <div className="grid gap-4 xl:grid-cols-2">
        <VersionTimeline versions={versions} />
        <RelationshipGraphPlaceholder relationships={relationships} />
      </div>
      <AssetGallery assets={assets} />
      <CharacterDocumentEditor
        title="Overview Notes"
        description="Working notes and creative alignment context for this character."
        version={character.version}
      />
    </section>
  );
}

export const characterSheetRegistry: readonly CharacterSheetPlugin[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Sparkles,
    category: "overview",
    order: 0,
    route: "/creative/characters/:characterId/overview",
    component: OverviewPlugin,
    permissions: ["characters:read"],
    validation: ["overview-summary", "workspace-status", "activity-snapshot"],
    featureFlags: ["character-studio"],
    description: "Character dashboard and summary",
  },
  createDocumentPlugin({
    id: "character-bible",
    title: "Character Bible",
    icon: ClipboardList,
    category: "bible",
    order: 10,
    route: "/creative/characters/:characterId/character-bible",
    description: "Lore, motivations, and canon",
  }),
  createDocumentPlugin({
    id: "design-specifications",
    title: "Design Specifications",
    icon: Frame,
    category: "design",
    order: 20,
    route: "/creative/characters/:characterId/design-specifications",
    description: "Visual direction, proportions, and style notes",
  }),
  createDocumentPlugin({
    id: "ai-specifications",
    title: "AI Specifications",
    icon: Bot,
    category: "ai",
    order: 30,
    route: "/creative/characters/:characterId/ai-specifications",
    description: "Prompt strategy and generation constraints",
  }),
  createDocumentPlugin({
    id: "model-sheet",
    title: "Model Sheet",
    icon: GalleryVerticalEnd,
    category: "reference",
    order: 40,
    route: "/creative/characters/:characterId/model-sheet",
    description: "Turnarounds and model standards",
  }),
  createDocumentPlugin({
    id: "expression-sheet",
    title: "Expression Sheet",
    icon: MessageSquareMore,
    category: "reference",
    order: 50,
    route: "/creative/characters/:characterId/expression-sheet",
    description: "Facial expression references and emotional range",
  }),
  createDocumentPlugin({
    id: "pose-sheet",
    title: "Pose Sheet",
    icon: Users,
    category: "reference",
    order: 60,
    route: "/creative/characters/:characterId/pose-sheet",
    description: "Pose language and silhouettes",
  }),
  createDocumentPlugin({
    id: "outfit-sheet",
    title: "Outfit Sheet",
    icon: Sparkles,
    category: "reference",
    order: 70,
    route: "/creative/characters/:characterId/outfit-sheet",
    description: "Costume variants and rules",
  }),
  createDocumentPlugin({
    id: "lighting-sheet",
    title: "Lighting Sheet",
    icon: Globe,
    category: "reference",
    order: 80,
    route: "/creative/characters/:characterId/lighting-sheet",
    description: "Lighting behavior and mood",
  }),
  createDocumentPlugin({
    id: "material-sheet",
    title: "Material Sheet",
    icon: Asterisk,
    category: "reference",
    order: 90,
    route: "/creative/characters/:characterId/material-sheet",
    description: "Material response and rendering references",
  }),
  createDocumentPlugin({
    id: "environment-sheet",
    title: "Environment Sheet",
    icon: FolderKanban,
    category: "reference",
    order: 100,
    route: "/creative/characters/:characterId/environment-sheet",
    description: "Character-environment interaction guidance",
  }),
  createDocumentPlugin({
    id: "animation-sheet",
    title: "Animation Sheet",
    icon: Sparkles,
    category: "reference",
    order: 110,
    route: "/creative/characters/:characterId/animation-sheet",
    description: "Motion language and animation constraints",
  }),
  createDocumentPlugin({
    id: "voice-sheet",
    title: "Voice Sheet",
    icon: Mic,
    category: "reference",
    order: 120,
    route: "/creative/characters/:characterId/voice-sheet",
    description: "Voice tone and speech profile",
  }),
  createDocumentPlugin({
    id: "sound-sheet",
    title: "Sound Sheet",
    icon: Sparkles,
    category: "reference",
    order: 130,
    route: "/creative/characters/:characterId/sound-sheet",
    description: "Audio motifs and sound palette",
  }),
  createDocumentPlugin({
    id: "ai-consistency-sheet",
    title: "AI Consistency Sheet",
    icon: Sparkles,
    category: "ai",
    order: 140,
    route: "/creative/characters/:characterId/ai-consistency-sheet",
    description: "Cross-shot consistency checklist",
  }),
  createDocumentPlugin({
    id: "relationships",
    title: "Relationships",
    icon: Users,
    category: "collaboration",
    order: 150,
    route: "/creative/characters/:characterId/relationships",
    description: "Character relationship mapping",
  }),
  createDocumentPlugin({
    id: "assets",
    title: "Assets",
    icon: GalleryVerticalEnd,
    category: "reference",
    order: 160,
    route: "/creative/characters/:characterId/assets",
    description: "Linked visual and reference assets",
  }),
  createDocumentPlugin({
    id: "documents",
    title: "Documents",
    icon: ClipboardList,
    category: "collaboration",
    order: 170,
    route: "/creative/characters/:characterId/documents",
    description: "Supporting internal documents",
  }),
  createDocumentPlugin({
    id: "version-history",
    title: "Version History",
    icon: FolderKanban,
    category: "collaboration",
    order: 180,
    route: "/creative/characters/:characterId/version-history",
    description: "Milestones and revision snapshots",
  }),
  createDocumentPlugin({
    id: "comments",
    title: "Comments",
    icon: MessageSquareMore,
    category: "collaboration",
    order: 190,
    route: "/creative/characters/:characterId/comments",
    description: "Review thread and feedback",
  }),
  createDocumentPlugin({
    id: "activity",
    title: "Activity",
    icon: Sparkles,
    category: "collaboration",
    order: 200,
    route: "/creative/characters/:characterId/activity",
    description: "Recent changes and events",
  }),
] as const;

export const characterWorkspaceSections = characterSheetRegistry.map((plugin) => ({
  id: plugin.id,
  label: plugin.title,
  description: plugin.description,
}));

export const characterSectionIds = new Set(characterSheetRegistry.map((plugin) => plugin.id));

export function isCharacterSection(value: string): value is CharacterDocumentType {
  return characterSectionIds.has(value as CharacterDocumentType);
}

export function getCharacterSection(id: CharacterDocumentType) {
  const section = characterWorkspaceSections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Unknown character section: ${id}`);
  }
  return section;
}

export function getCharacterSheetPlugin(id: CharacterDocumentType): CharacterSheetPlugin {
  const plugin = characterSheetRegistry.find((item) => item.id === id);
  if (!plugin) {
    throw new Error(`Unknown character sheet plugin: ${id}`);
  }
  return plugin;
}

export function getCharacterSheetPlugins(): readonly CharacterSheetPlugin[] {
  return characterSheetRegistry;
}
