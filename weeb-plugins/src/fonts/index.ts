/**
 * Fonts Module (Server-Only)
 *
 * This module is server-only and should not be imported in browser/client code.
 * Use @weeb/weeb-plugins/fonts/server for server-side font loading.
 */

export { fontRegistry, getFontsForStyle, type FontDefinition } from "./registry.js"
export { loadFontDataUri } from "./loadFont.js"
export { getFontCss } from "./getFontCss.js"
export { getFontCssClient } from "./getFontCssClient.js"
