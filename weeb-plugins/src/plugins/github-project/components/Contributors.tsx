import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { abbreviateNumber } from "../../../utils/number"
import type { GitHubProjectData, GitHubProjectConfig } from "../types"

type Skin = "glass" | "solid" | "outline"
type Width = "half" | "full"

interface ContributorsProps {
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

export function Contributors({ data, config, style = "default", size = "half" }: ContributorsProps) {
  const contributors = (data.contributors || []).filter(
    (contributor) => contributor && typeof contributor.contributions === "number" && !isNaN(contributor.contributions)
  )
  const displayMode = config.contributors_display_mode || "compact"
  const avatarSize = config.contributors_avatar_size || "md"
  const skin = config.skin || "glass"

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={
        <ContributorsDefault
          contributors={contributors}
          displayMode={displayMode}
          avatarSize={avatarSize}
          skin={skin}
          width={size as Width}
        />
      }
      terminalComponent={<ContributorsTerminal contributors={contributors} displayMode={displayMode} size={size} />}
    />
  )
}

const ContributorsDefault = ({
  contributors,
  displayMode,
  avatarSize,
  skin,
  width,
}: {
  contributors: any[]
  displayMode: string
  avatarSize: string
  skin: Skin
  width: Width
}) => {
  const baseClasses = `rounded-xl p-6 ${getSkinClasses(skin)}`
  const widthClass = width === "half" ? "w-[415px]" : "w-[830px]"
  const avatarClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  if (displayMode === "compact") {
    return (
      <div className={`${baseClasses} ${widthClass}`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-default-muted text-sm font-medium uppercase tracking-wider">Top Contributors</h4>
          <span className="text-default-muted text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {contributors.length} total
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {contributors.slice(0, width === "half" ? 8 : 12).map((contributor, index) => (
            <div
              key={contributor.login}
              className="relative group"
              style={{ zIndex: (width === "half" ? 8 : 12) - index }}
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className={`${avatarClasses[avatarSize as keyof typeof avatarClasses]} rounded-full border-2 border-default-surface hover:border-default-highlight transition-all duration-200 cursor-pointer`}
              />

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-default-surface border border-default-border rounded-lg text-xs text-default-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-medium">{contributor.login}</div>
                <div className="text-default-muted">{abbreviateNumber(contributor.contributions)} commits</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-default-surface"></div>
              </div>

              <div className="absolute -top-1 -right-1 w-5 h-5 bg-default-highlight border-2 border-default-surface rounded-full flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {contributors.length > (width === "half" ? 8 : 12) && (
          <div className="mt-4 pt-4 border-t border-default-border/30 text-center">
            <span className="text-xs text-default-muted">
              +{contributors.length - (width === "half" ? 8 : 12)} more contributors
            </span>
          </div>
        )}
      </div>
    )
  }

  // List mode
  return (
    <div className={`${baseClasses} ${widthClass}`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-default-muted text-sm font-medium uppercase tracking-wider">Top Contributors</h4>
        <span className="text-default-muted text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          {contributors.length} total
        </span>
      </div>

      <div className="space-y-3">
        {contributors.slice(0, width === "half" ? 4 : 8).map((contributor, index) => (
          <div
            key={contributor.login}
            className="flex items-center gap-4 p-3 rounded-lg border border-default-border hover:bg-default-surface/50 transition-colors"
          >
            <div className="w-6 h-6 bg-default-highlight rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {index + 1}
            </div>

            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className={`${avatarClasses[avatarSize as keyof typeof avatarClasses]} rounded-full border-2 border-default-surface flex-shrink-0`}
            />

            <div className="flex-1 min-w-0">
              <div className="text-default-text font-medium truncate">{contributor.login}</div>
              <div className="text-default-muted text-sm">
                {contributor.type === "User" ? "Contributor" : "Organization"}
              </div>
            </div>

            <div className="flex items-center gap-1 text-default-muted text-sm flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>{abbreviateNumber(contributor.contributions)}</span>
              <span className="hidden sm:inline">commits</span>
            </div>
          </div>
        ))}
      </div>

      {contributors.length > (width === "half" ? 4 : 8) && (
        <div className="mt-4 pt-4 border-t border-default-border/30 text-center">
          <span className="text-xs text-default-muted">
            +{contributors.length - (width === "half" ? 4 : 8)} more contributors
          </span>
        </div>
      )}
    </div>
  )
}

const ContributorsTerminal = ({
  contributors,
  displayMode,
  size,
}: {
  contributors: any[]
  displayMode: string
  size: string
}) => {
  const items = contributors
    .slice(0, size === "half" ? 4 : 8)
    .map((contributor) => `${contributor.login}: ${abbreviateNumber(contributor.contributions)} commits`)

  const gridData = [
    { title: "Top Contributors", subtitle: "", value: "" },
    ...items.map((item) => ({ title: item, subtitle: "", value: "" })),
  ]

  return (
    <div className="space-y-3">
      <TerminalCommand command="gh repo view --json contributors" />
      <TerminalGrid data={gridData} leftText="Contributors" />
    </div>
  )
}
