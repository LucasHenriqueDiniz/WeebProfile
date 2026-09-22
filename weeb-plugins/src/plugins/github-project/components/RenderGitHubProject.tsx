import type { GitHubProjectConfig, GitHubProjectData } from "../types"
import { Banner } from "./Banner"
import { Contributors } from "./Contributors"
import { Languages } from "./Languages"
import { StarHistory } from "./StarHistory"
import { Stats } from "./Stats"

interface RenderGitHubProjectProps {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size?: "full" | "half"
  style?: "default" | "terminal"
}

export function RenderGitHubProject({ data, config, size = "half", style = "default" }: RenderGitHubProjectProps) {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  // Verificar se há dados para renderizar
  if (!data || Object.keys(data).length === 0) {
    return null
  }

  // Renderizar cada seção solicitada
  const renderedSections = config.sections
    .map((section) => {
      switch (section) {
        case "banner":
          return <Banner key="banner" data={data} config={config} style={style} size={size} />
        case "stats":
          return data.stats ? <Stats key="stats" data={data} config={config} style={style} size={size} /> : null
        case "languages":
          return <Languages key="languages" data={data} config={config} style={style} size={size} />
        case "contributors":
          return <Contributors key="contributors" data={data} config={config} style={style} size={size} />
        case "starHistory":
          return <StarHistory key="starHistory" data={data} config={config} style={style} size={size} />
        default:
          return null
      }
    })
    .filter(Boolean)

  return <div className="space-y-4">{renderedSections}</div>
}

// Banner Card Component
function BannerCard({
  data,
  config,
  size,
  style,
}: {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size: "full" | "half"
  style: "default" | "terminal"
}) {
  const bannerStyle = config.banner_style || "modern"
  const showStars = config.banner_show_stars !== false
  const showForks = config.banner_show_forks !== false
  const showDescription = config.banner_show_description !== false

  const repo = data.repository

  if (bannerStyle === "modern") {
    return (
      <div className={`github-card glass ${size}`}>
        <div className="banner-header">
          <div className="banner-avatar-container">
            <div className="banner-avatar">
              <svg className="w-7 h-7 text-default-highlight" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="banner-avatar-star">
              <span className="text-xs font-bold text-white">★</span>
            </div>
          </div>

          <div className="banner-repo-info">
            <div className="banner-repo-name">{repo.name}</div>

            <div className="banner-repo-badges">
              <span className="banner-badge primary">Public</span>
              <span className="banner-badge secondary">MIT License</span>
            </div>

            {showDescription && repo.description && <div className="banner-description">{repo.description}</div>}

            <div className="banner-stats">
              {showStars && (
                <div className="banner-stat">
                  <svg className="w-4 h-4 banner-stat-icon star" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{repo.stargazers_count}</span>
                  <span className="text-default-muted text-sm">stars</span>
                </div>
              )}

              {showForks && (
                <div className="banner-stat">
                  <svg className="w-4 h-4 banner-stat-icon fork" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.55 0-10 4.45-10 10 0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12c0-5.55-4.45-10-10-10z" />
                  </svg>
                  <span>{repo.forks_count}</span>
                  <span className="text-default-muted text-sm">forks</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (bannerStyle === "minimal") {
    return (
      <div className={`github-card solid ${size}`}>
        <div className="minimal-header">
          <div className="minimal-avatar">
            <svg className="w-5 h-5 text-default-highlight" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          <div className="minimal-repo-info">
            <div className="minimal-repo-name">{repo.name}</div>
            <div className="minimal-repo-meta">Public repository</div>
          </div>
        </div>

        <div className="minimal-stats">
          {showStars && (
            <div className="minimal-stat">
              <svg className="w-4 h-4 minimal-stat-icon star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{repo.stargazers_count}</span>
            </div>
          )}

          {showForks && (
            <div className="minimal-stat">
              <svg className="w-4 h-4 minimal-stat-icon fork" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-5.55 0-10 4.45-10 10 0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12c0-5.55-4.45-10-10-10z" />
              </svg>
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Detailed style
  return (
    <div className={`github-card outline ${size}`}>
      <div className="detailed-content">
        <div className="detailed-header">
          <div className="detailed-avatar">
            <svg className="w-8 h-8 text-default-highlight" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          <div className="detailed-repo-info">
            <div className="detailed-repo-header">
              <div className="detailed-repo-name">{repo.name}</div>
              <div className="detailed-repo-badge">Public</div>
            </div>

            {showDescription && repo.description && <div className="detailed-description">{repo.description}</div>}

            {repo.topics && repo.topics.length > 0 && (
              <div className="detailed-topics">
                {repo.topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="detailed-topic">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="detailed-stats-grid">
          <div className="detailed-stat-card">
            <div className="detailed-stat-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="detailed-stat-content">
              <div className="detailed-stat-value">{repo.stargazers_count}</div>
              <div className="detailed-stat-label">Stars</div>
            </div>
          </div>

          <div className="detailed-stat-card">
            <div className="detailed-stat-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-5.55 0-10 4.45-10 10 0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12c0-5.55-4.45-10-10-10z" />
              </svg>
            </div>
            <div className="detailed-stat-content">
              <div className="detailed-stat-value">{repo.forks_count}</div>
              <div className="detailed-stat-label">Forks</div>
            </div>
          </div>

          <div className="detailed-stat-card">
            <div className="detailed-stat-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="detailed-stat-content">
              <div className="detailed-stat-value">{repo.open_issues_count}</div>
              <div className="detailed-stat-label">Issues</div>
            </div>
          </div>

          <div className="detailed-stat-card">
            <div className="detailed-stat-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="detailed-stat-content">
              <div className="detailed-stat-value">{data.contributors?.length || 0}</div>
              <div className="detailed-stat-label">Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
function StatsCard({
  data,
  config,
  size,
  style,
}: {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size: "full" | "half"
  style: "default" | "terminal"
}) {
  const stats = data.stats
  if (!stats) return null

  const showStars = config.stats_show_stars !== false
  const showForks = config.stats_show_forks !== false
  const showWatchers = config.stats_show_watchers !== false
  const showIssues = config.stats_show_issues !== false
  const showPRs = config.stats_show_pull_requests !== false
  const showContributors = config.stats_show_contributors !== false

  const gridCols = size === "half" ? "grid-cols-2" : "grid-cols-3"

  return (
    <div className={`github-card solid ${size}`}>
      <div className="stats-header">
        <div className="stats-title">Repository Stats</div>
        <div className="stats-badge">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Live Data
        </div>
      </div>

      <div className={`stats-grid ${gridCols}`}>
        {showStars && (
          <div className="stat-card star">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon star" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="stat-change positive">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                +12%
              </div>
            </div>
            <div className="stat-value">{stats.stars}</div>
            <div className="stat-label">Stars</div>
          </div>
        )}

        {showForks && (
          <div className="stat-card fork">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon fork" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-5.55 0-10 4.45-10 10 0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12c0-5.55-4.45-10-10-10z" />
                </svg>
              </div>
              <div className="stat-change positive">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                +8%
              </div>
            </div>
            <div className="stat-value">{stats.forks}</div>
            <div className="stat-label">Forks</div>
          </div>
        )}

        {showWatchers && (
          <div className="stat-card watcher">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon watcher" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="stat-change positive">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                +5%
              </div>
            </div>
            <div className="stat-value">{stats.watchers}</div>
            <div className="stat-label">Watchers</div>
          </div>
        )}

        {showIssues && (
          <div className="stat-card issue">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon issue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="stat-change negative">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
                -2%
              </div>
            </div>
            <div className="stat-value">{stats.open_issues}</div>
            <div className="stat-label">Issues</div>
          </div>
        )}

        {showPRs && (
          <div className="stat-card pr">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon pr" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98zM16 18H4V6h12v12z" />
                </svg>
              </div>
              <div className="stat-change positive">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                +15%
              </div>
            </div>
            <div className="stat-value">{stats.pull_requests}</div>
            <div className="stat-label">PRs</div>
          </div>
        )}

        {showContributors && (
          <div className="stat-card contributor">
            <div className="stat-header">
              <div className="stat-icon-container">
                <svg className="w-5 h-5 stat-icon contributor" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="stat-change positive">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                +3%
              </div>
            </div>
            <div className="stat-value">{stats.contributors}</div>
            <div className="stat-label">Contributors</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Languages Card Component
function LanguagesCard({
  data,
  config,
  size,
  style,
}: {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size: "full" | "half"
  style: "default" | "terminal"
}) {
  const languages = data.languages || []
  const languagesStyle = config.languages_style || "bars"

  if (languagesStyle === "bars") {
    return (
      <div className={`github-card solid ${size}`}>
        <div className="languages-header">
          <div className="languages-title">Languages</div>
          <div className="languages-count">{languages.length} languages</div>
        </div>

        <div className="languages-list">
          {languages.slice(0, size === "half" ? 5 : 6).map((lang) => (
            <div key={lang.language} className="language-item">
              <div className="language-header">
                <div className="language-info">
                  <div
                    className="language-color"
                    style={{
                      backgroundColor: `hsl(${Math.abs(lang.language.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`,
                    }}
                  />
                  <div className="language-name">{lang.language}</div>
                </div>
                <div className="language-percentage">{lang.percentage}%</div>
              </div>

              <div className="language-bar-container">
                <div className="language-bar-fill" style={{ width: `${lang.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        {languages.length > (size === "half" ? 5 : 6) && (
          <div className="mt-4 pt-4 border-t border-default-border/30 text-center">
            <span className="text-xs text-default-muted">
              +{languages.length - (size === "half" ? 5 : 6)} more languages
            </span>
          </div>
        )}
      </div>
    )
  }

  // Circles style - simplified donut chart
  const total = languages.reduce((sum, lang) => sum + lang.percentage, 0)

  return (
    <div className={`github-card solid ${size}`}>
      <div className="languages-header">
        <div className="languages-title">Languages</div>
        <div className="languages-count">{languages.length} languages</div>
      </div>

      <div className="languages-chart-container">
        <div className="languages-donut">
          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90 transform">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-default-muted/20"
            />

            {languages.slice(0, 6).map((lang, index) => {
              const strokeDasharray = `${(lang.percentage / total) * 100} ${100 - (lang.percentage / total) * 100}`
              const cumulativePercentage = languages.slice(0, index).reduce((sum, l) => sum + l.percentage, 0)
              const strokeDashoffset = -cumulativePercentage

              return (
                <circle
                  key={lang.language}
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={`hsl(${Math.abs(lang.language.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              )
            })}
          </svg>

          <div className="languages-donut-center">
            <div className="languages-donut-value">{languages.length}</div>
            <div className="languages-donut-label">langs</div>
          </div>
        </div>

        <div className="languages-legend">
          {languages.slice(0, 6).map((lang) => (
            <div key={lang.language} className="legend-item">
              <div
                className="legend-color"
                style={{
                  backgroundColor: `hsl(${Math.abs(lang.language.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`,
                }}
              />
              <div className="legend-content">
                <div className="legend-name">{lang.language}</div>
                <div className="legend-percentage">{lang.percentage}%</div>
              </div>
            </div>
          ))}

          {languages.length > 6 && (
            <div className="col-span-full text-center pt-2 border-t border-default-border/30">
              <span className="text-xs text-default-muted">+{languages.length - 6} more languages</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Contributors Card Component
function ContributorsCard({
  data,
  config,
  size,
  style,
}: {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size: "full" | "half"
  style: "default" | "terminal"
}) {
  const contributors = data.contributors || []
  const displayMode = config.contributors_display_mode || "compact"
  const avatarSize = config.contributors_avatar_size || "md"
  const limit = config.contributors_limit || 8

  const avatarClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  if (displayMode === "compact") {
    return (
      <div className={`github-card solid ${size}`}>
        <div className="contributors-header">
          <div className="contributors-title">Top Contributors</div>
          <div className="contributors-count">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {contributors.length} total
          </div>
        </div>

        <div className="contributors-compact">
          <div className={`contributors-grid-compact ${size === "half" ? "max-w-[300px]" : "max-w-[500px]"}`}>
            {contributors.slice(0, size === "half" ? 8 : 12).map((contributor, index) => (
              <div
                key={contributor.login}
                className="contributor-compact-item"
                style={{ zIndex: (size === "half" ? 8 : 12) - index }}
              >
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className={`contributor-compact-avatar ${avatarClasses[avatarSize as keyof typeof avatarClasses]}`}
                />

                <div className="contributor-rank">{index + 1}</div>

                <div className="contributor-tooltip">
                  <div className="font-medium">{contributor.login}</div>
                  <div className="text-default-muted">{contributor.contributions} commits</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {contributors.length > (size === "half" ? 8 : 12) && (
          <div className="mt-4 pt-4 border-t border-default-border/30 text-center">
            <span className="text-xs text-default-muted">
              +{contributors.length - (size === "half" ? 8 : 12)} more contributors
            </span>
          </div>
        )}
      </div>
    )
  }

  // List mode
  return (
    <div className={`github-card solid ${size}`}>
      <div className="contributors-header">
        <div className="contributors-title">Top Contributors</div>
        <div className="contributors-count">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          {contributors.length} total
        </div>
      </div>

      <div className="contributors-list">
        <div className="contributors-list-items">
          {contributors.slice(0, size === "half" ? 4 : 8).map((contributor, index) => (
            <div key={contributor.login} className="contributor-list-item">
              <div className="contributor-rank-badge">{index + 1}</div>

              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className={`contributor-list-avatar ${avatarClasses[avatarSize as keyof typeof avatarClasses]}`}
              />

              <div className="contributor-list-info">
                <div className="contributor-list-name">{contributor.login}</div>
                <div className="contributor-list-type">
                  {contributor.type === "User" ? "Contributor" : "Organization"}
                </div>
              </div>

              <div className="contributor-list-stats">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>{contributor.contributions}</span>
                <span className="text-xs">commits</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {contributors.length > (size === "half" ? 4 : 8) && (
        <div className="mt-4 pt-4 border-t border-default-border/30 text-center">
          <span className="text-xs text-default-muted">
            +{contributors.length - (size === "half" ? 4 : 8)} more contributors
          </span>
        </div>
      )}
    </div>
  )
}

// Star History Card Component
function StarHistoryCard({
  data,
  config,
  size,
  style,
}: {
  data: GitHubProjectData
  config: GitHubProjectConfig
  size: "full" | "half"
  style: "default" | "terminal"
}) {
  const starHistory = data.starHistory || []
  const bucket = config.starHistory_bucket || "auto"

  if (!starHistory.length) {
    return (
      <div className={`github-card solid ${size}`}>
        <div className="star-history-header">
          <div className="star-history-title">Star History</div>
          <div className="px-3 py-1 rounded-full bg-default-muted/20 text-default-muted text-sm">No data available</div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="w-12 h-12 text-default-muted/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <p className="text-default-muted">Star history data not available</p>
          </div>
        </div>
      </div>
    )
  }

  const currentStars = starHistory[starHistory.length - 1]?.stars_total || 0
  const initialStars = starHistory[0]?.stars_total || 0
  const totalGrowth = currentStars - initialStars
  const growthPercentage = initialStars > 0 ? (totalGrowth / initialStars) * 100 : 0

  return (
    <div className={`github-card solid ${size}`}>
      <div className="star-history-header">
        <div className="star-history-title">Star History</div>

        <div className="star-history-current">
          <div className="star-history-value">{currentStars}</div>
          <div className={`star-history-growth ${totalGrowth >= 0 ? "positive" : "negative"}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d={totalGrowth >= 0 ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} />
            </svg>
            {totalGrowth >= 0 ? "+" : ""}
            {totalGrowth} ({growthPercentage >= 0 ? "+" : ""}
            {growthPercentage.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="star-history-summary">
        <div className="star-history-summary-item">
          <div className="star-history-summary-value">{currentStars}</div>
          <div className="star-history-summary-label">Current</div>
        </div>
        <div className="star-history-summary-item">
          <div className={`star-history-summary-value ${totalGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalGrowth >= 0 ? "+" : ""}
            {totalGrowth}
          </div>
          <div className="star-history-summary-label">Growth</div>
        </div>
        <div className="star-history-summary-item">
          <div className="star-history-summary-value">
            +{starHistory.length > 1 ? (totalGrowth / (starHistory.length - 1)).toFixed(1) : "0"}/period
          </div>
          <div className="star-history-summary-label">Average</div>
        </div>
      </div>

      <div className="star-history-chart-container">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="star-history-chart">
          <defs>
            <linearGradient id={`starGradient-${bucket}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            points={`0,100 ${starHistory
              .map((d, i) => {
                const x = (i / (starHistory.length - 1)) * 100
                const y = 100 - ((d.stars_total - initialStars) / (currentStars - initialStars || 1)) * 70
                return `${x},${y}`
              })
              .join(" ")} 100,100`}
            fill={`url(#starGradient-${bucket})`}
            className="drop-shadow-sm"
          />

          {/* Line */}
          <polyline
            points={starHistory
              .map((d, i) => {
                const x = (i / (starHistory.length - 1)) * 100
                const y = 100 - ((d.stars_total - initialStars) / (currentStars - initialStars || 1)) * 70
                return `${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke="rgb(234, 179, 8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-md"
          />

          {/* Data points */}
          {starHistory.map((d, i) => {
            const x = (i / (starHistory.length - 1)) * 100
            const y = 100 - ((d.stars_total - initialStars) / (currentStars - initialStars || 1)) * 70
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="rgb(234, 179, 8)"
                stroke="white"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
            )
          })}
        </svg>

        <div className="star-history-grid">
          <div className="star-history-grid-line" style={{ top: "25%" }} />
          <div className="star-history-grid-line" style={{ top: "50%" }} />
          <div className="star-history-grid-line" style={{ top: "75%" }} />
        </div>
      </div>

      <div className="star-history-x-labels">
        {starHistory
          .filter((_, i) => i % Math.ceil(starHistory.length / 5) === 0)
          .map((d, i) => (
            <div key={i} className="star-history-x-label">
              {d.date}
            </div>
          ))}
      </div>
    </div>
  )
}
