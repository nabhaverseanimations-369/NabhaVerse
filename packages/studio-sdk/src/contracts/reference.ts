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
