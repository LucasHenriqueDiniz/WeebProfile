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
import { RenderGithub } from "./components/RenderGithub"
import { fetchGithubData } from "./services/fetchGithub"
import {
  DEFAULT_TITLE_HEIGHT,
  TERMINAL_BODY_PADDING,
  codeHabitsHeight,
  favoriteLanguagesHeight,
  favoriteLicenseHeight,
  featuredRepositoriesHeight,
  followupHeight,
  gistsHeight,
  introductionHeight,
  linesHeight,
  notableContributionsHeight,
  peopleHeight,
  recentActivityHeight,
  repositoryContributorsHeight,
  sponsorsHeight,
  sponsorshipsHeight,
  stargazersHeight,
  starListsHeight,
  starredRepositoriesHeight,
  topRepositoriesHeight,
} from "./height"
import { isocalendarHeight } from "./isocalendar"

type CalendarYear = NonNullable<GithubData["calendar"]["years"]>[number]

/**
 * Height of the calendar when it draws one block per year (`calendar_year_mode: "full"`
 * with more than one year), measured in Chromium, Firefox and WebKit against the layout of
 * Calendar.tsx.
 *
 * The default style draws each year as its label plus one row of weeks, or two in half
 * mode once the year has more than 26 weeks. The terminal style draws one grid per year
 * at both sizes (half keeps the last 26 weeks), and has no title or month labels to hide.
 */
function multiYearCalendarHeight(
  cfg: GithubConfig,
  years: CalendarYear[],
  size: "half" | "full",
  isTerminal: boolean
): number {
  if (isTerminal) {
    // Command and "Total" line (51), then per year: label (20) + gap (8) + the grid's 7 rows
    // of 14px + gap (12). The rows and the "Total" line have fixed heights in Calendar.tsx, so
    // the symbols' fallback font no longer makes the grid taller in Firefox and WebKit.
    return 51 + years.length * (20 + 8 + 7 * 14 + 12)
  }

  const yearMode = cfg.calendar_year_mode ?? "current_year"
  const title = cfg.calendar_hide_title ? 0 : 40
  // 7 cells of 0.7rem with 3px between them, plus the month labels (13) and their gap (8)
  const rowH = 7 * 11.2 + 6 * 3 + (cfg.calendar_hide_months ? 0 : 21)
  const yearsH = years.reduce((sum, year) => {
    const rows = size === "half" && year.weeks.length > 26 && yearMode !== "last_6_months" ? 2 : 1
    // Year label (20) + gap (8), the rows 16px apart, then the 16px gap to the next block
    return sum + 28 + rows * rowH + (rows - 1) * 16 + 16
  }, 0)
  // The last block is the "Total: N contributions" line (16)
  return Math.ceil(title + yearsH + 16)
}

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

    let h = 0
    // Terminal sections that draw something. Each terminal height is the section drawn
    // alone, with the body's bottom padding, which the card draws once.
    let terminalSections = 0
    for (const s of cfg.sections) {
      const before = h
      switch (s) {
        case "profile":
          h += isTerminal ? 132 : size === "full" ? 127 : 119
          break
        case "repositories":
          // The title, then the stats grid
          h += isTerminal ? 212 : 132 - (cfg.repositories_hide_title ? DEFAULT_TITLE_HEIGHT : 0)
          break
        case "activity":
          h += isTerminal ? 232 : 156 - (cfg.activity_hide_title ? DEFAULT_TITLE_HEIGHT : 0)
          break
        case "followup":
          h += followupHeight(cfg, gh, size, isTerminal)
          break
        case "calendar": {
          const yearMode = cfg.calendar_year_mode ?? "current_year"
          const years = gh.calendar?.years?.length ?? 1
          if (years > 1) {
            h += multiYearCalendarHeight(cfg, gh.calendar.years ?? [], size, isTerminal)
          } else if (isTerminal) {
            // Command, gap and "N contributions" line (59), plus the grid's 7 rows of 14px when
            // there are weeks (none when the fetch failed). The rows and the line have fixed
            // heights in Calendar.tsx, the same in Chrome, Firefox and WebKit.
            h += 59 + ((gh.calendar?.weeks?.length ?? 0) > 0 ? 7 * 14 : 0)
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
        case "isocalendar":
          h += isocalendarHeight(cfg, gh, size, isTerminal)
          break
        case "code_habits":
          h += codeHabitsHeight(cfg, gh.codeHabits, size, isTerminal)
          break
        case "favorite_languages":
          h += favoriteLanguagesHeight(cfg, gh.languages, isTerminal)
          break
        case "favorite_license":
          h += favoriteLicenseHeight(cfg, isTerminal)
          break
        case "introduction":
          h += introductionHeight(cfg, gh, size, isTerminal)
          break
        case "stargazers":
          h += stargazersHeight(cfg, gh, isTerminal)
          break
        case "people":
          h += peopleHeight(cfg, gh, size, isTerminal)
          break
        case "starred_repositories":
          h += starredRepositoriesHeight(cfg, gh, isTerminal)
          break
        case "gists":
          h += gistsHeight(cfg, gh, isTerminal)
          break
        case "top_repositories":
          h += topRepositoriesHeight(cfg, gh, isTerminal)
          break
        case "featured_repositories":
          h += featuredRepositoriesHeight(cfg, gh, isTerminal)
          break
        case "recent_activity":
          h += recentActivityHeight(cfg, gh, size, isTerminal)
          break
        case "notable_contributions":
          h += notableContributionsHeight(cfg, gh, isTerminal)
          break
        case "repository_contributors":
          h += repositoryContributorsHeight(cfg, gh, size, isTerminal)
          break
        case "sponsors":
          h += sponsorsHeight(cfg, gh, isTerminal)
          break
        case "sponsorships":
          h += sponsorshipsHeight(cfg, gh, isTerminal)
          break
        case "star_lists":
          h += starListsHeight(cfg, gh, size, isTerminal)
          break
        case "lines":
          h += linesHeight(cfg, gh, isTerminal)
          break
        default:
          break
      }
      if (isTerminal && h > before) terminalSections++
    }

    // Counted in every section, drawn once per card: a terminal card of three sections
    // kept 16px of blank under the last one.
    if (terminalSections > 1) h -= (terminalSections - 1) * TERMINAL_BODY_PADDING

    // GithubWarning: one `text-xs` line in `py-2` with `mt-2`; the terminal's has `py-1`,
    // `mt-1` and keeps the paragraph's 12px margins.
    if (gh.warnings && gh.warnings.length > 0) h += isTerminal ? 4 + 4 + 12 + 16 + 12 + 4 : 40

    return h
  },
}

export default githubPlugin
