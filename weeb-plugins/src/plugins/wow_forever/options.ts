import type { Style } from "./layout"
import { MAX_EQUIPMENT } from "./services/fetchData"
import type { WowForeverConfig } from "./types"

/**
 * The section options as the components and calculateHeight read them. Options arrive at
 * the root of the config; the PluginManager also copies them to `nonEssential`.
 */
export interface WowForeverOptionsResolved {
  style: Style
  characterTitle: string
  characterHideTitle: boolean
  equipmentTitle: string
  equipmentHideTitle: boolean
  equipmentMax: number
  statsTitle: string
  statsHideTitle: boolean
}

function read<T>(config: WowForeverConfig, key: string): T | undefined {
  return (config[key] ?? config.nonEssential?.[key]) as T | undefined
}

export function resolveOptions(config: WowForeverConfig): WowForeverOptionsResolved {
  const max = Number(read<number>(config, "equipment_max"))
  return {
    style: (config as { style?: string }).style === "terminal" ? "terminal" : "default",
    characterTitle: read<string>(config, "character_title") || "Character",
    characterHideTitle: read<boolean>(config, "character_hide_title") === true,
    equipmentTitle: read<string>(config, "equipment_title") || "Equipment",
    equipmentHideTitle: read<boolean>(config, "equipment_hide_title") === true,
    equipmentMax: Number.isFinite(max) && max > 0 ? Math.min(Math.floor(max), MAX_EQUIPMENT) : MAX_EQUIPMENT,
    statsTitle: read<string>(config, "stats_title") || "Attributes",
    statsHideTitle: read<boolean>(config, "stats_hide_title") === true,
  }
}
