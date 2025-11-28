/**
 * Serviço de fetch de dados do LastFM
 *
 * Usa a API oficial do LastFM (https://www.last.fm/api)
 */
import type { LastFmConfig, LastFmData } from '../types';
import type { EssentialPluginConfig } from '../../../weeb-plugins/plugins/shared/types/base';
/**
 * Busca dados do LastFM
 *
 * @param config - Configuração do plugin (inclui enabled, sections, nonEssential)
 * @param dev - Modo desenvolvimento (usa dados mock)
 * @param essentialConfig - Configurações essenciais (API key, username) vindas do perfil
 */
export declare function fetchLastFmData(config: LastFmConfig, dev?: boolean, essentialConfig?: EssentialPluginConfig): Promise<LastFmData>;
