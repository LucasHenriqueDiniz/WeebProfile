import { FaBug, FaCodeBranch, FaEye, FaStar, FaUsers } from "react-icons/fa"
import { GitHubStats } from "../../types"

interface RenderStatsProps {
  stats: GitHubStats
  _size?: "half" | "full"
  styleMode?: "default" | "terminal"
}

export function RenderStats({ stats, _size = "full", styleMode = "default" }: RenderStatsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Terminal mode with emojis - usando sistema de temas
  if (styleMode === "terminal") {
    return (
      <div className="terminal-container p-4 rounded-lg border">
        <div className="terminal-line">
          <span className="text-terminal-highlight">git stats</span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">⭐ {formatNumber(stats.stars)} stars</span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">🔀 {formatNumber(stats.forks)} forks</span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">👁️ {formatNumber(stats.watchers)} watchers</span>
        </div>
        <div className="terminal-line">
          <span className="text-terminal-default">🐛 {formatNumber(stats.open_issues)} issues</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="github-stats">
        <h4 className="stats-title">Repository Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{formatNumber(stats.stars)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <FaCodeBranch className="text-default-muted text-xl" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-default-text text-base font-bold">{formatNumber(stats.forks)}</span>
              <span className="text-default-muted text-xs font-medium uppercase tracking-wide">Forks</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <FaEye className="text-default-success text-xl" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-default-text text-base font-bold">{formatNumber(stats.watchers)}</span>
              <span className="text-default-muted text-xs font-medium uppercase tracking-wide">Watchers</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <FaBug className="text-red-500 text-xl" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-default-text text-base font-bold">{formatNumber(stats.open_issues)}</span>
              <span className="text-default-muted text-xs font-medium uppercase tracking-wide">Issues</span>
            </div>
          </div>
          {stats.contributors !== undefined && (
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-default-surface hover:bg-default-muted transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
              <FaUsers className="text-blue-500 text-xl" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-default-text text-base font-bold">{formatNumber(stats.contributors)}</span>
                <span className="text-default-muted text-xs font-medium uppercase tracking-wide">Contributors</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
