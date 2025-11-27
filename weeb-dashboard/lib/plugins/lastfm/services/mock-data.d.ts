/**
 * Dados mock para desenvolvimento
 */
import type { LastFmData } from '../types';
export declare function getMockLastFmData(config?: {
    recent_tracks_max?: number;
    top_artists_max?: number;
    top_albums_max?: number;
    top_tracks_max?: number;
}): Promise<LastFmData>;
