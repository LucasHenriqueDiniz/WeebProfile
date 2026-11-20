/**
 * WakaTime Plugin
 *
 * Coding time by language, project, editor and operating system, from the WakaTime stats API.
 * A port of the sections of lowlighter/metrics' wakatime plugin (MIT), reimplemented.
 */

import React from "react"
import type { PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import type { Plugin } from "../shared/types/plugin"
import { RenderWakaTime } from "./components/RenderWakaTime"
import { wakatimeHeight } from "./height"
import { fetchWakaTimeData } from "./services/fetchData"
import type { WakaTimeConfig, WakaTimeData } from "./types"

export const wakatimePlugin: Plugin<WakaTimeConfig, PluginData & WakaTimeData> = {
  name: "wakatime",
  essentialConfigKeys: ["token"],
  config: {
    enabled: false,
    sections: [],
  } as WakaTimeConfig,
  fetchData: async (config, dev = false, essentialConfig?: EssentialPluginConfig, previewMode = false) => {
    return (await fetchWakaTimeData(config, dev, essentialConfig?.token, previewMode)) as PluginData & WakaTimeData
  },
  render: (config, data) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderWakaTime config={config} data={data as WakaTimeData} style={style} size={size} />
  },
  calculateHeight: (config, data, size) => wakatimeHeight(config, data as WakaTimeData, size),
}

export default wakatimePlugin
