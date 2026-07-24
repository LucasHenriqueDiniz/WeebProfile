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

function OwnerAvatar({ data, accent, size }: { data: GithubRepoData; accent: string; size: number }): React.ReactElement {
  if (data.owner.avatarUrl) {
    return (
      <img
        src={data.owner.avatarUrl}
        alt=""
        className="flex-shrink-0 rounded-full border border-default-border"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: `${accent}25`, color: accent, fontSize: size * 0.4 }}
    >
      {data.owner.login.slice(0, 2).toUpperCase()}
    </div>
  )
}

// "large" (default): bloco cheio com gradiente na cor da linguagem, avatar grande e
// nome em destaque - o "cabeçalho" visual do card.
function LargeBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
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
        <OwnerAvatar data={data} accent={accent} size={44} />
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

// "compact": a mesma faixa colorida, mas em uma linha só, sem bloco de descrição
// separado - pra quem quer o mesmo visual do banner grande ocupando menos altura.
function CompactBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const accent = data.primaryLanguage?.color || "#8957e5"
  const showDescription = config.banner_show_description ?? true

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 overflow-hidden rounded-lg border border-default-border p-2.5"
      style={{ background: `linear-gradient(135deg, ${accent}22 0%, ${accent}05 70%, transparent 100%)` }}
    >
      <OwnerAvatar data={data} accent={accent} size={28} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-default-text">{data.nameWithOwner}</div>
        {showDescription && data.description && (
          <div className="truncate text-xs text-default-muted">{data.description}</div>
        )}
      </div>
    </a>
  )
}

// "minimal": só texto, sem fundo/borda/gradiente - pra quem quer o nome do repo como
// um título simples dentro do card, sem chamar tanta atenção quanto as outras seções.
function MinimalBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="truncate text-base font-bold text-default-text">{data.nameWithOwner}</div>
      {showDescription && data.description && (
        <p className="mt-1 text-sm leading-relaxed text-default-muted line-clamp-2">{data.description}</p>
      )}
    </a>
  )
}

function DefaultBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const variant = config.banner_variant ?? "large"
  if (variant === "compact") return <CompactBanner data={data} config={config} />
  if (variant === "minimal") return <MinimalBanner data={data} config={config} />
  return <LargeBanner data={data} config={config} />
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
            {(config.banner_show_description ?? true) &&
              data.description &&
              (config.banner_variant ?? "large") !== "compact" && (
                <p className="px-1 pb-1 text-sm text-terminal-muted">{data.description}</p>
              )}
          </>
        }
      />
    </section>
  )
}
