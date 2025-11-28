/**
 * Serviço de fetch de dados do LastFM via API oficial
 *
 * Documentação: https://www.last.fm/api
 */
import type { LastFmData } from '../types';
/**
 * Busca todos os dados do LastFM via API
 */
export declare function fetchLastFmDataFromApi(apiKey: string, username: string, config: {
    recent_tracks_max?: number;
    top_artists_max?: number;
    top_albums_max?: number;
    top_tracks_max?: number;
    top_artists_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
    top_albums_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
    top_tracks_period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
    sections: string[];
}): Promise<LastFmData>;
