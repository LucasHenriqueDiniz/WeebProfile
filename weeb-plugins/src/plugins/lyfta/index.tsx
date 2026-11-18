/**
 * Lyfta Plugin V2
 *
 * Plugin para exibir estatísticas de treino do Lyfta
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import type { LyftaConfig, LyftaData } from "./types"
import { RenderLyfta } from "./components/RenderLyfta"
import { fetchLyftaData } from "./services/fetchData"
import {
  favoriteExercise,
  lastWorkoutTopExercises,
  latestWorkout,
  lyftaOptions,
  overviewTileCount,
  recentWorkouts,
  topExercises,
} from "./selection"
import { parseWorkoutTitle } from "./utils/format"

export const lyftaPlugin: Plugin<PluginConfig & LyftaConfig, PluginData & LyftaData> = {
  name: "lyfta",
  essentialConfigKeys: ["apiKey"],
  config: {
    enabled: false,
    sections: [],
  } as PluginConfig & LyftaConfig,
  fetchData: async (
    config: PluginConfig & LyftaConfig,
    dev = false,
    essentialConfig?: EssentialPluginConfig,
    previewMode = false
  ) => {
    const apiKey = essentialConfig?.apiKey
    return (await fetchLyftaData(config as LyftaConfig, dev, apiKey, previewMode)) as PluginData & LyftaData
  },
  render: (config: PluginConfig & LyftaConfig, data: PluginData & LyftaData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderLyfta config={config as LyftaConfig} data={data as LyftaData} style={style} size={size} />
  },
  calculateHeight: (config, data, size = "half") => {
    const ne = lyftaOptions(config as LyftaConfig)
    const ld = data as LyftaData
    const isTerminal = (config as { style?: string }).style === "terminal"
    const half = size === "half"

    // Default style, measured in Chromium (audit:heights): the sections are flex
    // columns with an 8px gap, so a title costs its 40px plus the gap under it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40 + 8)
    const tile = half ? 56 : 60 // StatTile
    const tiles = (n: number): number => {
      const rows = half ? Math.ceil(n / 2) : 1
      return rows * tile + (rows - 1) * 8
    }
    const ROW = 44 // ExerciseRow, and a recent workout row
    // Terminal: the command line (24px) and 20px per line. The body adds 8px once.
    const terminal = (lines: number): number => 24 + lines * 20

    let h = 0
    for (const s of config.sections) {
      if (s === "statistics") {
        if (!ld?.statistics || !ld.workouts) continue
        const favorite = favoriteExercise(ld.workouts) ? 1 : 0
        h += isTerminal ? terminal(5 + favorite) : title(ne.statistics_hide_title) + tiles(4) + favorite * (8 + 36)
      } else if (s === "overview") {
        if (!ld?.workoutSummaries?.length) continue
        const n = overviewTileCount(ne)
        h += isTerminal ? terminal(n) : title(ne.overview_hide_title) + tiles(n)
      } else if (s === "last_workout") {
        const workout = ld?.workouts?.length ? latestWorkout(ld.workouts) : undefined
        if (!workout) continue
        const n = lastWorkoutTopExercises(workout, ne).length
        if (isTerminal) {
          const bodyWeight = ne.last_workout_show_body_weight !== false && workout.body_weight > 0 ? 1 : 0
          h += terminal(3 + bodyWeight + n)
        } else {
          // Header card: 2px border, 20px padding, name (20) + 6 + details (16), + 6 + chips (18).
          const chips = parseWorkoutTitle(workout.title).muscles.length > 0 ? 6 + 18 : 0
          const header = 2 + 20 + 20 + 6 + 16 + chips
          h += title(ne.last_workout_hide_title) + header + (n > 0 ? 8 + n * ROW : 0)
        }
      } else if (s === "exercises") {
        const n = ld?.workouts?.length ? topExercises(ld, ne).length : 0
        if (n === 0) continue
        h += isTerminal ? terminal(n) : title(ne.exercises_hide_title) + n * ROW
      } else if (s === "recent_workouts") {
        const n = recentWorkouts(ld, ne).length
        if (n === 0) continue
        h += isTerminal ? terminal(n) : title(ne.recent_workouts_hide_title) + n * ROW + (n - 1) * 6
      }
    }
    return isTerminal && h > 0 ? h + 8 : h
  },
}

export default lyftaPlugin
