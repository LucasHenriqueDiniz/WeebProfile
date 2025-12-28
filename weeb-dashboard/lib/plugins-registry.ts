/**
 * Local plugin registry for weeb-dashboard
 *
 * Uses the new plugin registry structure for better organization.
 * Re-exports functions from plugin-registry for backward compatibility.
 */

import { getPlugin as getPluginFromRegistry, getPlugins } from "@/lib/plugins/plugin-registry"

// Cache for loaded plugins (prevents re-loading)
const pluginsCache = new Map<string, any>()

/**
 * Get a plugin by name with caching
 */
export async function getPlugin(name: string): Promise<any> {
  if (pluginsCache.has(name)) {
    return pluginsCache.get(name)
  }

  const plugin = await getPluginFromRegistry(name)

  if (plugin) {
    pluginsCache.set(name, plugin)
  }

  return plugin
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
  return getPlugins(activePluginNames)
}
