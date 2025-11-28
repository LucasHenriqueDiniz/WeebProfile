/**
 * AnimeFavorites - Componente para exibir favorites completos de anime do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, FullAnimeFavorite } from '../types';
interface AnimeFavoritesProps {
    data: FullAnimeFavorite[];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function AnimeFavorites({ data, config, style, size }: AnimeFavoritesProps): React.ReactElement;
export {};
