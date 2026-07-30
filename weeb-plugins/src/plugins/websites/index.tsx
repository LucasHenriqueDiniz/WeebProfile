/**
 * Websites Plugin
 *
 * Plugin para mostrar um showcase de sites do próprio usuário, com thumbnail
 * lida das meta tags Open Graph de cada página.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { WebsitesConfig, WebsitesData, WebsitesVariant } from "./types"
import { RenderWebsites } from "./components/RenderWebsites"
import { fetchWebsitesData } from "./services/fetchData"

export const websitesPlugin: Plugin<PluginConfig & WebsitesConfig, PluginData & WebsitesData> = {
  name: "websites",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
  } as unknown as PluginConfig & WebsitesConfig,
  fetchData: async (config: PluginConfig & WebsitesConfig, dev = false, _essentialConfig?, previewMode = false) => {
    return (await fetchWebsitesData(config as WebsitesConfig, dev, previewMode)) as PluginData & WebsitesData
  },
  render: (config: PluginConfig & WebsitesConfig, data: PluginData & WebsitesData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderWebsites config={config as WebsitesConfig} data={data as WebsitesData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => {
    const websitesData = data as WebsitesData
    const n = websitesData.websites?.length ?? 0
    if (n === 0) return 0
    if (!config.sections?.includes("websites")) return 0

    const ne = (config as WebsitesConfig).nonEssential || {}
    const read = <T,>(key: string, fallback: T): T => {
      const value = ne[key] !== undefined ? ne[key] : (config as Record<string, unknown>)[key]
      return value === undefined ? fallback : (value as T)
    }

    // Terminal: TerminalCommand + n TerminalLine (medido: 64 + n * 16).
    if ((config as { style?: string }).style === "terminal") return 68 + n * 17

    const variant = read<WebsitesVariant>("websites_variant", "grid")
    const showThumbnail = read<boolean>("websites_show_thumbnail", true) !== false
    const showDescription = read<boolean>("websites_show_description", true) !== false
    // O gap do flex container só existe quando o título está visível.
    const titleBlockH = read<boolean>("websites_hide_title", false) ? 0 : 40 + 10
    const gapH = 10

    // Linha da lista compacta: favicon/título (+ descrição) + padding + borda.
    const rowH = size === "half" ? (showDescription ? 38 : 30) : showDescription ? 46 : 39
    const rowGap = 6

    let bodyH: number
    if (variant === "list") {
      bodyH = n * rowH + Math.max(0, n - 1) * rowGap
    } else if (variant === "featured") {
      const heroThumbH = showThumbnail ? (size === "half" ? 120 : 140) : 0
      const heroTextH = showDescription ? 54 : 44
      const restCount = n - 1
      bodyH = heroThumbH + heroTextH
      if (restCount > 0) bodyH += 8 + restCount * rowH + Math.max(0, restCount - 1) * rowGap
    } else {
      const cols = size === "full" ? 4 : 2
      const rows = Math.ceil(n / cols)
      const cardThumbH = showThumbnail ? (size === "half" ? 72 : 88) : 0
      // título + domínio + padding vertical do bloco de texto
      const cardTextH = 46 + (showDescription ? 16 : 0)
      bodyH = rows * (cardThumbH + cardTextH) + Math.max(0, rows - 1) * gapH
    }

    return titleBlockH + bodyH
  },
}

export default websitesPlugin
