/**
 * GitHub Plugin V2
 *
 * Plugin para exibir estatísticas do GitHub
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { EssentialPluginConfig } from "../shared/types/base"
import type { GithubConfig, GithubData } from "./types"
import { TERMINAL_HEADER_HEIGHT } from "../../templates/Terminal/TerminalHeader"
import { RenderGithub } from "./components/RenderGithub"
import { fetchGithubData } from "./services/fetchGithub"

export const githubPlugin: Plugin<PluginConfig & GithubConfig, PluginData & GithubData> = {
  name: "github",
  essentialConfigKeys: ["pat"], // Uses Classic Token instead of OAuth token
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as PluginConfig & GithubConfig,
  fetchData: async (config: PluginConfig & GithubConfig, dev = false, essentialConfig?: EssentialPluginConfig) => {
    // Classic Token must be configured by user
    // In dev mode, token not needed (uses mock)
    const pat = essentialConfig?.pat
    if (!dev && !pat) {
      throw new Error("GitHub Classic Token is required. Please configure it in your profile settings.")
    }
    return (await fetchGithubData(config as GithubConfig, dev, pat)) as PluginData & GithubData
  },
  render: (config: PluginConfig & GithubConfig, data: PluginData & GithubData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderGithub config={config as GithubConfig} data={data as GithubData} style={style} size={size} />
  },
  calculateHeight: (config, data, size = "half") => {
    const cfg = config as GithubConfig
    const gh = data as GithubData
    const isTerminal = (config as { style?: string }).style === "terminal"

    // Height formula for repo-card-style sections: each card is h-[120px], gap-4 (16px)
    const repoCardH = (n: number, hasPager: boolean): number =>
      n > 0 ? 40 + n * 120 + Math.max(0, n - 1) * 16 + (hasPager ? 32 : 0) : 0

    // Terminal "table" sections: TerminalCommand + TerminalGrid header + n rows (+ "+N more" footer)
    const terminalGridH = (n: number, hasMore: boolean): number => (n > 0 ? 52 + n * 20 + (hasMore ? 28 : 0) : 0)

    let h = 0
    for (const s of cfg.sections) {
      switch (s) {
        case "profile":
          h += isTerminal ? 132 : size === "full" ? 127 : 119
          break
        case "repositories":
          h += isTerminal ? 212 : 132
          break
        case "activity":
          h += isTerminal ? 232 : 156
          break
        case "calendar": {
          const yearMode = cfg.calendar_year_mode ?? "current_year"
          const years = gh.calendar?.years?.length ?? 1
          if (years > 1) {
            h += isTerminal ? 1 + years * 175 + 28 : 33 + years * 150 + 28
          } else if (isTerminal) {
            // Command, gap and "N contributions" line (59), plus the grid when there are weeks
            // (none when the fetch failed). The grid is 7 lines of 14px in Chromium, but its
            // symbols fall back to another font and Firefox and WebKit draw it 7 and 6px
            // taller, so it keeps 19px of room.
            h += 59 + ((gh.calendar?.weeks?.length ?? 0) > 0 ? 7 * 14 + 19 : 0)
          } else {
            // Measured in Chromium against Calendar.tsx. Half splits the year in two rows of
            // weeks past 26 weeks (never last_6_months), the rows 16px apart. Each row is 7
            // cells of 0.7rem with 3px between them, plus the month labels (13) and their
            // gap (8). No weeks (the fetch failed) leaves only the weekday labels, if shown.
            // Below the rows: gap (8), margin (8) and the "N contributions" line (16).
            const weeks = gh.calendar?.weeks?.length ?? 0
            const rows = size === "half" && weeks > 26 && yearMode !== "last_6_months" ? 2 : 1
            const grid = weeks > 0 || !cfg.calendar_hide_weeks ? 7 * 11.2 + 6 * 3 : 0
            const monthLabels = weeks > 0 && !cfg.calendar_hide_months ? 13 + 8 : 0
            const title = cfg.calendar_hide_title ? 0 : 40
            h += Math.ceil(title + rows * (grid + monthLabels) + (rows - 1) * 16 + 32)
          }
          break
        }
        case "code_habits": {
          // Measured in Chromium (svg-generator audit:heights). The base includes the
          // stats block; it renders only when commits were read, and languages only
          // when the fetch found some (terminal lists the top 5).
          const habits = gh.codeHabits
          const showsStats = !cfg.code_habits_hide_stats && !!habits?.commitStats
          const languageCount = cfg.code_habits_hide_languages ? 0 : Object.keys(habits?.languages ?? {}).length
          if (isTerminal) {
            h += 978
            if (!showsStats) h -= 103
            if (languageCount > 0) h += 55 + Math.min(languageCount, 5) * 24
          } else if (size === "half") {
            h += 590
            if (!showsStats) h -= 116
            // Two columns make "Commit activity per day of week" wrap.
            if (languageCount > 0) h += 20
          } else {
            h += 563
            if (!showsStats) h -= 84
          }
          break
        }
        case "favorite_languages": {
          const maxLangs = cfg.favorite_languages_max_languages ?? 5
          const n = Math.min(gh.languages?.length ?? maxLangs, maxLangs)
          // ~54px per language row (preview 325px for 5 items: (325-43)/5 = 56.4, rounded up)
          // One formula for both styles; measured in terminal with the header drawn, so
          // the header comes off there (generateSvg counts it once per SVG).
          h += 33 + 11 + n * 54 + Math.max(0, n - 1) * 4 - (isTerminal ? TERMINAL_HEADER_HEIGHT : 0)
          break
        }
        case "favorite_license":
          h += isTerminal ? 118 : 88
          break
        case "introduction": {
          if (!gh.introduction) break
          if (isTerminal) {
            h += 178
          } else {
            h += size === "full" ? 100 : 130
          }
          break
        }
        case "stargazers": {
          const total = gh.stargazers?.repositories?.length ?? 0
          if (total === 0) break
          const n = Math.min(total, 10)
          const hasMore = total > 10
          if (isTerminal) {
            h += terminalGridH(n + 1, hasMore)
          } else {
            h += 109 + n * 80 + Math.max(0, n - 1) * 16 + (hasMore ? 28 : 0)
          }
          break
        }
        case "people": {
          const max = cfg.people_max ?? 10
          const total = gh.people?.totalCount ?? 0
          const n = Math.min(gh.people?.nodes?.length ?? max, max)
          if (n === 0) break
          if (isTerminal) {
            h += terminalGridH(n, false)
          } else {
            const itemsPerRow = size === "full" ? 17 : 8
            const rows = Math.max(1, Math.ceil(n / itemsPerRow))
            h += 33 + rows * 48 + (total > n ? 20 : 0)
          }
          break
        }
        case "starred_repositories": {
          const max = cfg.starred_repositories_max ?? 10
          const n = Math.min(gh.starredRepositories?.nodes?.length ?? max, max)
          const hasPager = (gh.starredRepositories?.totalCount ?? 0) > n
          h += isTerminal ? terminalGridH(n, hasPager) : repoCardH(n, hasPager)
          break
        }
        case "gists": {
          const max = cfg.gists_max ?? 5
          const n = Math.min(gh.gists?.nodes?.length ?? max, max)
          const hasPager = (gh.gists?.totalCount ?? 0) > n
          h += isTerminal ? terminalGridH(n, hasPager) : repoCardH(n, hasPager)
          break
        }
        case "top_repositories": {
          const max = cfg.top_repositories_max ?? 5
          const total = gh.topRepositories?.length ?? 0
          const n = Math.min(total, max)
          const hasMore = total > max
          h += isTerminal ? terminalGridH(n, hasMore) : repoCardH(n, false)
          break
        }
        case "featured_repositories": {
          // Default renders ALL items (no max applied), grid-style cards
          const n = Math.min(gh.featuredRepositories?.length ?? 0, 20)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 33 + n * 123 + Math.max(0, n - 1) * 16
          break
        }
        case "recent_activity": {
          // Items grouped by day, each activity ~85-141px depending on type (files changed stats line)
          const max = cfg.recent_activity_max ?? 10
          const n = Math.min(gh.recentActivity?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? n * 28 - 12 : 33 + n * 124 + Math.max(0, n - 1) * 16
          break
        }
        case "notable_contributions": {
          // h-[100px] fixed per item, gap-3 (12px); preview 1143px for 10 items
          const max = cfg.notable_contributions_max ?? 10
          const n = Math.min(gh.notableContributions?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 40 + n * 100 + Math.max(0, n - 1) * 12
          break
        }
        case "repository_contributors": {
          // grid-cols-2 (half) / grid-cols-3 (full), card ~97px (half) / ~120px (full), gap-3 (12px)
          const max = cfg.repository_contributors_max ?? 10
          const n = Math.min(gh.repositoryContributors?.length ?? max, max)
          if (n === 0) break
          if (isTerminal) {
            h += terminalGridH(n, false)
          } else {
            const cols = size === "full" ? 3 : 2
            const rows = Math.ceil(n / cols)
            h += 33 + rows * 54 + Math.max(0, rows - 1) * 12
          }
          break
        }
        case "sponsors": {
          const max = cfg.sponsors_max ?? 5
          const n = Math.min(gh.sponsors?.nodes?.length ?? max, max)
          if (isTerminal) {
            h += n === 0 ? 48 : terminalGridH(n, false)
          } else {
            h += n > 0 ? 37 + n * 65 + Math.max(0, n - 1) * 8 : 0
          }
          break
        }
        case "sponsorships": {
          const max = cfg.sponsorships_max ?? 5
          const n = Math.min(gh.sponsorships?.nodes?.length ?? max, max)
          if (isTerminal) {
            h += n === 0 ? 48 : terminalGridH(n, false)
          } else {
            h += n > 0 ? 37 + n * 65 + Math.max(0, n - 1) * 8 : 0
          }
          break
        }
        case "star_lists": {
          const max = cfg.star_lists_max ?? 5
          const n = Math.min(gh.starLists?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 356
          break
        }
        default:
          break
      }
    }

    if (gh.warnings && gh.warnings.length > 0) h += 40

    return h
  },
}

export default githubPlugin
