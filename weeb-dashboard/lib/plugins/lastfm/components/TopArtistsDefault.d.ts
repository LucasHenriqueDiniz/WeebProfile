/**
 * TopArtistsDefault - Componente para exibir top artists do LastFM em formato default
 */
import React from 'react';
import type { LastFmArtist } from '../types';
interface TopArtistsDefaultProps {
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
export declare function TopArtistsDefault({ data, interval, config, style, size }: TopArtistsDefaultProps): React.ReactElement;
export {};
