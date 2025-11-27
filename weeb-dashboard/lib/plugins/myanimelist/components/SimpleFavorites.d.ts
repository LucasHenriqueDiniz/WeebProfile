/**
 * SimpleFavorites - Componente para exibir favorites simples do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, AnyMalFavorite } from '../types';
interface SimpleFavoritesProps {
    data: AnyMalFavorite;
    type: 'anime' | 'manga' | 'people' | 'characters';
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function SimpleFavorites({ data, type, config, style, size, }: SimpleFavoritesProps): React.ReactElement;
export {};
