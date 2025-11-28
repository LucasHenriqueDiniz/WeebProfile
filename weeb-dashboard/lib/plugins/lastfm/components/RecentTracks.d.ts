/**
 * RecentTracks - Componente para exibir faixas recentes do LastFM
 */
import React from 'react';
import type { LastFmTrack } from '../types';
interface RecentTracksProps {
    data: LastFmTrack[];
    interval?: string;
    config: {
        recent_tracks_max?: number;
        recent_tracks_title?: string;
        recent_tracks_hide_title?: boolean;
        hide_intervals?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function RecentTracks({ data, interval, config, style, size }: RecentTracksProps): React.ReactElement;
export {};
