/**
 * Server-only Styles Module
 *
 * Functions used to render the complete CSS for SVG generation
 * (svg-generator, weeb-debug-tool). DO NOT import in browser/client code.
 */

import { getStyleCSS } from "./registry"
import { getActivePluginsCSS } from "./plugins"
import { SHARED_CSS } from "./generated-shared-css.js"
import { getFontCss, getFontsForStyle } from "../fonts/index.js"

/**
 * Get shared CSS (common utilities)
 */
export function getSharedCSS(): string {
  return SHARED_CSS
}

/**
 * Get all CSS for a style (style CSS + shared CSS)
 */
export function getAllStyleCSS(styleName: string): string {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  return [styleCSS, sharedCSS].filter(Boolean).join("\n")
}

/**
 * Get complete CSS for rendering (fonts + style + plugins + shared)
 * Server-only: uses getSharedCSS and font loading which require Node.js
 */
export async function getCompleteCSS(styleName: string, plugins?: Record<string, any>): Promise<string> {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  const pluginsCSS = plugins ? getActivePluginsCSS(plugins) : ""

  // Carregar fontes para o estilo
  const fontIds = getFontsForStyle(styleName)
  const fontCSS = fontIds.length > 0 ? await getFontCss(fontIds) : ""

  return [fontCSS, styleCSS, pluginsCSS, sharedCSS].filter(Boolean).join("\n")
}
