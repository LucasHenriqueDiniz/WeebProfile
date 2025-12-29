/**
 * Local plugin registry for weeb-dashboard
 *
 * Uses PluginManager from weeb-plugins for plugin access.
 * Provides async-compatible interface for backward compatibility.
 */

import { PluginManager } from "@weeb/weeb-plugins/plugins/manager"

// Cache for loaded plugins (prevents re-loading)
const pluginsCache = new Map<string, any>()

/**
 * Get a plugin by name with caching
 */
export async function getPlugin(name: string): Promise<any> {
  if (pluginsCache.has(name)) {
    return pluginsCache.get(name)
  }

  const manager = PluginManager.getInstance()
  const plugin = manager.get(name)

  if (plugin) {
    pluginsCache.set(name, plugin)
  }

  return plugin || null
}

/**
 * Get active plugins based on config
 * Only loads plugins that are enabled and have sections
 */
export async function getActivePlugins(
  pluginsConfig: Record<string, { enabled?: boolean; sections?: string[] }>
): Promise<Array<[string, any]>> {
  // Filter to only enabled plugins with sections
  const activePluginNames = Object.entries(pluginsConfig)
    .filter(([_, config]) => config?.enabled && config?.sections && config.sections.length > 0)
    .map(([name]) => name)

  // Load plugins in parallel with caching
  const manager = PluginManager.getInstance()
  const results: Array<[string, any]> = []
  
  for (const name of activePluginNames) {
    if (pluginsCache.has(name)) {
      results.push([name, pluginsCache.get(name)])
    } else {
      const plugin = manager.get(name)
      if (plugin) {
        pluginsCache.set(name, plugin)
        results.push([name, plugin])
      }
    }
  }
  
  return results
}
