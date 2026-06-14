/**
 * Font Loader
 *
 * Returns WOFF2 fonts as data URIs from a build-time generated table
 * (see scripts/generate-embedded-assets.ts). No filesystem access at
 * runtime, so this works in Cloudflare Workers as well as Node.
 */

import { FONT_DATA_URIS } from './generated-font-data.js'

/**
 * Get a font as a data URI (data:font/woff2;base64,...)
 *
 * @param fileName - Name of the font file (e.g., 'poppins-v24-latin_latin-ext-regular.woff2')
 * @param subfolder - Subfolder in assets/ (e.g., 'Poppins' or 'JetBrainsMono')
 * @returns Data URI string (data:font/woff2;base64,...)
 */
export async function loadFontDataUri(fileName: string, subfolder: string): Promise<string> {
  const key = `${subfolder}/${fileName}`
  const dataUri = FONT_DATA_URIS[key]

  if (!dataUri) {
    throw new Error(
      `Font data not found for ${key}. Run "pnpm --filter @weeb/weeb-plugins run generate-embedded-assets".`
    )
  }

  return dataUri
}
