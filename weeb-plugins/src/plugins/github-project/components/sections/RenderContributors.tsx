import React from "react"
import { GitHubContributor } from "../../types"

interface RenderContributorsProps {
  contributors: GitHubContributor[]
  limit?: number
  size?: "half" | "full"
  styleMode?: "default" | "terminal"
  displayMode?: "compact" | "list"
  avatarSize?: "small" | "medium" | "large"
}

export function RenderContributors({
  contributors,
  limit = 8,
  size = "full",
  styleMode = "default",
  displayMode = "list",
  avatarSize = "medium",
}: RenderContributorsProps) {
  const topContributors = contributors.slice(0, limit)

  if (topContributors.length === 0) {
    return null
  }

  // Terminal mode with emojis - usando sistema de temas
  if (styleMode === "terminal") {
    return (
      <div className="terminal-container p-4 rounded-lg border">
        <div className="terminal-line">
          <span className="text-terminal-highlight">git contributors</span>
        </div>
        {topContributors.map((contributor) => (
          <div key={contributor.login} className="terminal-line">
            <span className="text-terminal-default">
              👤 {contributor.login}: {contributor.contributions} contributions
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Avatar size mapping
  const avatarSizes = {
    small: 24,
    medium: 32,
    large: 48,
  }

  const avatarSizeValue = avatarSizes[avatarSize]

  // Compact mode - usando sistema de temas
  if (displayMode === "compact") {
    return (
      <div className="default-container p-4 rounded-xl shadow-lg border">
        <h4 className="text-default-text text-base font-semibold mb-3">Top Contributors</h4>
        <div className="flex flex-wrap gap-2">
          {topContributors.map((contributor) => (
            <div
              key={contributor.login}
              className="relative inline-block"
              title={`${contributor.login} (${contributor.contributions} contributions)`}
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-8 h-8 rounded-full border-2 border-default-muted transition-all duration-200 hover:border-default-highlight hover:scale-110 cursor-pointer"
                style={{
                  width: `${avatarSizeValue}px`,
                  height: `${avatarSizeValue}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // List mode - usando sistema de temas
  return (
    <div className="default-container p-5 rounded-xl shadow-lg border">
      <h4 className="text-default-text text-base font-semibold mb-4">Top Contributors</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topContributors.map((contributor) => (
          <div
            key={contributor.login}
            className="flex items-center gap-3 p-3 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="rounded-full border-2 border-default-muted"
              style={{
                width: `${avatarSizeValue}px`,
                height: `${avatarSizeValue}px`,
              }}
            />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-default-text text-sm font-medium">{contributor.login}</span>
              <span className="text-default-muted text-xs">{contributor.contributions} contributions</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
