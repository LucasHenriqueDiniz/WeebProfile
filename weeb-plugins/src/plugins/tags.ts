/**
 * Plugin Tags System
 * 
 * Tags allow plugins to be categorized beyond the official categories (coding, music, anime, gaming).
 * This enables more flexible filtering and organization in the dashboard.
 * 
 * To add a new tag:
 * 1. Add it to the PluginTag type
 * 2. Add it to the PLUGIN_TAGS object with plugins that use it
 * 3. Update the dashboard to show the new tag in filters
 */

/**
 * Available plugin tags
 */
export type PluginTag = "health" | "productivity" | "social" | "entertainment"

/**
 * Mapping of plugin names to their tags
 * 
 * Plugins can have multiple tags to allow flexible categorization
 */
export const PLUGIN_TAGS: Record<string, PluginTag[]> = {
  "16personalities": ["health"],
  lyfta: ["health"],
  // Add more plugins and tags as needed
  // github: ["coding", "productivity"],
  // lastfm: ["music", "entertainment"],
}

/**
 * Get all available tags (union of all tags used by plugins)
 */
export function getAllTags(): PluginTag[] {
  const tagSet = new Set<PluginTag>()
  Object.values(PLUGIN_TAGS).forEach((tags) => {
    tags.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * Get tags for a specific plugin
 */
export function getPluginTags(pluginName: string): PluginTag[] {
  return PLUGIN_TAGS[pluginName] || []
}

/**
 * Check if a plugin has a specific tag
 */
export function hasPluginTag(pluginName: string, tag: PluginTag): boolean {
  return getPluginTags(pluginName).includes(tag)
}

/**
 * Get all plugins that have a specific tag
 */
export function getPluginsByTag(tag: PluginTag): string[] {
  return Object.entries(PLUGIN_TAGS)
    .filter(([_, tags]) => tags.includes(tag))
    .map(([pluginName]) => pluginName)
}

