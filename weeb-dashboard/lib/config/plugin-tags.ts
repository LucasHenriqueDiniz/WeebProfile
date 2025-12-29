/**
 * Re-export plugin tags from weeb-plugins
 * 
 * This file re-exports the tags system from weeb-plugins to maintain
 * a single source of truth for plugin tags.
 */

export {
  PLUGIN_TAGS,
  getAllTags,
  getPluginTags,
  hasPluginTag,
  getPluginsByTag,
  type PluginTag,
} from "@weeb/weeb-plugins/plugins/tags"

