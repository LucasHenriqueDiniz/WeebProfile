/**
 * Styles Module (Browser-Compatible)
 * 
 * Exports for loading CSS and style definitions
 * All exports are browser-compatible (no Node.js dependencies)
 * 
 * For server-only functions (getCompleteCSS, getSharedCSS), use './server'
 */

import { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists } from './registry.js'
import { getPluginCSS, getPluginsCSS, getActivePluginsCSS } from './plugins.js'

// Browser-compatible exports
export { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists }
export type { StyleDefinition, StyleName } from './registry.js'
export { default as defaultStyle } from './default/index.js'
export { default as terminalStyle } from './terminal/index.js'
export { getPluginCSS, getPluginsCSS, getActivePluginsCSS }

