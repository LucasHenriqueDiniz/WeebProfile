/**
 * TopTracksDefault - Componente para exibir top tracks do LastFM em formato default
 */
import React from 'react';
import type { TopTrack } from '../types';
interface TopTracksDefaultProps {
    data: TopTrack[];
    interval?: string;
    config: {
        top_tracks_max?: number;
        top_tracks_title?: string;
        top_tracks_hide_title?: boolean;
        hide_intervals?: boolean;
        top_tracks_interval_text?: string;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function TopTracksDefault({ data, interval, config, style, size }: TopTracksDefaultProps): React.ReactElement;
export {};
