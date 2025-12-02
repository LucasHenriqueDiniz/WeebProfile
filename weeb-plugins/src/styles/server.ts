/**
 * Server-only Styles Module
 * 
 * Functions that require Node.js (fs, path, etc.)
 * Only use in server environments (svg-generator)
 * DO NOT import in browser/client code
 */

import { getStyleCSS } from './registry'
import { getActivePluginsCSS } from './plugins'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Get shared CSS (common utilities)
 * Server-only: uses Node.js fs module
 */
export function getSharedCSS(): string {
  // Load shared CSS file (Tailwind utilities)
  // Use same pattern as default/index.ts
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    // Try dist first (compiled), then src (development)
    let sharedCssPath = resolve(__dirname, 'shared.css')
    if (!existsSync(sharedCssPath)) {
      // If not in dist, try src
      const srcPath = resolve(__dirname, '../../src/styles/shared.css')
      if (existsSync(srcPath)) {
        sharedCssPath = srcPath
      }
    }
    
    return readFileSync(sharedCssPath, 'utf8')
  } catch (error) {
    // If file doesn't exist or can't be read, return empty string
    console.warn('[Styles] Failed to load shared.css:', error)
    return ''
  }
}

/**
 * Get all CSS for a style (style CSS + shared CSS)
 * Server-only: uses getSharedCSS which requires Node.js
 */
export function getAllStyleCSS(styleName: string): string {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  return [styleCSS, sharedCSS].filter(Boolean).join('\n')
}

/**
 * Get complete CSS for rendering (style + plugins + shared)
 * Server-only: uses getSharedCSS which requires Node.js
 */
export function getCompleteCSS(
  styleName: string,
  plugins?: Record<string, any>
): string {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  const pluginsCSS = plugins ? getActivePluginsCSS(plugins) : ''
  
  return [styleCSS, pluginsCSS, sharedCSS].filter(Boolean).join('\n')
}

