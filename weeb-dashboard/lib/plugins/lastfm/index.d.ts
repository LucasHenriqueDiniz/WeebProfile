/**
 * Plugin to show LastFM music statistics using the official API
 *
 * Essential configurations required:
 * - apiKey: LastFM API key (required)
 * - username: LastFM username (required, can be obtained via API or provided)
 */
import type { Plugin } from '../../weeb-plugins/plugins/shared/types/plugin';
import type { PluginData } from '../../weeb-plugins/types/index';
import type { LastFmConfig, LastFmData } from '../types';
export declare const lastFmPlugin: Plugin<LastFmConfig, PluginData & LastFmData>;
export default lastFmPlugin;
