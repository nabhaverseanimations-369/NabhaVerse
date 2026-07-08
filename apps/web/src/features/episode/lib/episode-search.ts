import type {
  Episode,
  EpisodeLibraryFilters,
  EpisodeSeasonGroup,
  EpisodeStatus,
} from "@/features/episode/types/episode.types";
import { includesQueryFromFields, paginateItems } from "@nabhaverse/studio-sdk";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function statusOrder(status: EpisodeStatus): number {
  switch (status) {
    case "approved":
      return 0;
    case "in-review":
      return 1;
    case "draft":
      return 2;
    case "archived":
      return 3;
    default:
      return 99;
  }
}

function includesEpisodeQuery(episode: Episode, query: string): boolean {
  return includesQueryFromFields(
    [episode.title, episode.owner, episode.studio, episode.summary, ...episode.tags],
    query,
  );
}

export function filterAndSortEpisodes(
  episodes: readonly Episode[],
  filters: EpisodeLibraryFilters,
): Episode[] {
  const filtered = episodes.filter((episode) => {
    if (!includesEpisodeQuery(episode, filters.query)) {
      return false;
    }
    if (filters.tags.length > 0 && !filters.tags.every((tag) => episode.tags.includes(tag))) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(episode.status)) {
      return false;
    }
    if (filters.favoritesOnly && !episode.favorite) {
      return false;
    }
    if (filters.recentOnly && !episode.recentlyOpenedAt) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sortBy) {
      case "name":
        return collator.compare(left.title, right.title);
      case "status":
        return statusOrder(left.status) - statusOrder(right.status);
      case "recent": {
        const leftRecent = left.recentlyOpenedAt ? 0 : 1;
        const rightRecent = right.recentlyOpenedAt ? 0 : 1;
        if (leftRecent !== rightRecent) {
          return leftRecent - rightRecent;
        }
        return collator.compare(left.title, right.title);
      }
      case "episodeNumber":
        return left.episodeNumber - right.episodeNumber;
      case "season":
        return left.season - right.season || left.episodeNumber - right.episodeNumber;
      case "updatedAt":
      default:
        return collator.compare(left.updatedAt, right.updatedAt);
    }
  });
}

export function paginateEpisodes(
  episodes: readonly Episode[],
  page: number,
  pageSize: number,
): { items: Episode[]; hasNextPage: boolean } {
  return paginateItems(episodes, page, pageSize);
}

export function groupEpisodesBySeason(episodes: readonly Episode[]): EpisodeSeasonGroup[] {
  const seasons = new Map<number, Episode[]>();

  for (const episode of episodes) {
    const seasonEpisodes = seasons.get(episode.season) ?? [];
    seasonEpisodes.push(episode);
    seasons.set(episode.season, seasonEpisodes);
  }

  return [...seasons.entries()]
    .sort(([leftSeason], [rightSeason]) => leftSeason - rightSeason)
    .map(([season, seasonEpisodes]) => ({
      season,
      episodes: seasonEpisodes.sort((left, right) => left.episodeNumber - right.episodeNumber),
    }));
}
