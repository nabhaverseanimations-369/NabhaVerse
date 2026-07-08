export interface StudioSearchContract {
  query: string;
}

export interface StudioSearchIndexContract {
  title: string;
  description?: string;
  tags?: string[];
  owner?: string;
  studio?: string;
}
