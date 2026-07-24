import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

interface BannerProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Banner deliberadamente diferente do padrão "título + card" dos outros plugins:
// um bloco só, com gradiente na cor da linguagem principal do repo, avatar do
// owner e o nome em destaque - pensado pra ser o "cabeçalho" visual do card,
// enquanto Insights (abaixo) carrega os números/gráfico.
function DefaultBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const accent = data.primaryLanguage?.color || "#8957e5"
  const showDescription = config.banner_show_description ?? true

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg border border-default-border"
    >
      <div
        className="flex items-center gap-3 p-4"
        style={{ background: `linear-gradient(135deg, ${accent}30 0%, ${accent}08 60%, transparent 100%)` }}
      >
        {data.owner.avatarUrl ? (
          <img
            src={data.owner.avatarUrl}
            alt=""
            className="h-11 w-11 flex-shrink-0 rounded-full border border-default-border"
          />
        ) : (
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: `${accent}25`, color: accent }}
          >
            {data.owner.login.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs text-default-muted">{data.owner.login}</div>
          <div className="truncate text-lg font-bold leading-tight text-default-text">{data.name}</div>
        </div>
        <div className="h-9 w-1 flex-shrink-0 rounded-full" style={{ background: accent }} />
      </div>

      {showDescription && data.description && (
        <p className="border-t border-default-border/50 px-4 py-3 text-sm leading-relaxed text-default-muted line-clamp-2">
          {data.description}
        </p>
      )}
    </a>
  )
}

export function Banner({ config, data, style = "default", size = "half" }: BannerProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  return (
    <section id="github-repo-banner">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<DefaultBanner data={data} config={config} />}
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({ plugin: "github_repo", section: "banner", size })}
            />
            <div className="flex items-baseline gap-2 px-1 py-1">
              <span className="text-terminal-highlight font-bold">{data.nameWithOwner}</span>
            </div>
            {(config.banner_show_description ?? true) && data.description && (
              <p className="px-1 pb-1 text-sm text-terminal-muted">{data.description}</p>
            )}
          </>
        }
      />
    </section>
  )
}
