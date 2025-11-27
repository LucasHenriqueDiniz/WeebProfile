/**
 * Serviço para buscar e processar favoritos do MyAnimeList
 */
import type { BasicAnimeFavorite, BasicMangaFavorite, BasicCharacterFavorite, BasicPeopleFavorite, FullAnimeFavorite, FullMangaFavorite } from '../types';
import type { MalProfileResponse } from './profile';
import type { MyAnimeListConfig } from '../types';
export interface BasicFavorites {
    anime: BasicAnimeFavorite[];
    manga: BasicMangaFavorite[];
    characters: BasicCharacterFavorite[];
    people: BasicPeopleFavorite[];
}
export interface FullFavorites {
    anime: FullAnimeFavorite[];
    manga: FullMangaFavorite[];
    characters: BasicCharacterFavorite[];
    people: BasicPeopleFavorite[];
}
/**
 * Busca favoritos básicos do perfil
 */
export declare function getBasicFavorites(profile: MalProfileResponse, limits: {
    animeMax: number;
    mangaMax: number;
    charactersMax: number;
    peopleMax: number;
}): Promise<BasicFavorites>;
/**
 * Busca dados completos dos favoritos (anime e manga)
 */
export declare function getFullFavorites(basicFavorites: BasicFavorites, sections: string[]): Promise<FullFavorites>;
/**
 * Busca todos os favoritos (básicos e completos)
 */
export declare function fetchFavorites(profile: MalProfileResponse, config: MyAnimeListConfig): Promise<{
    basic: BasicFavorites;
    full: FullFavorites;
}>;
