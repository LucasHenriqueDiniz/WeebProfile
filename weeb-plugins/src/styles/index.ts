/**
 * Styles Module (Browser-Compatible)
 * 
 * Exports for loading CSS and style definitions
 * All exports are browser-compatible (no Node.js dependencies)
 * 
 * For server-only functions (getCompleteCSS, getSharedCSS), use './server'
 */

import { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists } from './registry'
import { getPluginCSS, getPluginsCSS, getActivePluginsCSS } from './plugins'

// Browser-compatible exports
export { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists }
export type { StyleDefinition, StyleName } from './registry'
export { default as defaultStyle } from './default/index'
export { default as terminalStyle } from './terminal/index'
export { getPluginCSS, getPluginsCSS, getActivePluginsCSS }

