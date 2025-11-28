/**
 * PLUGIN_NAME plugin specific types
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from '../shared/types/base'

/**
 * Non-essential plugin configuration (user preferences)
 * These configs are stored in pluginsConfig in the database
 */
export interface PLUGIN_NAMENonEssentialConfig extends NonEssentialPluginConfig {
  // Add your non-essential configs here
  // Example:
  // max_items?: number
  // show_title?: boolean
  // custom_title?: string
}

/**
 * Complete plugin configuration
 */
export interface PLUGIN_NAMEConfig extends BasePluginConfig {
  nonEssential?: PLUGIN_NAMENonEssentialConfig
  [key: string]: any // Index signature for compatibility with PluginConfig
}

/**
 * Data returned by the plugin
 */
export interface PLUGIN_NAMEData {
  // Define the data structure here
  // Example:
  // items: Array<{ id: string; name: string }>
  // total: number
}
