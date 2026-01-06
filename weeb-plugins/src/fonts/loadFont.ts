/**
 * Font Loader with Cache
 * 
 * Loads WOFF2 font files from filesystem and converts to data URIs.
 * Implements in-memory cache to avoid re-reading files.
 */

import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const fontCache = new Map<string, string>()

/**
 * Load font file and convert to data URI
 * 
 * @param fileName - Name of the font file (e.g., 'poppins-v24-latin_latin-ext-regular.woff2')
 * @param subfolder - Subfolder in assets/ (e.g., 'Poppins' or 'JetBrainsMono')
 * @returns Data URI string (data:font/woff2;base64,...)
 */
export async function loadFontDataUri(fileName: string, subfolder: string): Promise<string> {
  // Cache key robusta: fileName/subfolder
  const cacheKey = `${subfolder}/${fileName}`
  
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!
  }
  
  // Resolver path usando fileURLToPath para garantir caminho correto em todos os ambientes
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  
  // Tentar múltiplos caminhos possíveis
  const possiblePaths = [
    // Caminho esperado em dist/fonts/loadFont.js -> dist/fonts/assets/
    resolve(__dirname, 'assets', subfolder, fileName),
    // Se estiver rodando de outro contexto, tentar caminho absoluto baseado em workspace
    resolve(__dirname, '../../dist/fonts/assets', subfolder, fileName),
    // Fallback para src (desenvolvimento)
    resolve(__dirname, '../../src/fonts/assets', subfolder, fileName),
    // Último fallback: caminho absoluto a partir do node_modules (se estiver instalado como pacote)
    resolve(process.cwd(), 'node_modules/@weeb/weeb-plugins/dist/fonts/assets', subfolder, fileName),
  ]
  
  let fontPath: string | null = null
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      fontPath = path
      break
    }
  }
  
  if (!fontPath) {
    // Log todos os caminhos tentados para debug
    console.error(`❌ [Font Loader] Font file not found: ${subfolder}/${fileName}`)
    console.error(`❌ [Font Loader] Tried paths:`)
    possiblePaths.forEach((path, i) => {
      console.error(`   ${i + 1}. ${path} (exists: ${existsSync(path)})`)
    })
    console.error(`❌ [Font Loader] Current __dirname: ${__dirname}`)
    console.error(`❌ [Font Loader] Current __filename: ${__filename}`)
    console.error(`❌ [Font Loader] process.cwd(): ${process.cwd()}`)
    throw new Error(
      `Font file not found: ${subfolder}/${fileName}. ` +
      `Tried paths: ${possiblePaths.join(', ')}. ` +
      `Current directory: ${__dirname}`
    )
  }
  
  try {
    // Ler arquivo e converter para base64
    const fontBuffer = await readFile(fontPath)
    const base64 = fontBuffer.toString('base64')
    const dataUri = `data:font/woff2;base64,${base64}`
    
    // Armazenar no cache
    fontCache.set(cacheKey, dataUri)
    return dataUri
  } catch (error) {
    console.error(`❌ [Font Loader] Error reading font file at ${fontPath}:`, error)
    throw new Error(
      `Failed to read font file: ${subfolder}/${fileName} at ${fontPath}. ` +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

