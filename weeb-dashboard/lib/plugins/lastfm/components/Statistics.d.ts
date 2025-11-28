/**
 * Statistics - Shared component for LastFM statistics
 */
import React from 'react';
import type { LastFmData } from '../types';
interface StatisticsProps {
    data: LastFmData;
    config: {
        statistics_title?: string;
        statistics_hide_title?: boolean;
        statistics_hide_featured_track?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function Statistics({ data, config, style, size }: StatisticsProps): React.ReactElement;
export {};
