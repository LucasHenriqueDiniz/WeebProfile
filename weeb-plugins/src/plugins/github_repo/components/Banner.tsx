import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { resolveBannerVariant } from "../types"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, Delta, DotSep, Eyebrow, HL, HL_SOFT, HL_SOFTER, LangDot, computeStarDelta, formatCount } from "./redesign"

interface BannerProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Linha de metadados compartilhada: linguagem primária, stars, forks, licença.
function MetaRow({ data, showLanguage }: { data: GithubRepoData; showLanguage: boolean }): React.ReactElement {
  return (
    <div className="flex items-center gap-3.5 text-xs text-default-muted">
      {showLanguage && data.primaryLanguage && (
        <span className="flex items-center gap-1.5">
          <LangDot color={data.primaryLanguage.color} />
          {data.primaryLanguage.name}
        </span>
      )}
      {showLanguage && data.primaryLanguage && <DotSep />}
      <span>
        <b className="font-semibold text-default-text">{formatCount(data.stargazerCount)}</b> stars
      </span>
      <DotSep />
      <span>
        <b className="font-semibold text-default-text">{formatCount(data.forkCount)}</b> forks
      </span>
      {data.licenseInfo?.spdxId && (
        <>
          <DotSep />
          <span>{data.licenseInfo.spdxId}</span>
        </>
      )}
    </div>
  )
}

// Marca quadrada com a inicial do repo (ou a imagem custom/avatar, se existir).
function Mark({ data, size }: { data: GithubRepoData; size: number }): React.ReactElement {
  if (data.owner.avatarUrl) {
    return (
      <img
        src={data.owner.avatarUrl}
        alt=""
        className="flex-shrink-0 rounded-[10px]"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-[10px] font-bold"
      style={{ width: size, height: size, background: HL_SOFT, color: HL, fontSize: size * 0.42 }}
    >
      {data.name.slice(0, 1).toUpperCase()}
    </div>
  )
}

// "hero" (default): accent bar no topo, nome grande, descrição e meta row.
function HeroBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showLanguage = config.banner_show_languages ?? true
  const showAvatar = config.banner_show_avatar ?? true
  const showOwner = config.banner_show_owner ?? true

  return (
    <Card>
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg, ${HL}, color-mix(in srgb, ${HL} 30%, transparent))` }}
      />
      <div className="flex items-start gap-3.5 px-[18px] py-4">
        {showAvatar && <Mark data={data} size={44} />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[22px] font-semibold leading-tight tracking-[-0.02em] text-default-text">
            {showOwner && <span className="font-normal text-default-muted">{data.owner.login} /</span>} {data.name}
          </div>
          {showDescription && data.description && (
            <p className="mt-1.5 text-[13px] leading-[1.55] text-default-muted line-clamp-2">{data.description}</p>
          )}
          <div className="mt-3">
            <MetaRow data={data} showLanguage={showLanguage} />
          </div>
        </div>
      </div>
    </Card>
  )
}

// "minimal": linha única - marca/avatar, nome, descrição truncada, stars à direita.
function MinimalBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showAvatar = config.banner_show_avatar ?? true
  const showOwner = config.banner_show_owner ?? true

  return (
    <Card className="flex flex-row items-center gap-3.5 px-[18px] py-3.5">
      {showAvatar && <Mark data={data} size={40} />}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold leading-tight text-default-text">{showOwner ? data.nameWithOwner : data.name}</div>
        {showDescription && data.description && (
          <div className="truncate text-xs text-default-muted">{data.description}</div>
        )}
      </div>
      <div className="flex-shrink-0 text-xs text-default-muted">
        <b className="font-semibold text-default-text">★ {formatCount(data.stargazerCount)}</b>
      </div>
    </Card>
  )
}

// "split": conteúdo à esquerda + painel soft de stars com delta à direita.
function SplitBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const delta = computeStarDelta(data.starHistory)

  return (
    <Card className="flex flex-row">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-[18px] py-4">
        <Eyebrow>Repository</Eyebrow>
        <div className="truncate text-lg font-semibold tracking-[-0.02em] text-default-text">{data.name}</div>
        {showDescription && data.description && (
          <p className="text-xs leading-normal text-default-muted line-clamp-2">{data.description}</p>
        )}
      </div>
      <div
        className="flex w-[132px] flex-shrink-0 flex-col items-center justify-center gap-0.5 border-l border-default-border"
        style={{ background: HL_SOFTER }}
      >
        <div className="text-2xl font-semibold leading-none tracking-[-0.02em]" style={{ color: HL }}>
          {formatCount(data.stargazerCount)}
        </div>
        <Eyebrow>stars</Eyebrow>
        <Delta delta={delta} className="mt-0.5" />
      </div>
    </Card>
  )
}

// "display": tipografia gigante + letra fantasma no fundo.
function DisplayBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showLanguage = config.banner_show_languages ?? true
  const showOwner = config.banner_show_owner ?? true

  return (
    <Card className="relative flex flex-col justify-center">
      <div
        className="pointer-events-none absolute -right-7 -top-9 select-none text-[150px] font-bold leading-none tracking-[-0.05em]"
        style={{ color: HL, opacity: 0.07 }}
      >
        {data.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="px-[18px] py-4">
        <Eyebrow style={{ color: HL }}>{showOwner ? `${data.owner.login} / repository` : "repository"}</Eyebrow>
        <div className="mt-1 truncate text-[32px] font-bold leading-[1.05] tracking-[-0.035em] text-default-text">
          {data.name}
        </div>
        <div className="mt-2.5">
          <MetaRow data={data} showLanguage={showLanguage} />
        </div>
      </div>
    </Card>
  )
}

// "dark": card escuro fixo com barra highlight lateral + contagem de stars.
function DarkBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showAvatar = config.banner_show_avatar ?? true
  const showOwner = config.banner_show_owner ?? true

  return (
    <Card
      className="flex flex-row items-center border-0"
      style={{ background: "#111318", boxShadow: "0 0 0 0.5px #2a2e37" }}
    >
      <div className="self-stretch" style={{ width: 4, background: HL }} />
      {showAvatar && (
        <div className="flex-shrink-0 pl-[18px]">
          <Mark data={data} size={36} />
        </div>
      )}
      <div className="min-w-0 flex-1 px-3.5 py-4">
        <div className="truncate text-lg font-semibold tracking-[-0.02em]" style={{ color: "#f0f2f6" }}>
          {showOwner && (
            <>
              <span className="font-normal" style={{ color: "#8b93a3" }}>
                {data.owner.login} /
              </span>{" "}
            </>
          )}
          {data.name}
        </div>
        {showDescription && data.description && (
          <div className="mt-1 truncate text-xs" style={{ color: "#8b93a3" }}>
            {data.description}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 px-[18px] text-right">
        <div className="text-2xl font-semibold leading-tight" style={{ color: HL }}>
          {formatCount(data.stargazerCount)}
        </div>
        <Eyebrow style={{ color: "#8b93a3" }}>stars</Eyebrow>
      </div>
    </Card>
  )
}

// "centered": tudo centralizado sobre um fundo com dois glows radiais suaves do
// highlight - simétrico, estilo capa de README.
function CenteredBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showAvatar = config.banner_show_avatar ?? true
  const showOwner = config.banner_show_owner ?? true
  const showLanguage = config.banner_show_languages ?? true

  return (
    <Card className="relative flex flex-col items-center px-[18px] py-5 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${HL_SOFT}, transparent 55%), radial-gradient(circle at 85% 100%, ${HL_SOFTER}, transparent 50%)`,
        }}
      />
      <div className="relative flex flex-col items-center">
        {showAvatar && <Mark data={data} size={48} />}
        {showOwner && (
          <div className={`text-xs text-default-muted ${showAvatar ? "mt-2.5" : ""}`}>{data.owner.login} /</div>
        )}
        <div
          className={`max-w-full truncate text-[26px] font-bold leading-tight tracking-[-0.03em] text-default-text ${
            !showAvatar && !showOwner ? "" : "mt-0.5"
          }`}
        >
          {data.name}
        </div>
        {showDescription && data.description && (
          <p className="mt-1.5 max-w-[320px] text-[13px] leading-[1.55] text-default-muted line-clamp-2">
            {data.description}
          </p>
        )}
        <div className="mt-3 flex justify-center">
          <MetaRow data={data} showLanguage={showLanguage} />
        </div>
      </div>
    </Card>
  )
}

// "centered_dark": centralizado sobre card escuro com grid técnico + glow do
// highlight vindo de cima.
function CenteredDarkBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showOwner = config.banner_show_owner ?? true

  return (
    <Card className="relative flex flex-col items-center justify-center border-0 px-6 py-6 text-center" style={{ background: "#0d1117", boxShadow: "0 0 0 0.5px #30363d" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="centered-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0 L0 0 0 26" fill="none" stroke="#e6edf3" strokeOpacity="0.045" strokeWidth="1" />
          </pattern>
          <radialGradient id="centered-glow" cx="0.5" cy="0.1" r="0.9">
            <stop offset="0" stopColor="var(--default-color-highlight)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--default-color-highlight)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#centered-grid)" />
        <rect width="100%" height="100%" fill="url(#centered-glow)" />
      </svg>
      <div className="relative flex flex-col items-center gap-[9px]">
        {showOwner && <Eyebrow style={{ color: HL }}>{data.owner.login} / open source</Eyebrow>}
        <div className="max-w-full truncate text-[28px] font-bold leading-none tracking-[-0.03em]" style={{ color: "#e6edf3" }}>
          {data.name}
        </div>
        {showDescription && data.description && (
          <p className="max-w-[300px] text-[12.5px] leading-[1.5] line-clamp-2" style={{ color: "#8b949e" }}>
            {data.description}
          </p>
        )}
      </div>
    </Card>
  )
}

// "centered_gradient": centralizado sobre gradiente cheio do highlight, com chips
// translúcidos de stars/forks/linguagem.
function CenteredGradientBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showLanguage = config.banner_show_languages ?? true

  const chip: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 99,
    background: "rgba(255,255,255,.18)",
  }

  return (
    <Card
      className="flex flex-col items-center justify-center border-0 px-6 py-6 text-center text-white"
      style={{ background: `linear-gradient(135deg, ${HL} 0%, color-mix(in srgb, ${HL} 65%, #c026d3) 100%)` }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="max-w-full truncate text-[27px] font-bold leading-none tracking-[-0.03em]"
          style={{ textShadow: "0 1px 2px rgb(0 0 0 / .12)" }}
        >
          {data.name}
        </div>
        {showDescription && data.description && (
          <p className="max-w-[310px] text-[12.5px] leading-[1.5] line-clamp-2" style={{ opacity: 0.9 }}>
            {data.description}
          </p>
        )}
        <div className="mt-1 flex gap-2">
          <span style={chip}>★ {formatCount(data.stargazerCount)}</span>
          <span style={chip}>⑂ {formatCount(data.forkCount)}</span>
          {showLanguage && data.primaryLanguage && <span style={chip}>{data.primaryLanguage.name}</span>}
        </div>
      </div>
    </Card>
  )
}

function DefaultBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const variant = resolveBannerVariant(config.banner_variant)
  if (variant === "minimal") return <MinimalBanner data={data} config={config} />
  if (variant === "split") return <SplitBanner data={data} config={config} />
  if (variant === "display") return <DisplayBanner data={data} config={config} />
  if (variant === "centered") return <CenteredBanner data={data} config={config} />
  if (variant === "centered_dark") return <CenteredDarkBanner data={data} config={config} />
  if (variant === "centered_gradient") return <CenteredGradientBanner data={data} config={config} />
  if (variant === "dark") return <DarkBanner data={data} config={config} />
  return <HeroBanner data={data} config={config} />
}

export function Banner({ config, data, style = "default", size = "half" }: BannerProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  return (
    <section id="github-repo-banner">
      <ScaledBox size={config.content_size}>
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
                data.description && (
                  <p className="m-0 px-1 pb-1 text-sm text-terminal-muted line-clamp-2">{data.description}</p>
                )}
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
