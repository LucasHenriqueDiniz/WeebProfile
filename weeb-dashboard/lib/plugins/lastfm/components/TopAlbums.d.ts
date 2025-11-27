/**
 * TopAlbums - Componente unificado para exibir top albums do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_albums_style
 */
import React from 'react';
import type { LastFmAlbum } from '../types';
interface TopAlbumsProps {
    data: LastFmAlbum[];
    interval?: string;
    config: {
        top_albums_max?: number;
        top_albums_title?: string;
        top_albums_hide_title?: boolean;
        top_albums_style?: 'grid' | 'list' | 'default';
        hide_intervals?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopAlbums({ data, interval, config, style, size }: TopAlbumsProps): React.ReactElement;
export {};
