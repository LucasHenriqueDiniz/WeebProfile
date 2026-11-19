/**
 * World of Warcraft: Forever plugin
 *
 * Shows a Forever character: its render and sheet, its gear and its attributes, read
 * from the Battle.net API with the application's own client.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import { RenderWowForever } from "./components/RenderWowForever"
import { characterBodyHeight, equipmentBodyHeight, sectionHeight, statsBodyHeight, type Size } from "./layout"
import { resolveOptions } from "./options"
import { fetchWowForeverData } from "./services/fetchData"
import type { WowForeverConfig, WowForeverData } from "./types"

export const wowForeverPlugin: Plugin<PluginConfig & WowForeverConfig, PluginData & WowForeverData> = {
  name: "wow_forever",
  // No user secret: the character is public, and the Battle.net client that reads it
  // belongs to the application (BATTLENET_CLIENT_ID/SECRET, see app-credentials.ts).
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & WowForeverConfig,

  fetchData: async (config, dev = false, essentialConfig?: EssentialPluginConfig, previewMode = false) =>
    (await fetchWowForeverData(config, dev, essentialConfig, previewMode)) as PluginData & WowForeverData,

  render: (config, data) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as Size
    return <RenderWowForever config={config} data={data as WowForeverData} style={style} size={size} />
  },

  calculateHeight: (config, data, size = "half") => {
    const wow = data as WowForeverData
    const options = resolveOptions(config)
    const { style } = options
    let height = 0
    for (const id of config.sections ?? []) {
      if (id === "character") {
        height += sectionHeight(style, options.characterHideTitle, characterBodyHeight(style, size, wow))
      } else if (id === "equipment") {
        const items = Math.min(wow.equipment.length, options.equipmentMax)
        if (items > 0) {
          height += sectionHeight(style, options.equipmentHideTitle, equipmentBodyHeight(style, size, items))
        }
      } else if (id === "stats") {
        if (wow.stats.length > 0) {
          height += sectionHeight(style, options.statsHideTitle, statsBodyHeight(style, size, wow.stats.length))
        }
      }
    }
    return height
  },
}

export default wowForeverPlugin
