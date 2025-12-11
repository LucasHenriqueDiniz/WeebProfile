/**
 * Plugin registry
 */

export { PluginManager } from './manager'
export type { Plugin } from './types'
export type { PluginRegistry as PluginRegistryType } from './types'
export { githubPlugin } from './github/index'
export { lastFmPlugin } from './lastfm/index'
export { myAnimeListPlugin } from './myanimelist/index'
export { personality16Plugin } from './16personalities/index'
export { lyftaPlugin } from './lyfta/index'
export { steamPlugin } from './steam/index'

// Export centralized metadata
export {
  PLUGINS_METADATA,
  getPluginMetadata,
  getAllPluginsMetadata,
  getSectionConfigOptions,
  getPluginCategory,
  getPluginsByCategory,
  getPluginsGroupedByCategory,
  isValidPluginName,
  isValidCategory,
  isValidPluginMetadata,
  type PluginMetadata,
  type PluginSection,
  type SectionConfigOption,
  type PluginCategory,
  type EssentialConfigKeyMetadata,
} from './metadata'

// Export plugin tags system
export {
  PLUGIN_TAGS,
  getAllTags,
  getPluginTags,
  hasPluginTag,
  getPluginsByTag,
  type PluginTag,
} from './tags'

// Export Plugin Registry (class)
export {
  PluginRegistry,
  pluginRegistry,
  getPluginMetadata as getPluginMetadataFromRegistry,
  getPlugin as getPluginFromRegistry,
  pluginExists,
} from './registry'
