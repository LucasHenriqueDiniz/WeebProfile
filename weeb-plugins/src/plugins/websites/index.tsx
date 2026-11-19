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
import { WEBSITE_TILE_WIDTH, WebsiteTile, websiteTileHeight } from "./components/WebsiteTile"
import { safeHref } from "../../utils/external-link"
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
  tiles: (config, data) => {
    if (!config.sections?.includes("websites")) return []
    const ne = (config as WebsitesConfig).nonEssential || {}
    const style = ((config as any).style || "default") as "default" | "terminal"
    const options = {
      showThumbnail: ne.websites_show_thumbnail !== false,
      showDescription: ne.websites_show_description !== false,
    }
    const height = websiteTileHeight(options)

    return ((data as WebsitesData).websites ?? []).flatMap((site) => {
      const href = safeHref(site.url)
      if (!href) return []
      return [
        {
          href,
          title: site.title,
          element: <WebsiteTile site={site} style={style} {...options} />,
          width: WEBSITE_TILE_WIDTH,
          height,
        },
      ]
    })
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

    // Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
    // `section-heights.test.ts` pins it. Until then the terminal counted 17px a line for
    // TerminalLine's 16 (10px over for six sites) and the default style rounded each row's
    // text block up: 5px a grid row in half, 1.5px a list row, 3 to 16px a card.
    //
    // The `half:text-xs`/`half:text-sm` titles take Tailwind's own line-height (16/20px),
    // which wins over `leading-tight`; the other lines are `leading-tight` (1.25em).

    // Terminal: TerminalCommand and one TerminalLine (`sm-text`, 16px) per site.
    if ((config as { style?: string }).style === "terminal") return 32 + n * 16

    const variant = read<WebsitesVariant>("websites_variant", "grid")
    const showThumbnail = read<boolean>("websites_show_thumbnail", true) !== false
    const showDescription = read<boolean>("websites_show_description", true) !== false
    const half = size === "half"
    const sites = websitesData.websites
    const described = (site: { description?: string | null }): boolean => showDescription && !!site.description
    // DefaultTitle (40px) and the container's `gap-2.5`, which only exists with the title.
    const titleBlockH = read<boolean>("websites_hide_title", false) ? 0 : 40 + 10

    // A list row: `py-1`/`py-1.5`, then the 20/24px favicon or the title over its description.
    const listRowH = (site: { description?: string | null }): number =>
      (half ? 8 : 12) + Math.max(half ? 20 : 24, (half ? 16 : 17.5) + (described(site) ? (half ? 12.5 : 13.75) : 0))
    const listH = (list: typeof sites): number =>
      list.reduce((sum, site) => sum + listRowH(site), 0) + Math.max(0, list.length - 1) * 6

    let bodyH: number
    if (variant === "list") {
      bodyH = listH(sites)
    } else if (variant === "featured") {
      const [featured, ...rest] = sites
      // Hero, then `py-2` around the 24px favicon or the title over its description.
      const heroH =
        (showThumbnail ? (half ? 120 : 140) : 0) +
        16 +
        Math.max(24, 20 + (described(featured!) ? (half ? 13.75 : 15) : 0))
      bodyH = heroH + (rest.length > 0 ? 8 + listH(rest) : 0)
    } else {
      // Cards in rows of 2 (half) or 4, `gap-2.5`; each the thumbnail, then `py-1.5` around
      // the title row, the description and the domain, `gap-0.5` apart.
      const cols = half ? 2 : 4
      const line = half ? 12.5 : 13.75
      const cardH = (site: { description?: string | null }): number =>
        (showThumbnail ? (half ? 72 : 88) : 0) + 12 + (half ? 16 : 17.5) + (described(site) ? 2 + line : 0) + 2 + line
      bodyH = 0
      for (let row = 0; row * cols < n; row++) {
        bodyH += (row > 0 ? 10 : 0) + Math.max(...sites.slice(row * cols, (row + 1) * cols).map(cardH))
      }
    }

    return Math.ceil(titleBlockH + bodyH)
  },
}

export default websitesPlugin
