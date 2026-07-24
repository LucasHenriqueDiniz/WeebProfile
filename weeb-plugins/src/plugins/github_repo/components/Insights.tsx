import React from "react"
import { FaCodeBranch, FaStar } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

// calculateHeight() em index.tsx deve ficar em sincronia com esses limites.
const TOPICS_DISPLAY_LIMIT = 6
const LANGUAGES_DISPLAY_LIMIT = 5

interface InsightsProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Sparkline de crescimento de estrelas: linha + área, sem eixos/labels (é um
// "sentimento de tendência", não um gráfico analítico) - dados reais amostrados
// em fetchGithubRepo.ts, não uma curva inventada.
function StarSparkline({ points, color }: { points: { date: string; count: number }[]; color: string }): React.ReactElement | null {
  if (points.length < 2) return null

  const width = 300
  const height = 56
  const counts = points.map((p) => p.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const range = max - min || 1
  const stepX = width / (points.length - 1)

  const coords = points.map((p, i) => {
    const x = Math.round(i * stepX)
    const y = Math.round(height - ((p.count - min) / range) * (height - 4) - 2)
    return { x, y }
  })

  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={areaPath} fill={color} opacity={0.16} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function LanguageBars({ languages, max }: { languages: GithubRepoData["languages"]; max: number }): React.ReactElement | null {
  const visible = languages.slice(0, max)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-default-muted/10">
        {visible.map((lang) => (
          <div key={lang.name} style={{ width: `${lang.percentage}%`, background: lang.color }} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {visible.map((lang) => (
          <span key={lang.name} className="flex items-center gap-1 text-xs text-default-muted">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: lang.color }} />
            {lang.name}
            <span className="text-default-muted/70">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function DefaultInsights({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showGraph = config.insights_show_star_graph ?? true
  const showLanguages = config.insights_show_languages ?? true
  const showTopics = config.insights_show_topics ?? true
  const maxTopics = Math.min(config.max_topics ?? TOPICS_DISPLAY_LIMIT, TOPICS_DISPLAY_LIMIT)
  const maxLanguages = Math.min(config.max_languages ?? LANGUAGES_DISPLAY_LIMIT, LANGUAGES_DISPLAY_LIMIT)
  const accent = data.primaryLanguage?.color || "#8957e5"

  const visibleTopics = data.topics.slice(0, maxTopics)
  const remainingTopics = data.topics.length - visibleTopics.length

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-default-border p-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-none text-default-text">{abbreviateNumber(data.stargazerCount)}</span>
          <span className="mt-1 flex items-center gap-1 text-xs text-default-muted">
            <FaStar className="fill-yellow-500 text-yellow-500" size={10} /> Stars
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-none text-default-text">{abbreviateNumber(data.forkCount)}</span>
          <span className="mt-1 flex items-center gap-1 text-xs text-default-muted">
            <FaCodeBranch size={10} /> Forks
          </span>
        </div>
      </div>

      {showGraph && data.starHistory.length >= 2 && <StarSparkline points={data.starHistory} color={accent} />}

      {showLanguages && <LanguageBars languages={data.languages} max={maxLanguages} />}

      {showTopics && visibleTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-default-primary/20 bg-default-primary/10 px-2 py-0.5 text-xs text-default-primary"
            >
              {topic}
            </span>
          ))}
          {remainingTopics > 0 && <span className="text-xs text-default-muted">+{remainingTopics} more</span>}
        </div>
      )}
    </div>
  )
}

export function Insights({ config, data, style = "default", size = "half" }: InsightsProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  const title = config.insights_title ?? "Insights"
  const hideTitle = config.insights_hide_title ?? false
  const accent = data.primaryLanguage?.color || "#8957e5"

  return (
    <section id="github-repo-insights">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaStar />} />}
            <DefaultInsights data={data} config={config} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({ plugin: "github_repo", section: "insights", size })}
            />
            <div className="flex items-center gap-4 px-1 py-1 text-sm">
              <span className="text-terminal-highlight">⭐ {abbreviateNumber(data.stargazerCount)}</span>
              <span className="text-terminal-muted">🍴 {abbreviateNumber(data.forkCount)}</span>
            </div>
            {(config.insights_show_star_graph ?? true) && data.starHistory.length >= 2 && (
              <div className="px-1 pb-1">
                <StarSparkline points={data.starHistory} color={accent} />
              </div>
            )}
            {(config.insights_show_languages ?? true) && (
              <div className="px-1 pb-1">
                <LanguageBars
                  languages={data.languages}
                  max={Math.min(config.max_languages ?? LANGUAGES_DISPLAY_LIMIT, LANGUAGES_DISPLAY_LIMIT)}
                />
              </div>
            )}
          </>
        }
      />
    </section>
  )
}
