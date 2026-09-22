/**
 * Font CSS Generator
 *
 * Generates @font-face CSS blocks for specified font IDs.
 */

import { fontRegistry, type FontDefinition } from "./registry.js"
import { loadFontDataUri } from "./loadFont.js"

/**
 * Generate @font-face CSS for specified font IDs
 *
 * @param fontIds - Array of font IDs (e.g., ['poppins-400', 'poppins-500'])
 * @returns CSS string with @font-face declarations
 */
export async function getFontCss(fontIds: string[]): Promise<string> {
  const fonts = fontIds
    .map((id) => fontRegistry.find((f) => f.id === id))
    .filter((f): f is FontDefinition => f !== undefined)

  const cssBlocks = await Promise.all(
    fonts.map(async (font) => {
      const dataUri = await loadFontDataUri(font.file, font.subfolder)
      return `@font-face {
  font-family: '${font.family}';
  font-style: ${font.style};
  font-weight: ${font.weight};
  font-display: swap;
  src: url(${dataUri}) format('woff2');
}`
    })
  )

  return cssBlocks.join("\n\n")
}
