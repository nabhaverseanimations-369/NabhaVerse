import * as React from "react";
import {
  ActivitySquare,
  BadgeInfo,
  BriefcaseBusiness,
  Eye,
  FolderKanban,
  History,
  Layers3,
  Lock,
  MessagesSquare,
  Share2,
} from "lucide-react";

import {
  createStudioDocumentPlugin,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";

import {
  AssetActivityPanel,
  AssetPermissionsPanel,
  AssetUsagePanel,
  AssetVersionsPanel,
} from "@/components/asset/asset-plugin-panels";
import { AssetCollectionPanel } from "@/components/asset/asset-collection-panel";
import { AssetMetadataPanel } from "@/components/asset/asset-metadata-panel";
import { AssetOverviewPanel } from "@/components/asset/asset-overview-panel";
import { AssetPreview } from "@/components/asset/asset-preview";
import { AssetRelationshipPanel } from "@/components/asset/asset-relationship-panel";
import { AssetCommentsPanel } from "@/components/asset/asset-plugin-panels";
import type { Asset } from "@/features/asset/types/asset.types";

export type AssetPluginId =
  | "overview"
  | "metadata"
  | "versions"
  | "collections"
  | "relationships"
  | "usage"
  | "preview"
  | "comments"
  | "activity"
  | "permissions";

function buildAssetPlugin(
  metadata: Omit<
    StudioPluginDefinition<Asset, AssetPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
  component: React.ComponentType<{ entity: Asset }>,
): StudioPluginDefinition<Asset, AssetPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    component,
    ["assets:read", "assets:write"],
    ["asset-summary", "workspace-state", "draft-status"],
    ["asset-studio"],
  );
}

function OverviewPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetOverviewPanel asset={asset} />;
}

function MetadataPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetMetadataPanel asset={asset} />;
}

function VersionsPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetVersionsPanel asset={asset} />;
}

function CollectionsPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetCollectionPanel asset={asset} />;
}

function RelationshipsPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetRelationshipPanel asset={asset} />;
}

function UsagePlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetUsagePanel asset={asset} />;
}

function PreviewPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetPreview asset={asset} />;
}

function PermissionsPlugin({ entity: asset }: { entity: Asset }): React.JSX.Element {
  return <AssetPermissionsPanel asset={asset} />;
}

export const assetPluginRegistry: readonly StudioPluginDefinition<Asset, AssetPluginId>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: BadgeInfo,
    category: "overview",
    order: 0,
    route: "/creative/assets/:assetId/overview",
    component: OverviewPlugin,
    permissions: ["assets:read"],
    validation: ["asset-summary", "workspace-state"],
    featureFlags: ["asset-studio"],
    description: "Asset dashboard and summary",
  },
  buildAssetPlugin(
    {
      id: "metadata",
      title: "Metadata",
      icon: BriefcaseBusiness,
      category: "reference",
      order: 10,
      route: "/creative/assets/:assetId/metadata",
      description: "Title, creator, license, and metadata fields",
    },
    MetadataPlugin,
  ),
  buildAssetPlugin(
    {
      id: "versions",
      title: "Versions",
      icon: History,
      category: "collaboration",
      order: 20,
      route: "/creative/assets/:assetId/versions",
      description: "Revision timeline and version notes",
    },
    VersionsPlugin,
  ),
  buildAssetPlugin(
    {
      id: "collections",
      title: "Collections",
      icon: FolderKanban,
      category: "systems",
      order: 30,
      route: "/creative/assets/:assetId/collections",
      description: "Nested collection structure and pinned assets",
    },
    CollectionsPlugin,
  ),
  buildAssetPlugin(
    {
      id: "relationships",
      title: "Relationships",
      icon: Share2,
      category: "collaboration",
      order: 40,
      route: "/creative/assets/:assetId/relationships",
      description: "Links to characters, worlds, and episodes",
    },
    RelationshipsPlugin,
  ),
  buildAssetPlugin(
    {
      id: "usage",
      title: "Usage",
      icon: Layers3,
      category: "systems",
      order: 50,
      route: "/creative/assets/:assetId/usage",
      description: "Where the asset is used across the platform",
    },
    UsagePlugin,
  ),
  buildAssetPlugin(
    {
      id: "preview",
      title: "Preview",
      icon: Eye,
      category: "reference",
      order: 60,
      route: "/creative/assets/:assetId/preview",
      description: "Type-aware preview placeholder",
    },
    PreviewPlugin,
  ),
  buildAssetPlugin(
    {
      id: "comments",
      title: "Comments",
      icon: MessagesSquare,
      category: "collaboration",
      order: 70,
      route: "/creative/assets/:assetId/comments",
      description: "Review threads and feedback",
    },
    ({ entity }) => <AssetCommentsPanel asset={entity} />,
  ),
  buildAssetPlugin(
    {
      id: "activity",
      title: "Activity",
      icon: ActivitySquare,
      category: "collaboration",
      order: 80,
      route: "/creative/assets/:assetId/activity",
      description: "Recent edits and editorial history",
    },
    ({ entity }) => <AssetActivityPanel asset={entity} />,
  ),
  buildAssetPlugin(
    {
      id: "permissions",
      title: "Permissions",
      icon: Lock,
      category: "systems",
      order: 90,
      route: "/creative/assets/:assetId/permissions",
      description: "Access model and collaboration rules",
    },
    PermissionsPlugin,
  ),
] as const;

export const assetWorkspaceSections = assetPluginRegistry.map((plugin) => ({
  id: plugin.id,
  label: plugin.title,
  description: plugin.description,
}));

export function isAssetPluginId(value: string): value is AssetPluginId {
  return isStudioPluginId(value, assetPluginRegistry);
}

export function getAssetPlugin(id: AssetPluginId): StudioPluginDefinition<Asset, AssetPluginId> {
  const plugin = assetPluginRegistry.find((entry) => entry.id === id);
  if (!plugin) {
    throw new Error(`Unknown asset plugin: ${id}`);
  }
  return plugin;
}
