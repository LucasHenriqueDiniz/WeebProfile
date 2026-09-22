/**
 * Plugin registry
 */

export { personality16Plugin } from "./16personalities/index"
export { githubPlugin } from "./github/index"
export { lastFmPlugin } from "./lastfm/index"
export { lyftaPlugin } from "./lyfta/index"
export { myAnimeListPlugin } from "./myanimelist/index"
export { githubProjectPlugin } from "./github-project/index"
export { steamPlugin } from "./steam/index"
export { duolingoPlugin } from "./duolingo/index"
export { codewarsPlugin } from "./codewars/index"
export { codeforcesPlugin } from "./codeforces/index"
export { stackoverflowPlugin } from "./stackoverflow/index"

// Export centralized metadata
export {
  getAllPluginsMetadata,
  getPluginCategory,
  getPluginMetadata,
  getPluginsByCategory,
  getPluginsGroupedByCategory,
  getSectionConfigOptions,
  isValidCategory,
  isValidPluginMetadata,
  isValidPluginName,
  PLUGINS_METADATA,
  type EssentialConfigKeyMetadata,
  type PluginCategory,
  type PluginMetadata,
  type PluginSection,
  type SectionConfigOption,
} from "./metadata"

// Export config option types
export type { ConfigOptionHelpFields } from "./config-option-types"

// Export plugin tags system
export { getAllTags, getPluginsByTag, getPluginTags, hasPluginTag, PLUGIN_TAGS, type PluginTag } from "./tags"

// Export Plugin Registry (class)
export {
  getPlugin as getPluginFromRegistry,
  getPluginMetadata as getPluginMetadataFromRegistry,
  pluginExists,
  PluginRegistry,
  pluginRegistry,
} from "./registry"
