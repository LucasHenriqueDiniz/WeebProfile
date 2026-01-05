/**
 * Font Loader with Cache
 * 
 * Loads WOFF2 font files from filesystem and converts to data URIs.
 * Implements in-memory cache to avoid re-reading files.
 */

import { readFile } from 'fs/promises'

const fontCache = new Map<string, string>()

/**
 * Load font file and convert to data URI
 * 
 * @param fileName - Name of the font file (e.g., 'poppins-v24-latin_latin-ext-regular.woff2')
 * @param subfolder - Subfolder in assets/ (e.g., 'Poppins' or 'JetBrainsMono')
 * @returns Data URI string (data:font/woff2;base64,...)
 */
export async function loadFontDataUri(fileName: string, subfolder: string): Promise<string> {
  // Cache key robusta: import.meta.url::subfolder/fileName
  const baseUrl = import.meta.url
  const cacheKey = `${baseUrl}::${subfolder}/${fileName}`
  
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!
  }
  
  // Resolver path usando import.meta.url (ESM)
  const assetsDir = new URL('./assets/', baseUrl)
  const fontPath = new URL(`${subfolder}/${fileName}`, assetsDir)
  
  // Ler arquivo e converter para base64
  const fontBuffer = await readFile(fontPath)
  const base64 = fontBuffer.toString('base64')
  const dataUri = `data:font/woff2;base64,${base64}`
  
  // Armazenar no cache
  fontCache.set(cacheKey, dataUri)
  return dataUri
}

