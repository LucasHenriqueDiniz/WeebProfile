import React from "react"
import { FaCode, FaDesktop, FaFolderOpen, FaLaptopCode } from "react-icons/fa"
import { keysOf, option, shownUsage } from "../format"
import type { WakaTimeConfig, WakaTimeData, WakaTimeRange, WakaTimeStats, WakaTimeUsageSection } from "../types"
import { CodingTime } from "./CodingTime"
import { UsageSection } from "./UsageSection"

interface RenderWakaTimeProps {
  config: WakaTimeConfig
  data: WakaTimeData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const USAGE: Record<
  WakaTimeUsageSection,
  { title: string; max: number; field: keyof WakaTimeStats; icon: React.ReactElement }
> = {
  languages: { title: "Languages", max: 8, field: "languages", icon: <FaCode /> },
  projects: { title: "Projects", max: 5, field: "projects", icon: <FaFolderOpen /> },
  editors: { title: "Editors", max: 5, field: "editors", icon: <FaLaptopCode /> },
  operating_systems: {
    title: "Operating Systems",
    max: 5,
    field: "operatingSystems",
    icon: <FaDesktop />,
  },
}

/** The stats a section reads: its own range, last 7 days by default. */
export function statsFor(config: WakaTimeConfig, data: WakaTimeData, section: string): WakaTimeStats | undefined {
  const key = keysOf(section)?.range
  const range = (key && option<WakaTimeRange>(config, key)) || "last_7_days"
  return data.stats?.[range]
}

/** What a usage section draws, shared with calculateHeight. */
export function usageFor(config: WakaTimeConfig, stats: WakaTimeStats | undefined, section: WakaTimeUsageSection) {
  const spec = USAGE[section]
  const keys = keysOf(section)!
  const items = (stats?.[spec.field] ?? []) as WakaTimeStats["languages"]
  const ignore = keys.ignore ? option<string>(config, keys.ignore) : undefined
  return shownUsage(items, ignore, (keys.max && option<number>(config, keys.max)) || spec.max)
}

export function RenderWakaTime({
  config,
  data,
  style = "default",
  size = "half",
}: RenderWakaTimeProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) return <></>

  const sections = config.sections.map((section) => {
    const stats = statsFor(config, data, section)
    if (!stats) return null
    const keys = keysOf(section)
    if (!keys) return null
    const hideTitle = option<boolean>(config, keys.hideTitle) ?? false

    if (section === "time") {
      const title = option<string>(config, keys.title) ?? "Coding Time"
      return <CodingTime key={section} stats={stats} title={title} hideTitle={hideTitle} style={style} size={size} />
    }
    if (section in USAGE) {
      const usageSection = section as WakaTimeUsageSection
      const { items: shown, total } = usageFor(config, stats, usageSection)
      return (
        <UsageSection
          key={section}
          section={usageSection}
          stats={stats}
          shown={shown}
          total={total}
          title={option<string>(config, keys.title) ?? USAGE[usageSection].title}
          hideTitle={hideTitle}
          icon={USAGE[usageSection].icon}
          style={style}
          size={size}
        />
      )
    }
    return null
  })

  return <section id="wakatime-plugin">{sections.filter(Boolean)}</section>
}
