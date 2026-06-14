/**
 * Main SVG generator
 *
 * Coordinates complete SVG generation:
 * 1. Renders React components
 * 2. Calculates height by summing each plugin's calculateHeight()
 * 3. Loads CSS
 * 4. Creates SVG container with calculated height
 * 5. Returns final SVG
 *
 * IMPORTANT: This module is server-only and uses renderToString from react-dom/server.
 * No browser/Playwright is required - height is computed statically per plugin,
 * which keeps this package deployable as a Cloudflare Worker.
 */

import { renderToString } from "react-dom/server"
import { PluginManager } from "@weeb/weeb-plugins/plugins"
import type { SvgConfig, SvgGenerationResult } from "../types/index.js"
import { loadCss } from "./css-loader.js"
import { renderPlugins } from "../renderer/react-renderer.js"
import { createSvgContainer } from "../renderer/template-renderer.js"

/**
 * Generates SVG from configuration
 *
 * @param config - SVG configuration
 * @returns SVG string and dimensions
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  const width = config.size === "half" ? 415 : 830

  // 1. Render plugins (do this once only)
  const { element: pluginsContent, pluginsConfig, pluginsData, pluginsErrors } = await renderPlugins(config)

  // 2. Calculate height by summing each enabled plugin's calculateHeight()
  const height = PluginManager.getInstance().calculateTotalHeight(pluginsConfig, pluginsData, config.size)

  console.log(`[SVG Generator] ✅ Height calculated: ${height}px`)

  // 3. Load CSS
  const cssDefs = await loadCss(config)

  // 4. Create SVG container
  const svgElement = createSvgContainer({
    width,
    height,
    size: config.size,
    style: config.style,
    cssDefs,
    children: pluginsContent,
    terminalTheme: config.terminalTheme,
    defaultTheme: config.defaultTheme,
    hideTerminalHeader: config.hideTerminalHeader,
    hideTerminalEmojis: config.hideTerminalEmojis,
  })

  // 5. Render to string
  const svg = renderToString(svgElement)

  const result: any = {
    svg,
    height,
    width,
  }

  // Add debug info internally (will be used by server)
  result._debug = {
    pluginsData,
    pluginsErrors: Object.fromEntries(
      Object.entries(pluginsErrors).map(([key, error]) => [key, error.message || String(error)])
    ),
  }

  return result
}
