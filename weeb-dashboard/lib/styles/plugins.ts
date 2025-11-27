/**
 * Plugins CSS
 */

import { getActivePluginsCSS } from '../weeb-plugins/styles/plugins'

// Export async function to get plugins CSS
export async function getPluginsCSS(plugins?: Record<string, any>): Promise<string> {
  if (!plugins) return ''
  return getActivePluginsCSS(plugins)
}

// For backward compatibility, export empty string as default
export const pluginsCSS = ''
