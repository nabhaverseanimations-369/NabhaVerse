export interface CharacterReference {
  id: string;
  name: string;
  description: string;
}

export interface WorldReference {
  id: string;
  name: string;
  description: string;
}

export interface LocationReference {
  id: string;
  name: string;
  description: string;
  worldId?: string;
}

export interface AssetReference {
  id: string;
  name: string;
  description: string;
  kind?: string;
}

export interface EpisodeReference {
  id: string;
  name: string;
  description: string;
  season?: number;
  episodeNumber?: number;
}

export interface AIJobReference {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
}

export interface PromptReference {
  id: string;
  name: string;
  description: string;
  version: string;
}

export interface ModelReference {
  id: string;
  name: string;
  provider: string;
  description: string;
}
