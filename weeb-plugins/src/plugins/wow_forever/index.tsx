/**
 * World of Warcraft: Forever plugin
 *
 * Shows a Forever character, read from the Battle.net API with the application's own
 * client: its render and sheet, gear, attributes, lifetime statistics, professions,
 * reputations, talents, dungeon bosses, recent achievements and collection.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import { RenderWowForever } from "./components/RenderWowForever"
import { sectionHeight, type Size } from "./layout"
import { SECTION_IDS, resolveOptions, sectionBody, type SectionId } from "./options"
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
    const options = resolveOptions(config)
    let height = 0
    for (const id of config.sections ?? []) {
      if (!(SECTION_IDS as readonly string[]).includes(id)) continue
      const body = sectionBody(id as SectionId, data as WowForeverData, options.style, size, options)
      if (body !== null) height += sectionHeight(options.style, options.hideTitle(id as SectionId), body)
    }
    return height
  },
}

export default wowForeverPlugin
