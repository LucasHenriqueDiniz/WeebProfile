/**
 * Styles Module (Browser-Compatible)
 *
 * Exports for loading CSS and style definitions
 * All exports are browser-compatible (no Node.js dependencies)
 *
 * For server-only functions (getCompleteCSS, getSharedCSS), use './server'
 */

import { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists } from "./registry"
import { getPluginCSS, getPluginsCSS, getActivePluginsCSS } from "./plugins"

// Browser-compatible exports
export { styleRegistry, getStyle, getStyleCSS, getAvailableStyles, styleExists }
export type { StyleDefinition, StyleName } from "./registry"
export { default as defaultStyle } from "./default/index"
export { default as terminalStyle } from "./terminal/index"
export { getPluginCSS, getPluginsCSS, getActivePluginsCSS }
// The Tailwind utilities every plugin's markup depends on. getCompleteCSS pulls
// this in on the server, but a browser consumer rendering plugins into a document
// of its own (the wizard preview's iframe) has no other source for it -- the host
// page's own Tailwind build does not cross a frame boundary. Safe here: it is a
// plain string constant, unlike the rest of ./server.
export { SHARED_CSS } from "./generated-shared-css.js"
// Font @font-face for browser consumers. Pulled from the specific modules rather
// than ../fonts/index.js, which is the server entry and drags the ~120KB embedded
// font table along with it -- the whole point of the URL form is not shipping that.
export { getFontCssClient } from "../fonts/getFontCssClient.js"
export { getFontsForStyle } from "../fonts/registry.js"
