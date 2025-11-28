/**
 * FavoritesList - Componente unificado para exibir favoritos do MyAnimeList
 *
 * Suporta 4 estilos diferentes:
 * - simple: Grid de imagens (estilo antigo SimpleFavorites)
 * - compact: Lista compacta sem summary (estilo antigo CharactersFavorites/PeopleFavorites)
 * - detailed: Lista completa com summary (estilo antigo AnimeFavorites/MangaFavorites com summary)
 * - minimal: Lista sem summary (estilo antigo AnimeFavorites/MangaFavorites sem summary)
 */
import React from 'react';
import type { MyAnimeListConfig, FullAnimeFavorite, FullMangaFavorite, BasicCharacterFavorite, BasicPeopleFavorite } from '../types';
type FavoriteType = 'anime' | 'manga' | 'people' | 'characters';
type ListStyle = 'simple' | 'compact' | 'detailed' | 'minimal';
type FavoriteData = FullAnimeFavorite[] | FullMangaFavorite[] | BasicCharacterFavorite[] | BasicPeopleFavorite[];
interface FavoritesListProps {
    data: FavoriteData;
    type: FavoriteType;
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    listStyle?: ListStyle;
}
export declare function FavoritesList({ data, type, config, style, size, listStyle, }: FavoritesListProps): React.ReactElement;
export {};
