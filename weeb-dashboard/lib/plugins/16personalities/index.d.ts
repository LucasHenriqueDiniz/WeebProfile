/**
 * 16personalities Plugin V2
 *
 * Plugin to display 16personalities data
 */
import type { Plugin } from '../../weeb-plugins/plugins/shared/types/plugin';
import type { PluginData } from '../../weeb-plugins/types/index';
import type { Personality16Config, Personality16Data } from '../types';
/**
 * 16personalities Plugin
 *
 * No essential configuration keys needed
 */
export declare const personality16Plugin: Plugin<Personality16Config, PluginData & Personality16Data>;
export default personality16Plugin;
