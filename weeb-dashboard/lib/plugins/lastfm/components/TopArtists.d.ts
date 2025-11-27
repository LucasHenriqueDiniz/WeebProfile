/**
 * TopArtists - Componente unificado para exibir top artists do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_artists_style
 */
import React from 'react';
import type { LastFmArtist } from '../types';
interface TopArtistsProps {
    data: LastFmArtist[];
    interval?: string;
    config: {
        top_artists_max?: number;
        top_artists_title?: string;
        top_artists_hide_title?: boolean;
        top_artists_style?: 'grid' | 'list' | 'default';
        hide_intervals?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopArtists({ data, interval, config, style, size }: TopArtistsProps): React.ReactElement;
export {};
