/**
 * About Plugin
 *
 * The parts of a profile README nobody has to keep up to date: an intro in the style
 * of neofetch (picture, user@host and "Label: value" lines) and a row of link badges.
 * Everything comes from what the user types; only the picture is downloaded, to be
 * embedded. Each badge is also a tile, so a README can give every link its own image.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { AboutConfig, AboutData } from "./types"
import { RenderAbout } from "./components/RenderAbout"
import { LinkBadge } from "./components/LinkBadge"
import { BADGE, badgeWidth, linksHeight, neofetchHeight, type Size, type Style } from "./layout"
import { fetchAboutData } from "./services/fetchData"
import { readFlag } from "./services/options"

function styleOf(config: unknown): Style {
  return (config as { style?: string }).style === "terminal" ? "terminal" : "default"
}

/**
 * The cursor of the last prompt blinks once the section has printed, only with card
 * animations on (`weeb-anim`) and motion allowed. At rest it is a still block.
 */
const ABOUT_CSS = `
@media (prefers-reduced-motion: no-preference) {
  #svg-main .weeb-anim .about-cursor {
    animation: about-blink 1.1s step-end var(--weeb-out, 0s) infinite;
  }
}
@keyframes about-blink {
  50% {
    opacity: 0;
  }
}
`

export const aboutPlugin: Plugin<PluginConfig & AboutConfig, PluginData & AboutData> = {
  name: "about",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: ["neofetch"],
  } as PluginConfig & AboutConfig,

  fetchData: async (config, dev = false, _essentialConfig?, previewMode = false) => {
    return (await fetchAboutData(config, dev, previewMode)) as PluginData & AboutData
  },

  render: (config, data) => {
    const size = ((config as { size?: string }).size === "full" ? "full" : "half") as Size
    return <RenderAbout config={config} data={data} style={styleOf(config)} size={size} />
  },

  // One badge per link, at its own width: a README lays them inline at their natural
  // size, each inside its <a href>, as the hand-made badges they replace.
  tiles: (config, data) => {
    if (!config.sections?.includes("links")) return []
    const style = styleOf(config)
    const brandColors = readFlag(config, "links_brand_colors")
    return data.links.map((link) => {
      const width = badgeWidth(link.label, style)
      return {
        href: link.href,
        title: link.label,
        element: <LinkBadge link={link} style={style} width={width} brandColors={brandColors} />,
        width,
        height: BADGE.height,
        layout: "inline" as const,
      }
    })
  },

  calculateHeight: (config, data, size) => {
    const style = styleOf(config)
    let height = 0
    for (const id of config.sections ?? []) {
      if (id === "neofetch") {
        height += neofetchHeight(style, size, {
          fields: data.neofetch.fields.length,
          hasImage: Boolean(data.neofetch.image),
          showPalette: readFlag(config, "neofetch_show_palette"),
          showCursor: readFlag(config, "neofetch_show_cursor"),
        })
      } else if (id === "links") {
        height += linksHeight(
          style,
          size,
          data.links.map((link) => link.label)
        )
      }
    }
    return height
  },

  styles: ABOUT_CSS,
}

export default aboutPlugin
