/**
 * Server-only Styles Module
 *
 * Functions that require Node.js (fs, path, etc.)
 * Only use in server environments (svg-generator)
 * DO NOT import in browser/client code
 */

import { getStyleCSS } from "./registry"
import { getActivePluginsCSS } from "./plugins"
import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

/**
 * Get shared CSS (common utilities)
 * Server-only: uses Node.js fs module
 */
export function getSharedCSS(): string {
  // Load shared CSS file (Tailwind utilities)
  try {
    // Try different possible locations for shared.css
    const possiblePaths = [
      "./shared.css",  // Production (same directory)
      "../shared.css", // Alternative production path
      "../../src/styles/shared.css", // Development path
      "./src/styles/shared.css" // Fallback
    ]

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        return readFileSync(path, "utf8")
      }
    }

    // If no path found, return empty string
    return ""
  } catch (error) {
    // If file doesn't exist or can't be read, return empty string
    console.warn("[Styles] Failed to load shared.css:", error)
    return ""
  }
}

/**
 * Get all CSS for a style (style CSS + shared CSS)
 * Server-only: uses getSharedCSS which requires Node.js
 */
export function getAllStyleCSS(styleName: string): string {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  return [styleCSS, sharedCSS].filter(Boolean).join("\n")
}

/**
 * Get complete CSS for rendering (style + plugins + shared)
 * Server-only: uses getSharedCSS which requires Node.js
 */
export function getCompleteCSS(styleName: string, plugins?: Record<string, any>): string {
  const styleCSS = getStyleCSS(styleName)
  const sharedCSS = getSharedCSS()
  const pluginsCSS = plugins ? getActivePluginsCSS(plugins) : ""

  return [styleCSS, pluginsCSS, sharedCSS].filter(Boolean).join("\n")
}
