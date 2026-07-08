import type {
  AssetReference,
  CharacterReference,
  LocationReference,
  WorldReference,
} from "@nabhaverse/studio-sdk";

import type { Episode, EpisodeScene, EpisodeShot } from "@/features/episode/types/episode.types";

const auroraReference: CharacterReference = {
  id: "chr_aurora",
  name: "Aurora Vale",
  description: "Primary lead from Character Studio",
};

const noxReference: CharacterReference = {
  id: "chr_nox7",
  name: "Nox-7",
  description: "Stability specialist and field support",
};

const lyraReference: CharacterReference = {
  id: "chr_lyra",
  name: "Lyra Stone",
  description: "Strategic planner and systems observer",
};

const zenoReference: CharacterReference = {
  id: "chr_zeno",
  name: "Zeno Rhyl",
  description: "Route analyst with cross-team context",
};

const serinReference: CharacterReference = {
  id: "chr_serin",
  name: "Serin Vale",
  description: "Bridge lead and continuity coordinator",
};

const tomaReference: CharacterReference = {
  id: "chr_toma",
  name: "Toma Reed",
  description: "Archive specialist and historical consultant",
};

const lunaraReference: WorldReference = {
  id: "wld_lunara",
  name: "Lunara Basin",
  description: "Reference world from World Studio",
};

const auricReference: WorldReference = {
  id: "wld_auric",
  name: "Auric Frontier",
  description: "Cross-world strategic backdrop",
};

const vetraReference: WorldReference = {
  id: "wld_vetra",
  name: "Vetra Expanse",
  description: "Legacy world preserved for continuity",
};

const skyportRelayReference: LocationReference = {
  id: "loc_skyport_relay",
  name: "Skyport Relay",
  description: "Opening route corridor for the episode",
  worldId: lunaraReference.id,
};

const lanternCausewayReference: LocationReference = {
  id: "loc_lantern_causeway",
  name: "Lantern Causeway",
  description: "Transit link between the basin and relay",
  worldId: lunaraReference.id,
};

const stormArchiveReference: LocationReference = {
  id: "loc_storm_archive",
  name: "Storm Archive",
  description: "Research corridor used for route planning",
  worldId: auricReference.id,
};

const frontierBridgeReference: LocationReference = {
  id: "loc_frontier_bridge",
  name: "Frontier Bridge",
  description: "Season bridge location for negotiation scenes",
  worldId: auricReference.id,
};

const lanternHarborReference: LocationReference = {
  id: "loc_lantern_harbor",
  name: "Lantern Harbor",
  description: "Cross-world arrival point for the season arc",
  worldId: lunaraReference.id,
};

const archiveConcourseReference: LocationReference = {
  id: "loc_archive_concourse",
  name: "Archive Concourse",
  description: "Planning zone for route and continuity reviews",
  worldId: auricReference.id,
};

const glassDockReference: LocationReference = {
  id: "loc_glass_dock",
  name: "Glass Dock",
  description: "Archived world reference for continuity",
  worldId: vetraReference.id,
};

const tideArchiveReference: LocationReference = {
  id: "loc_tide_archive",
  name: "Tide Archive",
  description: "Legacy archive location for reference-only use",
  worldId: vetraReference.id,
};

const signalBeaconReference: AssetReference = {
  id: "asset_signal_beacon",
  name: "Signal Beacon",
  description: "Continuity prop used in the opening episode",
  kind: "prop",
};

const routeMapReference: AssetReference = {
  id: "asset_route_map",
  name: "Route Map",
  description: "Planning asset for route navigation",
  kind: "prop",
};

const emergencySealReference: AssetReference = {
  id: "asset_emergency_seal",
  name: "Emergency Seal",
  description: "Episode prop used during route lockdown beats",
  kind: "prop",
};

const pressureGaugeReference: AssetReference = {
  id: "asset_pressure_gauge",
  name: "Pressure Gauge",
  description: "Reference prop for route tension scenes",
  kind: "prop",
};

const routeLanternReference: AssetReference = {
  id: "asset_route_lantern",
  name: "Route Lantern",
  description: "Light source used for planning boards",
  kind: "prop",
};

const storyboardThumbnailSheetReference: AssetReference = {
  id: "asset_storyboard_thumbnail_sheet",
  name: "Storyboard Thumbnail Sheet",
  description: "Storyboard asset for scene framing",
  kind: "asset",
};

const scriptBlocksReference: AssetReference = {
  id: "asset_script_blocks",
  name: "Script Blocks",
  description: "Draft script asset for editorial review",
  kind: "asset",
};

const audioNotesReference: AssetReference = {
  id: "asset_audio_notes",
  name: "Audio Notes",
  description: "Reference asset for voice and timing notes",
  kind: "asset",
};

const transitKeyReference: AssetReference = {
  id: "asset_transit_key",
  name: "Transit Key",
  description: "Season bridge prop with handoff continuity",
  kind: "prop",
};

const signalPrismReference: AssetReference = {
  id: "asset_signal_prism",
  name: "Signal Prism",
  description: "Reference asset for broadcast and route scenes",
  kind: "prop",
};

const timelineSlateReference: AssetReference = {
  id: "asset_timeline_slate",
  name: "Timeline Slate",
  description: "Planning asset for continuity tracking",
  kind: "asset",
};

const shotPackReference: AssetReference = {
  id: "asset_shot_pack",
  name: "Shot Pack",
  description: "Storyboard and production reference bundle",
  kind: "asset",
};

const continuityGridReference: AssetReference = {
  id: "asset_continuity_grid",
  name: "Continuity Grid",
  description: "Reference sheet for series alignment",
  kind: "asset",
};

const referenceBoardsReference: AssetReference = {
  id: "asset_reference_boards",
  name: "Reference Boards",
  description: "Production reference bundle for the season bridge",
  kind: "asset",
};

const legacySlateReference: AssetReference = {
  id: "asset_legacy_slate",
  name: "Legacy Slate",
  description: "Archive prop retained for continuity",
  kind: "prop",
};

const currentsLensReference: AssetReference = {
  id: "asset_currents_lens",
  name: "Currents Lens",
  description: "Legacy production asset kept for reference",
  kind: "asset",
};

const referenceCompReference: AssetReference = {
  id: "asset_reference_comp",
  name: "Reference Comp",
  description: "Archived composition board for review",
  kind: "asset",
};

const legacyBoardReference: AssetReference = {
  id: "asset_legacy_board",
  name: "Legacy Board",
  description: "Reference board retained for archive context",
  kind: "asset",
};

function createScenes(prefix: string): EpisodeScene[] {
  return [
    {
      id: `${prefix}_scene_01`,
      sceneNumber: "1",
      title: "Opening pressure",
      status: "approved",
      characters: [auroraReference.name, noxReference.name],
      locations: [lunaraReference.name],
      estimatedDuration: "01:20",
      summary: "The crew receives the opening warning while the horizon shifts.",
      order: 1,
    },
    {
      id: `${prefix}_scene_02`,
      sceneNumber: "2",
      title: "Cross-route negotiation",
      status: "draft",
      characters: [lyraReference.name, zenoReference.name],
      locations: [auricReference.name],
      estimatedDuration: "02:10",
      summary: "Strategic conflict escalates between competing route planners.",
      order: 2,
    },
    {
      id: `${prefix}_scene_03`,
      sceneNumber: "3",
      title: "Quiet aftermath",
      status: "planned",
      characters: [auroraReference.name],
      locations: [lunaraReference.name],
      estimatedDuration: "00:55",
      summary: "A reflective beat closes the episode with a new mission hook.",
      order: 3,
    },
  ];
}

function createShots(prefix: string): EpisodeShot[] {
  return [
    {
      id: `${prefix}_shot_01`,
      shotNumber: "01",
      title: "Establishing skyline",
      cameraNotes: "Wide lens, gentle tilt up, hold for title reveal.",
      timing: "00:08",
      comments: "Keep silhouettes readable for composition notes.",
      thumbnailLabel: "Shot 01",
    },
    {
      id: `${prefix}_shot_02`,
      shotNumber: "02",
      title: "Reaction close-up",
      cameraNotes: "Push in slowly with shallow depth of field.",
      timing: "00:12",
      comments: "Fallback to static pose if rig availability changes.",
      thumbnailLabel: "Shot 02",
    },
    {
      id: `${prefix}_shot_03`,
      shotNumber: "03",
      title: "Team move-out",
      cameraNotes: "Medium tracking shot across corridor motion.",
      timing: "00:10",
      comments: "Use placeholder motion notes only; no render pass required.",
      thumbnailLabel: "Shot 03",
    },
  ];
}

export const mockEpisodes: Episode[] = [
  {
    id: "eps_012",
    slug: "rift-wake",
    title: "Rift Wake",
    episodeNumber: 12,
    season: 1,
    status: "in-review",
    owner: "Aarya Patel",
    studio: "NabhaVerse Prime",
    tags: ["pilot-arc", "team-dynamics", "rift"],
    favorite: true,
    recentlyOpenedAt: "4m ago",
    updatedAt: "12m ago",
    version: "v1.8",
    estimatedDuration: "22m",
    summary: "The crew follows a fracture line into a contested rescue route.",
    recentActivity: ["Storyboard draft reviewed", "Script pass updated", "Scene 3 approved"],
    characters: [auroraReference, noxReference, lyraReference],
    worlds: [lunaraReference],
    locations: [skyportRelayReference, lanternCausewayReference],
    props: [signalBeaconReference, routeMapReference, emergencySealReference],
    assets: [
      storyboardThumbnailSheetReference,
      {
        id: "asset_tempo_board",
        name: "Tempo Board",
        description: "Timing reference asset for episode beats",
        kind: "asset",
      },
      {
        id: "asset_dialogue_cards",
        name: "Dialogue Cards",
        description: "Character dialogue reference bundle",
        kind: "asset",
      },
    ],
    notes: "Use the episode to lock tone and keep visual beats aligned with the opening arc.",
    scenes: createScenes("eps_012"),
    shots: createShots("eps_012"),
  },
  {
    id: "eps_013",
    slug: "ember-tide",
    title: "Ember Tide",
    episodeNumber: 13,
    season: 1,
    status: "draft",
    owner: "Mina Das",
    studio: "NabhaVerse Prime",
    tags: ["strategy", "stormline", "team-dynamics"],
    favorite: false,
    recentlyOpenedAt: "1h ago",
    updatedAt: "2h ago",
    version: "v0.9",
    estimatedDuration: "24m",
    summary: "Negotiation pressure rises as the team repositions for a wider conflict.",
    recentActivity: ["Script placeholder expanded", "Locations mapped", "Character cast linked"],
    characters: [auroraReference, zenoReference],
    worlds: [auricReference],
    locations: [stormArchiveReference, frontierBridgeReference],
    props: [pressureGaugeReference, routeLanternReference],
    assets: [storyboardThumbnailSheetReference, scriptBlocksReference, audioNotesReference],
    notes: "Emphasize route conflict and keep camera language bold.",
    scenes: createScenes("eps_013"),
    shots: createShots("eps_013"),
  },
  {
    id: "eps_021",
    slug: "lantern-line",
    title: "Lantern Line",
    episodeNumber: 21,
    season: 2,
    status: "approved",
    owner: "Ravi Khanna",
    studio: "NabhaVerse Prime",
    tags: ["season-two", "world-bridge", "ensemble"],
    favorite: true,
    recentlyOpenedAt: "32m ago",
    updatedAt: "48m ago",
    version: "v2.1",
    estimatedDuration: "23m",
    summary: "A cross-world corridor becomes the hinge point for the season bridge episode.",
    recentActivity: [
      "Final scene list reviewed",
      "Storyboard blockers resolved",
      "Version history updated",
    ],
    characters: [auroraReference, noxReference, lyraReference, serinReference],
    worlds: [lunaraReference, auricReference],
    locations: [lanternHarborReference, archiveConcourseReference],
    props: [transitKeyReference, signalPrismReference, timelineSlateReference],
    assets: [shotPackReference, continuityGridReference, referenceBoardsReference],
    notes: "Keep bridge visuals modular for later asset reuse.",
    scenes: createScenes("eps_021"),
    shots: createShots("eps_021"),
  },
  {
    id: "eps_022",
    slug: "glass-current",
    title: "Glass Current",
    episodeNumber: 22,
    season: 2,
    status: "archived",
    owner: "Leena Roy",
    studio: "NabhaVerse Prime",
    tags: ["archive", "legacy", "reference"],
    favorite: false,
    updatedAt: "3d ago",
    version: "v1.0",
    estimatedDuration: "21m",
    summary: "A legacy episode retained for continuity and production reference.",
    recentActivity: ["Archive notes imported", "Comments closed", "Shot list frozen"],
    characters: [tomaReference, auroraReference],
    worlds: [vetraReference],
    locations: [glassDockReference, tideArchiveReference],
    props: [legacySlateReference, currentsLensReference],
    assets: [referenceCompReference, legacyBoardReference],
    notes: "No new production work; preserve as reference-only episode.",
    scenes: createScenes("eps_022"),
    shots: createShots("eps_022"),
  },
];
