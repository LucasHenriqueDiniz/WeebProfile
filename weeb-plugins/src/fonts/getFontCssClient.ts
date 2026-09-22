/**
 * Font CSS Generator for Client (Browser)
 *
 * Generates @font-face CSS blocks with relative URLs for browser use.
 * Does not load files - just generates the CSS structure.
 */

import { fontRegistry, type FontDefinition } from "./registry.js"

/**
 * Generate @font-face CSS for specified font IDs (client-side, with relative URLs)
 *
 * @param fontIds - Array of font IDs (e.g., ['poppins-400', 'poppins-500'])
 * @param baseUrl - Base URL for font assets (e.g., '/fonts' or '/api/fonts')
 * @returns CSS string with @font-face declarations
 */
export function getFontCssClient(fontIds: string[], baseUrl: string = "/fonts"): string {
  const fonts = fontIds
    .map((id) => fontRegistry.find((f) => f.id === id))
    .filter((f): f is FontDefinition => f !== undefined)

  const cssBlocks = fonts.map((font) => {
    const fontUrl = `${baseUrl}/${font.subfolder}/${font.file}`
    return `@font-face {
  font-family: '${font.family}';
  font-style: ${font.style};
  font-weight: ${font.weight};
  font-display: swap;
  src: url(${fontUrl}) format('woff2');
}`
  })

  return cssBlocks.join("\n\n")
}
