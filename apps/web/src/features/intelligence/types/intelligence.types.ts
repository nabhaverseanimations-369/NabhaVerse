import type {
  CommandReference,
  InsightReference,
  RecommendationReference,
  SearchResultReference,
  StudioSearchCategory,
  StudioSearchProvider,
} from "@nabhaverse/studio-sdk";

export type IntelligenceStudioCategory = Exclude<
  StudioSearchCategory,
  "navigation" | "documentation" | "command"
>;

export interface IntelligenceSearchResult extends SearchResultReference {
  tags: readonly string[];
  owner?: string;
  studioLabel: string;
  sourceProvider: string;
  favorited?: boolean;
}

export interface IntelligenceSavedSearch {
  id: string;
  name: string;
  query: string;
  category: StudioSearchCategory | "all";
  tags: readonly string[];
  lastUsedAt: string;
  pinned: boolean;
}

export interface IntelligenceInsight extends InsightReference {
  detail: string;
}

export interface IntelligenceRecommendation extends RecommendationReference {
  href?: string;
  category: StudioSearchCategory;
}

export interface IntelligenceActivityItem {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  studio: IntelligenceStudioCategory | "navigation";
  actor: string;
  href?: string;
}

export interface PlatformHealthMetric {
  id: string;
  title: string;
  status: "healthy" | "watch" | "at-risk";
  summary: string;
}

export interface IntelligenceQuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface PersonalWorkspaceItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface IntelligenceDashboardState {
  globalActivity: readonly IntelligenceActivityItem[];
  recentlyOpened: readonly IntelligenceSearchResult[];
  recommendedItems: readonly IntelligenceRecommendation[];
  savedSearches: readonly IntelligenceSavedSearch[];
  insights: readonly IntelligenceInsight[];
  platformHealth: readonly PlatformHealthMetric[];
  quickActions: readonly IntelligenceQuickAction[];
  personalWorkspace: readonly PersonalWorkspaceItem[];
  searchHistory: readonly string[];
}

export interface IntelligenceActivityProvider {
  id: string;
  studio: IntelligenceStudioCategory | "navigation";
  listActivity: () => Promise<readonly IntelligenceActivityItem[]>;
}

export interface IntelligenceCommand extends CommandReference {
  keywords: readonly string[];
  href?: string;
  favorite?: boolean;
  recent?: boolean;
  studio?: string;
}

export interface IntelligenceSearchPanelState {
  query: string;
  category: StudioSearchCategory | "all";
  selectedTags: readonly string[];
}

export interface IntelligenceSearchProviderBundle {
  providers: readonly StudioSearchProvider[];
  results: readonly IntelligenceSearchResult[];
}
