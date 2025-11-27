/**
 * TopTracks - Componente unificado para exibir top tracks do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_tracks_style
 */
import React from 'react';
import type { TopTrack } from '../types';
interface TopTracksProps {
    data: TopTrack[];
    interval?: string;
    config: {
        top_tracks_max?: number;
        top_tracks_title?: string;
        top_tracks_hide_title?: boolean;
        top_tracks_style?: 'grid' | 'list' | 'default';
        hide_intervals?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopTracks({ data, interval, config, style, size }: TopTracksProps): React.ReactElement;
export {};
