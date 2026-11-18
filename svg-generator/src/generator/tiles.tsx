/**
 * Tiles: each item of a card as an SVG of its own (Plugin.tiles in weeb-plugins).
 *
 * A README shows a card as one <img>, and an image holds one link. A README that wants
 * one click per site lays tiles side by side, each inside its own <a href>. They are
 * drawn here from the data the card was drawn from, so no plugin fetches twice.
 */

import React from "react"
import { renderToString } from "react-dom/server"
import { PluginManager } from "@weeb/weeb-plugins/plugins"
import type { SvgConfig, SvgTile } from "../types/index.js"
import { createSvgContainer } from "../renderer/template-renderer.js"

/**
 * The terminal style paints its background on the whole container and rounds its
 * corners. A tile paints its own background inside the SVG (a website tile leaves a
 * transparent margin, which is the gap between tiles in the README; a link badge has
 * corners of its own), so the container is transparent and square.
 */
const TILE_CSS = "#svg-main .terminal-container{background-color:transparent !important;border-radius:0 !important}"

export function renderTiles(
  config: SvgConfig,
  pluginsConfig: Record<string, any>,
  pluginsData: Record<string, any>,
  pluginsErrors: Record<string, Error>,
  cssDefs: React.ReactElement
): SvgTile[] {
  const manager = PluginManager.getInstance()
  const order = config.pluginsOrder && config.pluginsOrder.length > 0 ? config.pluginsOrder : Object.keys(pluginsConfig)
  const tiles: SvgTile[] = []

  for (const name of order) {
    const pluginConfig = pluginsConfig[name]
    const data = pluginsData[name]
    // A plugin that failed draws a PluginError on the card, which then is not published.
    if (!pluginConfig?.enabled || !data || pluginsErrors[name]) continue
    const plugin = manager.get(name)
    if (!plugin?.tiles) continue

    for (const tile of plugin.tiles(pluginConfig, data)) {
      const svg = renderToString(
        createSvgContainer({
          width: tile.width,
          height: tile.height,
          size: config.size,
          style: config.style,
          cssDefs: (
            <>
              {cssDefs}
              <style>{TILE_CSS}</style>
            </>
          ),
          children: tile.element,
          terminalTheme: config.terminalTheme,
          defaultTheme: config.defaultTheme,
          // A window frame on each tile would repeat the same title bar across the row.
          hideTerminalHeader: true,
          fontFamily: config.fontFamily,
          hideTerminalEmojis: config.hideTerminalEmojis,
          colorMode: config.colorMode,
          customThemeColors: config.customThemeColors,
        })
      )
      tiles.push({
        href: tile.href,
        title: tile.title,
        svg,
        width: tile.width,
        height: tile.height,
        layout: tile.layout ?? "grid",
      })
    }
  }

  return tiles
}
