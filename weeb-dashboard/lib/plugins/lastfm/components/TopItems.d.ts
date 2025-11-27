/**
 * TopItems - Componente genérico para exibir top items do LastFM (Artists, Albums, Tracks)
 * Renderiza Grid, List ou Default baseado no displayStyle
 */
import React from 'react';
import type { GridItemProps, ListItemProps } from '../../../weeb-plugins/templates/types';
import type { IconType } from 'react-icons';
interface TopItem {
    image?: string;
    artist?: string;
    totalPlays?: string;
    album?: string;
    plays?: string;
    track?: string;
}
interface TopItemsProps {
    data: TopItem[];
    interval?: string;
    config: {
        max?: number;
        title?: string;
        hide_title?: boolean;
        hide_intervals?: boolean;
    };
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
    displayStyle: 'grid' | 'list' | 'default';
    sectionId: string;
    sectionName: string;
    icon: IconType;
    terminalLabels: {
        rightText: string;
        centerText?: string;
        leftText: string;
    };
    mapToGridItem: (item: TopItem) => GridItemProps;
    mapToListItem: (item: TopItem) => ListItemProps;
}
export declare function TopItems({ data, interval, config, style, size, displayStyle, sectionId, sectionName, icon: Icon, terminalLabels, mapToGridItem, mapToListItem, }: TopItemsProps): React.ReactElement;
export {};
