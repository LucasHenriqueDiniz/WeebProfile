import { AnyMalFavorite, MalFavoritesResponse, MalFullFavoritesResponse } from "./malFavoritesResponse";
import { LastUpdatesAnime, LastUpdatesManga, MalLastUpdatesResponse } from "./malLastUpdatesResponse";
import { MalProfileResponse } from "./malProfileResponse";
import { AnimeStatistics, MangaStatistics, MalStatisticsResponse } from "./malStatisticsResponse";

interface LastUpdateItemProps {
  data: LastUpdatesAnime | LastUpdatesManga;
  stat: "anime" | "manga";
}

interface ClassicLastUpdatesProps {
  lastUpdatesData: LastUpdatesAnime[] | LastUpdatesManga[];
  username: string;
}

interface ClassicFavoritesProps {
  favoritesData: AnyMalFavorite;
  username: string;
  media: string;
}

interface ClassicProfileProps {
  statisticsData: AnimeStatistics | MangaStatistics;
  lastUpdatesData: LastUpdatesAnime[] | LastUpdatesManga[];
  username: string;
}

interface ProgressBarProps {
  value: number;
  total: number;
  status: string;
}

interface StatisticsBarProps {
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  planToWatch: number;
}

interface MalProfileBoxProps {
  title: string;
  secondTitle: string;
  secondTitleHref: string;
  children: JSX.Element;
}

interface MalProfileStatsProps {
  data: AnimeStatistics | MangaStatistics;
  userName: string;
}

interface MalData {
  favorites: MalFavoritesResponse;
  favorites_full: MalFullFavoritesResponse;
  last_updated: MalLastUpdatesResponse;
  statistics: MalStatisticsResponse;
}

interface MalImage {
  jpg?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
    base64?: string;
  };
  webp?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
}

export type {
  MalData,
  ClassicFavoritesProps,
  ClassicLastUpdatesProps,
  ClassicProfileProps,
  LastUpdateItemProps,
  MalProfileBoxProps,
  MalProfileStatsProps,
  ProgressBarProps,
  StatisticsBarProps,
  MalImage,
};
