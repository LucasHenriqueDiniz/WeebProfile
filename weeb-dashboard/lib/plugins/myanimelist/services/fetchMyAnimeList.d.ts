/**
 * Serviço principal para buscar dados do MyAnimeList
 */
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
/**
 * Busca dados do MyAnimeList
 *
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock)
 */
export declare function fetchMyAnimeListData(config: MyAnimeListConfig, dev?: boolean): Promise<MyAnimeListData>;
