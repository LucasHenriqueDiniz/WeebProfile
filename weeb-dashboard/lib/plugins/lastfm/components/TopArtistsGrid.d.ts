/**
 * TopArtistsGrid - Componente para exibir top artists do LastFM em formato grid
 */
import React from 'react';
import type { LastFmArtist } from '../types';
interface TopArtistsGridProps {
    data: LastFmArtist[];
    interval?: string;
    config: {
        top_artists_max?: number;
        top_artists_title?: string;
        top_artists_hide_title?: boolean;
        hide_intervals?: boolean;
        top_artists_interval_text?: string;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopArtistsGrid({ data, interval, config, style, size }: TopArtistsGridProps): React.ReactElement;
export {};
