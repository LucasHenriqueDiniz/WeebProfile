/**
 * TopAlbumsGrid - Componente para exibir top albums do LastFM em formato grid
 */
import React from 'react';
import type { LastFmAlbum } from '../types';
interface TopAlbumsGridProps {
    data: LastFmAlbum[];
    interval?: string;
    config: {
        top_albums_max?: number;
        top_albums_title?: string;
        top_albums_hide_title?: boolean;
        hide_intervals?: boolean;
        top_albums_interval_text?: string;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopAlbumsGrid({ data, interval, config, style, size }: TopAlbumsGridProps): React.ReactElement;
export {};
