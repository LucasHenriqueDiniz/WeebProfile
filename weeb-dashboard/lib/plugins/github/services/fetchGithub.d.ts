/**
 * Serviço de fetch de dados do GitHub
 *
 * Migrado do source original, adaptado para source-v2
 */
import type { GithubConfig, GithubData } from '../types';
/**
 * Busca dados do GitHub
 *
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock, ignora token)
 * @param pat - GitHub Classic Token do usuário (obrigatório em produção)
 */
export declare function fetchGithubData(config: GithubConfig, dev?: boolean, pat?: string): Promise<GithubData>;
