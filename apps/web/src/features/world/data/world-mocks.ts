import type {
  World,
  WorldAsset,
  WorldDocument,
  WorldPluginId,
  WorldProfile,
  WorldRelationship,
  WorldVersion,
} from "@/features/world/types/world.types";

export const mockWorlds: World[] = [
  {
    id: "wld_lunara",
    slug: "lunara-basin",
    name: "Lunara Basin",
    description: "A tidal continent of lantern cities, trade winds, and ancient sky conduits.",
    status: "published",
    studio: "NabhaVerse Prime",
    tags: ["coastal", "trading-route", "high-fantasy"],
    favorite: true,
    recentlyOpenedAt: "8m ago",
    updatedAt: "15m ago",
    version: "v3.2",
    timelineSummary: "Six known eras with a current age of negotiated city-state alliances.",
    statistics: { regions: 12, locations: 84, cultures: 9, species: 6 },
    coverImageUrl: "https://picsum.photos/seed/lunara-cover/1280/720",
  },
  {
    id: "wld_auric",
    slug: "auric-frontier",
    name: "Auric Frontier",
    description: "An iron plateau of frontier keeps, mechanical roads, and stormbound archives.",
    status: "in-review",
    studio: "NabhaVerse Prime",
    tags: ["frontier", "dieselpunk", "archive"],
    favorite: false,
    recentlyOpenedAt: "45m ago",
    updatedAt: "1h ago",
    version: "v1.9",
    timelineSummary: "Expansion era maps are in review with governance and trade routes pending.",
    statistics: { regions: 7, locations: 31, cultures: 4, species: 3 },
    coverImageUrl: "https://picsum.photos/seed/auric-cover/1280/720",
  },
  {
    id: "wld_vetra",
    slug: "vetra-archipelago",
    name: "Vetra Archipelago",
    description: "Floating islands linked by ritual navigation, weather engines, and sea courts.",
    status: "draft",
    studio: "NabhaVerse Prime",
    tags: ["archipelago", "ritual", "storm"],
    favorite: true,
    recentlyOpenedAt: "2h ago",
    updatedAt: "4h ago",
    version: "v0.8",
    timelineSummary: "Draft chronicle focused on migration, navigation, and regional identity.",
    statistics: { regions: 5, locations: 16, cultures: 3, species: 5 },
    coverImageUrl: "https://picsum.photos/seed/vetra-cover/1280/720",
  },
  {
    id: "wld_karos",
    slug: "karos-deep",
    name: "Karos Deep",
    description: "A subterranean realm of carved kingdoms, geothermal corridors, and vault myths.",
    status: "archived",
    studio: "NabhaVerse Prime",
    tags: ["subterranean", "mythic"],
    favorite: false,
    updatedAt: "3d ago",
    version: "v2.1",
    timelineSummary: "Legacy continuity world preserved for reference and archival study.",
    statistics: { regions: 9, locations: 22, cultures: 2, species: 4 },
    coverImageUrl: "https://picsum.photos/seed/karos-cover/1280/720",
  },
];

export const mockWorldProfiles: WorldProfile[] = [
  {
    worldId: "wld_lunara",
    tone: "Luminous, civic, and mythic",
    scale: "Continental",
    era: "Age of Currents",
    corePremise: "Cities survive by negotiating with the tides and the memory of old sky routes.",
    signatureElements: ["Lantern harbors", "Sky conduits", "Treaty markets"],
  },
  {
    worldId: "wld_auric",
    tone: "Industrial, strategic, and storm-driven",
    scale: "Regional",
    era: "Frontier Ascendancy",
    corePremise:
      "Infrastructure is destiny when roads, archives, and weather control power everything.",
    signatureElements: ["Iron roads", "Archive towers", "Storm engines"],
  },
];

export const mockWorldVersions: WorldVersion[] = [
  {
    id: "ver_lunara_32",
    worldId: "wld_lunara",
    label: "v3.2",
    createdAt: "Today, 10:14",
    author: "Aarya Patel",
    summary: "Timeline summary updated and trade route map expanded.",
    active: true,
  },
  {
    id: "ver_lunara_31",
    worldId: "wld_lunara",
    label: "v3.1",
    createdAt: "Yesterday, 17:02",
    author: "Mina Das",
    summary: "Regional notes clarified for city-state diplomacy.",
    active: false,
  },
];

export const mockWorldAssets: WorldAsset[] = [
  {
    id: "ast_lunara_map",
    worldId: "wld_lunara",
    title: "Lunara Master Map",
    kind: "map",
    previewUrl: "https://picsum.photos/seed/lunara-map/640/420",
    updatedAt: "10m ago",
  },
  {
    id: "ast_lunara_chart",
    worldId: "wld_lunara",
    title: "Trade Route Atlas",
    kind: "document",
    previewUrl: "https://picsum.photos/seed/lunara-atlas/640/420",
    updatedAt: "1h ago",
  },
];

export const mockWorldRelationships: WorldRelationship[] = [
  {
    id: "rel_lunara_auric",
    worldId: "wld_lunara",
    relatedWorldId: "wld_auric",
    relatedName: "Auric Frontier",
    relationshipType: "trade",
    notes: "Overland trade lanes connect coastal archives to frontier manufacturing hubs.",
  },
  {
    id: "rel_lunara_vetra",
    worldId: "wld_lunara",
    relatedWorldId: "wld_vetra",
    relatedName: "Vetra Archipelago",
    relationshipType: "shared-history",
    notes: "Navigation traditions overlap through the old sky-route calendar.",
  },
];

const documentSeed: Record<WorldPluginId, string> = {
  overview: "World overview notes and creative direction.",
  geography: "Geography, terrain, and major environmental features.",
  locations: "Important locations, settlements, and landmarks.",
  regions: "Regional distinctions and boundaries.",
  kingdoms: "Political domains, rulers, and claims.",
  cities: "Urban centers, districts, and infrastructure.",
  landmarks: "Iconic structures, natural wonders, and symbols.",
  history: "Historical eras, major events, and continuity notes.",
  timeline: "Chronological summary and era markers.",
  culture: "Customs, art, and cultural identity.",
  languages: "Languages, dialects, and linguistic rules.",
  religion: "Belief systems, rituals, and sacred institutions.",
  government: "Governance models, institutions, and power structures.",
  economy: "Trade, currency, resources, and market flows.",
  technology: "Tech tiers, inventions, and constraints.",
  species: "Species profiles and inter-species dynamics.",
  organizations: "Organizations, factions, guilds, and alliances.",
  "magic-system": "Magic system rules, cost, and consequences.",
  rules: "World rules, limits, and consistency boundaries.",
  climate: "Climate zones, weather behavior, and seasonal shifts.",
  maps: "Map references, layer notes, and cartographic context.",
  assets: "Reference assets and supporting media.",
  documents: "Supporting documents, briefs, and lore references.",
  relationships: "World-to-world relationships and cross-world dependencies.",
  "version-history": "Version history and major revision moments.",
  comments: "Review feedback and collaborative notes.",
  activity: "Recent activity and editorial changes.",
};

export function mockWorldDocumentForPlugin(
  worldId: string,
  pluginId: WorldPluginId,
): WorldDocument {
  return {
    id: `doc_${worldId}_${pluginId}`,
    worldId,
    type: pluginId,
    title: pluginId
      .split("-")
      .map((segment) => `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`)
      .join(" "),
    markdown: `${documentSeed[pluginId]}\n\n- Draft section\n- Attachment placeholder\n- Save status placeholder`,
    versionLabel: "v3.2",
    saveStatus: "saved",
    hasUnsavedChanges: false,
    updatedAt: "15m ago",
  };
}
