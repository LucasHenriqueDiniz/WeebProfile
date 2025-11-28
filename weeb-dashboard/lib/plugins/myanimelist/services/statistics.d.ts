/**
 * Serviço para transformar estatísticas do MyAnimeList
 */
import type { AnimeStatistics, MangaStatistics } from '../types';
export interface JikanStatisticsResponse {
    anime: {
        days_watched: number;
        mean_score: number | null;
        watching: number;
        completed: number;
        on_hold: number;
        dropped: number;
        plan_to_watch: number;
        total_entries: number;
        rewatched: number;
        episodes_watched: number;
    };
    manga: {
        days_read: number;
        mean_score: number | null;
        reading: number;
        completed: number;
        on_hold: number;
        dropped: number;
        plan_to_read: number;
        total_entries: number;
        reread: number;
        chapters_read: number;
        volumes_read: number;
    };
}
/**
 * Transforma a resposta da API em formato interno
 */
export declare function transformStatistics(response: JikanStatisticsResponse): {
    anime: AnimeStatistics;
    manga: MangaStatistics;
};
