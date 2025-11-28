/**
 * GitHub Plugin V2
 *
 * Plugin para exibir estatísticas do GitHub
 */
import type { Plugin } from '../types';
import type { PluginConfig, PluginData } from '../../weeb-plugins/types/index';
import type { GithubConfig, GithubData } from '../types';
export declare const githubPlugin: Plugin<PluginConfig & GithubConfig, PluginData & GithubData>;
export default githubPlugin;
