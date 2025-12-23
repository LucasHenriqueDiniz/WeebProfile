/**
 * Plugin CSS Loader
 * 
 * Aggregates CSS from all active plugins
 */

import { PluginManager } from '../plugins/manager'

/**
 * Get CSS from a specific plugin
 */
export function getPluginCSS(pluginName: string): string {
  const pluginManager = PluginManager.getInstance()
  const plugin = pluginManager.get(pluginName)
  
  if (!plugin || !('styles' in plugin) || !plugin.styles) {
    return ''
  }
  
  return plugin.styles
}

/**
 * Get aggregated CSS from multiple plugins
 */
export function getPluginsCSS(pluginNames: string[]): string {
  const cssStrings: string[] = []
  
  for (const pluginName of pluginNames) {
    const css = getPluginCSS(pluginName)
    if (css) {
      cssStrings.push(`/* Plugin: ${pluginName} */`)
      cssStrings.push(css)
    }
  }
  
  return cssStrings.join('\n')
}

/**
 * Get CSS from all active plugins in a config
 */
export function getActivePluginsCSS(plugins: Record<string, any>): string {
  const activePluginNames = Object.entries(plugins)
    .filter(([_, config]) => config?.enabled)
    .map(([name]) => name)
  
  return getPluginsCSS(activePluginNames)
}

