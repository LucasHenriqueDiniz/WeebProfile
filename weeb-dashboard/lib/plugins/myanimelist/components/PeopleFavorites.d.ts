/**
 * PeopleFavorites - Componente para exibir favorites de pessoas do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, BasicPeopleFavorite } from '../types';
interface PeopleFavoritesProps {
    data: BasicPeopleFavorite[];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function PeopleFavorites({ data, config, style, size }: PeopleFavoritesProps): React.ReactElement;
export {};
