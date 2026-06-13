/**
 * Plugin Registry with Lazy Loading Support
 *
 * This registry provides a structured way to access plugins and their metadata.
 * Currently uses PluginManager, but structure allows for future lazy loading optimization.
 *
 * For true lazy loading, the PluginManager would need to be refactored to support
 * dynamic imports. This registry provides the interface for that future work.
 */

// Import from weeb-plugins package
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Plugin registry entry
 * Each plugin has metadata and a loader function
 */
export interface PluginRegistryEntry {
  meta: any // PluginMetadata
  load: () => Promise<any> // Returns the plugin instance
}

/**
 * Plugin registry map
 *
 * Maps plugin names to their registry entries.
 * Simplified version that only provides metadata for now.
 */
export const pluginRegistry: Record<string, PluginRegistryEntry> = {}

// Initialize registry with metadata only
const pluginNames = Object.keys(PLUGINS_METADATA)

pluginNames.forEach((pluginName) => {
  pluginRegistry[pluginName] = {
    meta: (PLUGINS_METADATA as Record<string, any>)[pluginName],
    load: async () => {
      // For now, return null - will be implemented later
      console.warn(`Plugin ${pluginName} loading not implemented yet`)
      return null
    },
  }
})

/**
 * Get a plugin by name (async for future lazy loading compatibility)
 */
export async function getPlugin(name: string): Promise<any> {
  const entry = pluginRegistry[name]
  if (!entry) {
    console.warn(`Plugin not found in registry: ${name}`)
    return null
  }

  return entry.load()
}

/**
 * Get multiple plugins by name
 * Returns only successfully loaded plugins
 */
export async function getPlugins(names: string[]): Promise<Array<[string, any]>> {
  const results: Array<[string, any]> = []

  await Promise.all(
    names.map(async (name) => {
      try {
        const plugin = await getPlugin(name)
        if (plugin) {
          results.push([name, plugin])
        }
      } catch (error) {
        console.error(`Failed to load plugin ${name}:`, error)
      }
    })
  )

  return results
}

/**
 * Check if a plugin exists in the registry
 */
export function hasPlugin(name: string): boolean {
  return name in pluginRegistry
}

/**
 * Get all plugin names in the registry
 */
export function getAllPluginNames(): string[] {
  return Object.keys(pluginRegistry)
}
