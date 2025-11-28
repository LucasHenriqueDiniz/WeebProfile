/**
 * MyAnimeList Plugin V2
 *
 * Plugin para exibir estatísticas do MyAnimeList
 *
 * TODO: Completar migração do source original
 */
import type { Plugin } from '../../weeb-plugins/plugins/shared/types/plugin';
import type { PluginConfig, PluginData } from '../../weeb-plugins/types/index';
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
export declare const myAnimeListPlugin: Plugin<PluginConfig & MyAnimeListConfig, PluginData & MyAnimeListData>;
export default myAnimeListPlugin;
