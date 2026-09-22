import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { abbreviateNumber } from "../../../utils/number"
import type { GitHubProjectData, GitHubProjectConfig } from "../types"

type Skin = "glass" | "solid" | "outline"
type Width = "half" | "full"

interface StatsProps {
  data: GitHubProjectData
  config: GitHubProjectConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const getSkinClasses = (skin: Skin): string => {
  switch (skin) {
    case "glass":
      return "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
    case "solid":
      return "bg-neutral-900 border border-neutral-800"
    case "outline":
      return "bg-transparent border border-neutral-700 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
  }
}

export function Stats({ data, config, style = "default", size = "half" }: StatsProps) {
  const stats = data.stats
  const skin = config.skin || "glass"
  if (!stats) return null

  // Ensure all numeric values are valid
  stats.stars = typeof stats.stars === "number" && !isNaN(stats.stars) ? stats.stars : 0
  stats.forks = typeof stats.forks === "number" && !isNaN(stats.forks) ? stats.forks : 0
  stats.watchers = typeof stats.watchers === "number" && !isNaN(stats.watchers) ? stats.watchers : 0
  stats.open_issues = typeof stats.open_issues === "number" && !isNaN(stats.open_issues) ? stats.open_issues : 0
  stats.pull_requests = typeof stats.pull_requests === "number" && !isNaN(stats.pull_requests) ? stats.pull_requests : 0
  stats.contributors = typeof stats.contributors === "number" && !isNaN(stats.contributors) ? stats.contributors : 0

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<StatsDefault stats={stats} config={config} skin={skin} width={size as Width} />}
      terminalComponent={<StatsTerminal stats={stats} config={config} size={size} />}
    />
  )
}

const StatsDefault = ({
  stats,
  config,
  skin,
  width,
}: {
  stats: any
  config: GitHubProjectConfig
  skin: Skin
  width: Width
}) => {
  const showStars = config.stats_show_stars !== false
  const showForks = config.stats_show_forks !== false
  const showWatchers = config.stats_show_watchers !== false
  const showIssues = config.stats_show_issues !== false
  const showPRs = config.stats_show_pull_requests !== false
  const showContributors = config.stats_show_contributors !== false

  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"
  const gridCols = width === "half" ? "grid-cols-2" : "grid-cols-3"

  const statItems = [
    showStars && {
      icon: "⭐",
      label: "Stars",
      value: stats.stars,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      change: "+12%",
    },
    showForks && {
      icon: "🍴",
      label: "Forks",
      value: stats.forks,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
      change: "+8%",
    },
    showWatchers && {
      icon: "👁️",
      label: "Watchers",
      value: stats.watchers,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+5%",
    },
    showIssues && {
      icon: "⚠️",
      label: "Issues",
      value: stats.open_issues,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "-2%",
    },
    showPRs && {
      icon: "🔄",
      label: "PRs",
      value: stats.pull_requests,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+15%",
    },
    showContributors && {
      icon: "👥",
      label: "Contributors",
      value: stats.contributors,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      change: "+3%",
    },
  ].filter(Boolean) as Array<{
    icon: string
    label: string
    value: number
    color: string
    bgColor: string
    change: string
  }>

  return (
    <div className={`${baseClasses} ${widthClass}`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-default-muted text-sm font-medium uppercase tracking-wider">Repository Stats</h4>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-default-surface text-default-highlight text-xs font-medium border border-default-border">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Live Data
        </div>
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {statItems.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-default-border bg-default-surface/50 hover:bg-default-surface transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <span className={`text-sm ${stat.color}`}>{stat.icon}</span>
              </div>
              <div
                className={`text-xs font-medium ${stat.change?.startsWith("+") ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-default-text mb-1">{abbreviateNumber(stat.value)}</div>
            <div className="text-sm text-default-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const StatsTerminal = ({ stats, config, size }: { stats: any; config: GitHubProjectConfig; size: string }) => {
  const showStars = config.stats_show_stars !== false
  const showForks = config.stats_show_forks !== false
  const showWatchers = config.stats_show_watchers !== false
  const showIssues = config.stats_show_issues !== false
  const showPRs = config.stats_show_pull_requests !== false
  const showContributors = config.stats_show_contributors !== false

  const items = [
    showStars ? `⭐ Stars: ${abbreviateNumber(stats.stars)}` : null,
    showForks ? `🍴 Forks: ${abbreviateNumber(stats.forks)}` : null,
    showWatchers ? `👁️ Watchers: ${abbreviateNumber(stats.watchers)}` : null,
    showIssues ? `⚠️ Issues: ${abbreviateNumber(stats.open_issues)}` : null,
    showPRs ? `🔄 Pull Requests: ${abbreviateNumber(stats.pull_requests)}` : null,
    showContributors ? `👥 Contributors: ${abbreviateNumber(stats.contributors)}` : null,
  ].filter(Boolean)

  const gridData = [
    { title: "Repository Statistics", subtitle: "", value: "" },
    ...items.filter((item) => item !== null).map((item) => ({ title: item!, subtitle: "", value: "" })),
  ]

  return (
    <div className="space-y-3">
      <TerminalCommand command="gh repo view --json name,description,stargazersCount,forkCount,issues,pullRequests,watchers" />
      <TerminalGrid data={gridData} leftText="Stats" />
    </div>
  )
}
