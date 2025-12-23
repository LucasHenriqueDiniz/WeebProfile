/**
 * Plugin registry
 */

export { personality16Plugin } from "./16personalities/index.js"
export { githubPlugin } from "./github/index.js"
export { lastFmPlugin } from "./lastfm/index.js"
export { lyftaPlugin } from "./lyfta/index.js"
export { PluginManager } from "./manager.js"
export { myAnimeListPlugin } from "./myanimelist/index.js"
export { steamPlugin } from "./steam/index.js"

// Export centralized metadata
export {
  getAllPluginsMetadata,
  DISABLED_PLUGINS,
  getEnabledPlugins,
  getEnabledPluginsMetadata,
  getPluginCategory,
  getPluginMetadata,
  getPluginsByCategory,
  getPluginsGroupedByCategory,
  getSectionConfigOptions,
  isPluginDisabled,
  isValidCategory,
  isValidPluginMetadata,
  isValidPluginName,
  PLUGINS_METADATA,
  type EssentialConfigKeyMetadata,
  type PluginCategory,
  type PluginMetadata,
  type PluginSection,
  type SectionConfigOption,
} from "./metadata.js"

// Export plugin tags system
export { getAllTags, getPluginsByTag, getPluginTags, hasPluginTag, PLUGIN_TAGS, type PluginTag } from "./tags.js"
export { spotifyPlugin } from './spotify/index'
export { duolingoPlugin } from './duolingo/index'
export { codewarsPlugin } from './codewars/index'
export { codeforcesPlugin } from './codeforces/index'
export { stackoverflowPlugin } from './stackoverflow/index'

// Export Plugin Registry (class)
export {
  getPlugin as getPluginFromRegistry,
  getPluginMetadata as getPluginMetadataFromRegistry,
  pluginExists,
  PluginRegistry,
  pluginRegistry,
} from "./registry.js"
