/**
 * WakaTime mock data, for dev mode and the previews
 */

import type { WakaTimeData, WakaTimeRange, WakaTimeStats } from "../types"

const HOUR = 3600

function mockStats(range: WakaTimeRange, scale: number, humanReadableRange: string): WakaTimeStats {
  const s = (hours: number) => Math.round(hours * HOUR * scale)
  return {
    range,
    humanReadableRange,
    isUpToDate: true,
    // The languages add up to 38.8 h; WakaTime's total leaves "Other" out.
    totalSeconds: s(38.4),
    dailyAverageSeconds: Math.round(5.5 * HOUR),
    bestDay: { date: "2026-11-16", seconds: Math.round(9.2 * HOUR) },
    languages: [
      { name: "TypeScript", seconds: s(17.1), color: "#2b7489" },
      { name: "Python", seconds: s(7.6), color: "#3572A5" },
      { name: "Rust", seconds: s(4.3), color: "#dea584" },
      { name: "Markdown", seconds: s(3.2), color: "#083fa1" },
      { name: "YAML", seconds: s(2.1), color: "#cb171e" },
      { name: "JSON", seconds: s(1.6), color: "#292929" },
      { name: "Bash", seconds: s(1.2), color: "#89e051" },
      { name: "CSS", seconds: s(0.8), color: "#563d7c" },
      { name: "SQL", seconds: s(0.5), color: "#e38c00" },
      { name: "Other", seconds: s(0.4) },
    ],
    projects: [
      { name: "weeb-profile", seconds: s(16.2) },
      { name: "dotfiles", seconds: s(6.9) },
      { name: "rust-raytracer", seconds: s(5.1) },
      { name: "blog", seconds: s(4.4) },
      { name: "advent-of-code", seconds: s(3.7) },
      { name: "scratch", seconds: s(2.5) },
    ],
    editors: [
      { name: "VS Code", seconds: s(24.8), color: "#007acc" },
      { name: "Neovim", seconds: s(9.3), color: "#57A143" },
      { name: "Zed", seconds: s(3.1), color: "#084CCF" },
      { name: "Terminal", seconds: s(1.6) },
    ],
    operatingSystems: [
      { name: "Mac", seconds: s(29.5) },
      { name: "Linux", seconds: s(9.3) },
    ],
  }
}

export function getMockWakaTimeData(): WakaTimeData {
  return {
    stats: {
      last_7_days: mockStats("last_7_days", 1, "last 7 days"),
      last_30_days: mockStats("last_30_days", 4.1, "last 30 days"),
      last_6_months: mockStats("last_6_months", 23, "last 6 months"),
      last_year: mockStats("last_year", 44, "last year"),
      all_time: mockStats("all_time", 120, "since Mar 3 2021"),
    },
  }
}
