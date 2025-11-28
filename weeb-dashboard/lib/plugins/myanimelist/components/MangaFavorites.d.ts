/**
 * MangaFavorites - Componente para exibir favorites completos de manga do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, FullMangaFavorite } from '../types';
interface MangaFavoritesProps {
    data: FullMangaFavorite[];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function MangaFavorites({ data, config, style, size }: MangaFavoritesProps): React.ReactElement;
export {};
