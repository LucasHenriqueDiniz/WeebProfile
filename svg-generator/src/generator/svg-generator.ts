/**
 * Main SVG generator
 *
 * Coordinates complete SVG generation:
 * 1. Renders React components
 * 2. Measures rendered height with Playwright
 * 3. Loads CSS
 * 4. Creates SVG container with measured height
 * 5. Returns final SVG
 *
 * IMPORTANT: This module is server-only and uses renderToString from react-dom/server
 * and Playwright for height measurement. Never import on client side.
 */

import { renderToString } from "react-dom/server"
import type { SvgConfig, SvgGenerationResult } from "../types/index.js"
import { loadCss } from "./css-loader.js"
import { renderPlugins } from "../renderer/react-renderer.js"
import { createSvgContainer } from "../renderer/template-renderer.js"
import { measureHeight } from "../layout/measure-height.js"
import { reactToHtml } from "../layout/react-to-html.js"

/**
 * Generates SVG from configuration
 *
 * @param config - SVG configuration
 * @returns SVG string and dimensions
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  const width = config.size === "half" ? 415 : 830

  // 1. Render plugins (do this once only)
  const { element: pluginsContent, pluginsData, pluginsErrors } = await renderPlugins(config)

  // 2. Calculate height with Playwright (always used)
  console.log("[SVG Generator] 📏 Measuring height with Playwright...")

  // Convert React to HTML
  const { html, css } = await reactToHtml(pluginsContent, config, width)

  // Measure height with Playwright
  const height = await measureHeight({
    html,
    css,
    width,
    size: config.size,
    style: config.style,
    timeoutMs: 5000,
  })

  console.log(`[SVG Generator] ✅ Height measured: ${height}px`)

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
