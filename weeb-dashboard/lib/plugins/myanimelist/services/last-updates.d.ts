/**
 * Serviço para processar últimas atualizações do MyAnimeList
 */
import type { MalLastUpdates } from '../types';
import type { MalProfileResponse } from './profile';
import type { MyAnimeListConfig } from '../types';
/**
 * Transforma as atualizações do perfil em formato interno
 */
export declare function transformLastUpdates(profile: MalProfileResponse, config: MyAnimeListConfig): Promise<MalLastUpdates>;
