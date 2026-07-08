import * as React from "react";
import {
  Bot,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  Compass,
  Flag,
  Globe,
  Landmark,
  MapPinned,
  MessagesSquare,
  Microscope,
  Mountain,
  Orbit,
  Palmtree,
  ScrollText,
  Sigma,
  Sparkles,
  Warehouse,
} from "lucide-react";

import { MapPlaceholder } from "@/components/world/map-placeholder";
import { RegionTree } from "@/components/world/region-tree";
import { RelationshipGraphPlaceholder } from "@/components/world/relationship-graph-placeholder";
import { StatisticsPanel } from "@/components/world/statistics-panel";
import { TimelineView } from "@/components/world/timeline-view";
import { WorldDocumentEditor } from "@/components/world/world-document-editor";
import { WorldOverviewPanel } from "@/components/world/world-overview-panel";
import {
  mockWorldAssets,
  mockWorldRelationships,
  mockWorldVersions,
} from "@/features/world/data/world-mocks";
import {
  createStudioDocumentPlugin,
  getStudioPluginOrThrow,
  isStudioPluginId,
  type StudioPluginDefinition,
} from "@nabhaverse/studio-sdk";
import type { World, WorldPluginId } from "@/features/world/types/world.types";

function buildDocumentPlugin(
  metadata: Omit<
    StudioPluginDefinition<World, WorldPluginId>,
    "component" | "permissions" | "validation" | "featureFlags"
  >,
): StudioPluginDefinition<World, WorldPluginId> {
  return createStudioDocumentPlugin(
    metadata,
    ({ entity }: { entity: World }) => (
      <WorldDocumentEditor
        title={metadata.title}
        description={metadata.description}
        version={entity.version}
      />
    ),
    ["worlds:read", "worlds:write"],
    ["markdown-placeholder", "attachments-placeholder", "save-state-placeholder"],
    ["world-studio"],
  );
}

function OverviewPlugin({ entity: world }: { entity: World }): React.JSX.Element {
  const versions = mockWorldVersions.filter((version) => version.worldId === world.id);
  const relationships = mockWorldRelationships.filter(
    (relationship) => relationship.worldId === world.id,
  );
  const assets = mockWorldAssets.filter((asset) => asset.worldId === world.id);

  return (
    <section className="space-y-4">
      <WorldOverviewPanel world={world} />
      <div className="grid gap-4 xl:grid-cols-2">
        <TimelineView versions={versions} />
        <RelationshipGraphPlaceholder relationships={relationships} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <StatisticsPanel statistics={world.statistics} />
        <RegionTree />
      </div>
      <MapPlaceholder title="World Map" />
      <WorldDocumentEditor
        title="Overview Notes"
        description="Working notes and creative alignment context for this world."
        version={world.version}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <article
            key={asset.id}
            className="rounded-md border border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]"
          >
            <p className="font-medium text-[var(--color-text-primary)]">{asset.title}</p>
            <p>{asset.kind}</p>
            <p>Updated {asset.updatedAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const worldPluginRegistry: readonly StudioPluginDefinition<World, WorldPluginId>[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Sparkles,
    category: "overview",
    order: 0,
    route: "/creative/worlds/:worldId/overview",
    component: OverviewPlugin,
    permissions: ["worlds:read"],
    validation: ["world-summary", "timeline-summary", "statistics-panel"],
    featureFlags: ["world-studio"],
    description: "World dashboard and summary",
  },
  buildDocumentPlugin({
    id: "geography",
    title: "Geography",
    icon: Compass,
    category: "geography",
    order: 10,
    route: "/creative/worlds/:worldId/geography",
    description: "Terrain, climate, and spatial structure",
  }),
  buildDocumentPlugin({
    id: "locations",
    title: "Locations",
    icon: MapPinned,
    category: "geography",
    order: 20,
    route: "/creative/worlds/:worldId/locations",
    description: "Places, landmarks, and important sites",
  }),
  buildDocumentPlugin({
    id: "regions",
    title: "Regions",
    icon: Mountain,
    category: "geography",
    order: 30,
    route: "/creative/worlds/:worldId/regions",
    description: "Regional boundaries and identities",
  }),
  buildDocumentPlugin({
    id: "kingdoms",
    title: "Kingdoms",
    icon: Building2,
    category: "systems",
    order: 40,
    route: "/creative/worlds/:worldId/kingdoms",
    description: "Realm governance and territorial power",
  }),
  buildDocumentPlugin({
    id: "cities",
    title: "Cities",
    icon: Warehouse,
    category: "systems",
    order: 50,
    route: "/creative/worlds/:worldId/cities",
    description: "Urban centers and infrastructure",
  }),
  buildDocumentPlugin({
    id: "landmarks",
    title: "Landmarks",
    icon: Flag,
    category: "geography",
    order: 60,
    route: "/creative/worlds/:worldId/landmarks",
    description: "Iconic natural or constructed landmarks",
  }),
  buildDocumentPlugin({
    id: "history",
    title: "History",
    icon: ScrollText,
    category: "history",
    order: 70,
    route: "/creative/worlds/:worldId/history",
    description: "Chronicles, eras, and historical beats",
  }),
  buildDocumentPlugin({
    id: "timeline",
    title: "Timeline",
    icon: Orbit,
    category: "history",
    order: 80,
    route: "/creative/worlds/:worldId/timeline",
    description: "Chronological structure and milestones",
  }),
  buildDocumentPlugin({
    id: "culture",
    title: "Culture",
    icon: MessagesSquare,
    category: "culture",
    order: 90,
    route: "/creative/worlds/:worldId/culture",
    description: "Cultural identity, customs, and rituals",
  }),
  buildDocumentPlugin({
    id: "languages",
    title: "Languages",
    icon: Sigma,
    category: "culture",
    order: 100,
    route: "/creative/worlds/:worldId/languages",
    description: "Languages, scripts, and dialects",
  }),
  buildDocumentPlugin({
    id: "religion",
    title: "Religion",
    icon: BookOpen,
    category: "culture",
    order: 110,
    route: "/creative/worlds/:worldId/religion",
    description: "Belief systems and sacred institutions",
  }),
  buildDocumentPlugin({
    id: "government",
    title: "Government",
    icon: Landmark,
    category: "systems",
    order: 120,
    route: "/creative/worlds/:worldId/government",
    description: "Political structures and authority",
  }),
  buildDocumentPlugin({
    id: "economy",
    title: "Economy",
    icon: ChartNoAxesCombined,
    category: "systems",
    order: 130,
    route: "/creative/worlds/:worldId/economy",
    description: "Trade, resources, and value systems",
  }),
  buildDocumentPlugin({
    id: "technology",
    title: "Technology",
    icon: Microscope,
    category: "systems",
    order: 140,
    route: "/creative/worlds/:worldId/technology",
    description: "Tech tiers, inventions, and constraints",
  }),
  buildDocumentPlugin({
    id: "species",
    title: "Species",
    icon: Globe,
    category: "systems",
    order: 150,
    route: "/creative/worlds/:worldId/species",
    description: "Species profiles and interactions",
  }),
  buildDocumentPlugin({
    id: "organizations",
    title: "Organizations",
    icon: Building2,
    category: "systems",
    order: 160,
    route: "/creative/worlds/:worldId/organizations",
    description: "Factions, guilds, and institutions",
  }),
  buildDocumentPlugin({
    id: "magic-system",
    title: "Magic System",
    icon: Bot,
    category: "systems",
    order: 170,
    route: "/creative/worlds/:worldId/magic-system",
    description: "Magic rules, costs, and consequences",
  }),
  buildDocumentPlugin({
    id: "rules",
    title: "Rules",
    icon: Sparkles,
    category: "systems",
    order: 180,
    route: "/creative/worlds/:worldId/rules",
    description: "World logic and consistency guardrails",
  }),
  buildDocumentPlugin({
    id: "climate",
    title: "Climate",
    icon: Palmtree,
    category: "geography",
    order: 190,
    route: "/creative/worlds/:worldId/climate",
    description: "Climate zones, weather, and seasonality",
  }),
  buildDocumentPlugin({
    id: "maps",
    title: "Maps",
    icon: MapPinned,
    category: "geography",
    order: 200,
    route: "/creative/worlds/:worldId/maps",
    description: "Maps, layers, and cartographic references",
  }),
  buildDocumentPlugin({
    id: "assets",
    title: "Assets",
    icon: Globe,
    category: "reference",
    order: 210,
    route: "/creative/worlds/:worldId/assets",
    description: "Linked media and reference assets",
  }),
  buildDocumentPlugin({
    id: "documents",
    title: "Documents",
    icon: ScrollText,
    category: "reference",
    order: 220,
    route: "/creative/worlds/:worldId/documents",
    description: "Supporting documents and lore references",
  }),
  buildDocumentPlugin({
    id: "relationships",
    title: "Relationships",
    icon: Orbit,
    category: "collaboration",
    order: 230,
    route: "/creative/worlds/:worldId/relationships",
    description: "Relationships and inter-world dependencies",
  }),
  buildDocumentPlugin({
    id: "version-history",
    title: "Version History",
    icon: ScrollText,
    category: "collaboration",
    order: 240,
    route: "/creative/worlds/:worldId/version-history",
    description: "Version history and revision snapshots",
  }),
  buildDocumentPlugin({
    id: "comments",
    title: "Comments",
    icon: MessagesSquare,
    category: "collaboration",
    order: 250,
    route: "/creative/worlds/:worldId/comments",
    description: "Review thread and feedback",
  }),
  buildDocumentPlugin({
    id: "activity",
    title: "Activity",
    icon: Sparkles,
    category: "collaboration",
    order: 260,
    route: "/creative/worlds/:worldId/activity",
    description: "Recent activity and editorial changes",
  }),
] as const;

export function isWorldPluginId(value: string): value is WorldPluginId {
  return isStudioPluginId(value, worldPluginRegistry);
}

export function getWorldPlugin(id: WorldPluginId) {
  return getStudioPluginOrThrow(worldPluginRegistry, id, "world");
}
