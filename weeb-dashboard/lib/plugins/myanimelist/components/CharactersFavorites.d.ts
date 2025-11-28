/**
 * CharactersFavorites - Componente para exibir favorites de personagens do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, BasicCharacterFavorite } from '../types';
interface CharactersFavoritesProps {
    data: BasicCharacterFavorite[];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function CharactersFavorites({ data, config, style, size, }: CharactersFavoritesProps): React.ReactElement;
export {};
