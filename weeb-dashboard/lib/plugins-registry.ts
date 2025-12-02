/**
 * Local plugin registry for weeb-dashboard
 *
 * Uses PluginManager from @weeb/weeb-plugins
 */

import { PluginManager } from '@weeb/weeb-plugins/plugins/manager'

let pluginsCache: Map<string, any> | null = null

export async function getPlugin(name: string): Promise<any> {
  if (!pluginsCache) {
    pluginsCache = new Map()
  }

  if (pluginsCache.has(name)) {
    return pluginsCache.get(name)
  }

  // Load plugin using PluginManager
  const pluginManager = PluginManager.getInstance()
  const plugin = pluginManager.get(name)

  if (plugin) {
    pluginsCache.set(name, plugin)
  }
  return plugin
}

export async function getActivePlugins(
  pluginsConfig: Record<string, { enabled?: boolean }>
): Promise<Array<[string, any]>> {
  const activePlugins: Array<[string, any]> = []

  for (const [name, config] of Object.entries(pluginsConfig)) {
    if (config?.enabled) {
      const plugin = await getPlugin(name)
      if (plugin) {
        activePlugins.push([name, plugin])
      }
    }
  }

  return activePlugins
}
