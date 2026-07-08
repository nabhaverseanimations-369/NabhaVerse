import { mockCharacters } from "@/features/character/data/character-mocks";
import { mockWorlds } from "@/features/world/data/world-mocks";

import type {
  Episode,
  EpisodeReferenceItem,
  EpisodeScene,
  EpisodeShot,
} from "@/features/episode/types/episode.types";

const aurora = mockCharacters.find((character) => character.id === "chr_aurora");
const nox = mockCharacters.find((character) => character.id === "chr_nox7");
const lyra = mockCharacters.find((character) => character.id === "chr_lyra");
const zeno = mockCharacters.find((character) => character.id === "chr_zeno");

const lunara = mockWorlds.find((world) => world.id === "wld_lunara");
const auric = mockWorlds.find((world) => world.id === "wld_auric");

function createScenes(prefix: string): EpisodeScene[] {
  return [
    {
      id: `${prefix}_scene_01`,
      sceneNumber: "1",
      title: "Opening pressure",
      status: "approved",
      characters: [aurora?.name ?? "Aurora Vale", nox?.name ?? "Nox-7"],
      locations: [lunara?.name ?? "Lunara Basin"],
      estimatedDuration: "01:20",
      summary: "The crew receives the opening warning while the horizon shifts.",
      order: 1,
    },
    {
      id: `${prefix}_scene_02`,
      sceneNumber: "2",
      title: "Cross-route negotiation",
      status: "draft",
      characters: [lyra?.name ?? "Lyra Stone", zeno?.name ?? "Zeno Rhyl"],
      locations: [auric?.name ?? "Auric Frontier"],
      estimatedDuration: "02:10",
      summary: "Strategic conflict escalates between competing route planners.",
      order: 2,
    },
    {
      id: `${prefix}_scene_03`,
      sceneNumber: "3",
      title: "Quiet aftermath",
      status: "planned",
      characters: [aurora?.name ?? "Aurora Vale"],
      locations: [lunara?.name ?? "Lunara Basin"],
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

export const mockEpisodeReferences: readonly EpisodeReferenceItem[] = [
  {
    id: "ref_aurora",
    title: aurora?.name ?? "Aurora Vale",
    subtitle: "Primary lead from Character Studio",
    href: "/creative/characters",
  },
  {
    id: "ref_lunara",
    title: lunara?.name ?? "Lunara Basin",
    subtitle: "Reference world from World Studio",
    href: "/creative/worlds",
  },
  {
    id: "ref_auric",
    title: auric?.name ?? "Auric Frontier",
    subtitle: "Cross-world strategic backdrop",
    href: "/creative/worlds",
  },
];

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
    characterIds: ["chr_aurora", "chr_nox7", "chr_lyra"],
    worldIds: ["wld_lunara"],
    locationNames: ["Skyport Relay", "Lantern Causeway"],
    propNames: ["Signal Beacon", "Route Map", "Emergency Seal"],
    assetNames: ["Thumbnail Sheet", "Tempo Board", "Dialogue Cards"],
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
    characterIds: ["chr_aurora", "chr_zeno"],
    worldIds: ["wld_auric"],
    locationNames: ["Storm Archive", "Frontier Bridge"],
    propNames: ["Pressure Gauge", "Route Lantern"],
    assetNames: ["Storyboard Thumbnail Sheet", "Script Blocks", "Audio Notes"],
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
    characterIds: ["chr_aurora", "chr_nox7", "chr_lyra", "chr_serin"],
    worldIds: ["wld_lunara", "wld_auric"],
    locationNames: ["Lantern Harbor", "Archive Concourse"],
    propNames: ["Transit Key", "Signal Prism", "Timeline Slate"],
    assetNames: ["Shot Pack", "Continuity Grid", "Reference Boards"],
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
    characterIds: ["chr_toma", "chr_aurora"],
    worldIds: ["wld_vetra"],
    locationNames: ["Glass Dock", "Tide Archive"],
    propNames: ["Legacy Slate", "Currents Lens"],
    assetNames: ["Reference Comp", "Legacy Board"],
    notes: "No new production work; preserve as reference-only episode.",
    scenes: createScenes("eps_022"),
    shots: createShots("eps_022"),
  },
];
