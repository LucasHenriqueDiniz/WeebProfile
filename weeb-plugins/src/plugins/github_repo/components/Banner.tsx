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

// "clean": o banner pensado para ser usado sozinho num README - fundo quase branco,
// uma única borda, sem gradiente tingindo a caixa inteira. Nome + descrição + techs
// (linguagens já vêm no fetch) cabem numa única faixa, sem seções extras.
function CleanBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const accent = data.primaryLanguage?.color || "#8957e5"
  const showDescription = config.banner_show_description ?? true
  const showLanguages = config.banner_show_languages ?? true
  const languages = showLanguages ? data.languages.slice(0, 4) : []

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-default-border p-3"
    >
      <OwnerAvatar data={data} accent={accent} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-default-text">{data.nameWithOwner}</div>
        {showDescription && data.description && (
          <p className="truncate text-xs text-default-muted">{data.description}</p>
        )}
        {languages.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {languages.map((lang) => (
              <span key={lang.name} className="flex items-center gap-1 text-[11px] text-default-muted">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: lang.color }} />
                {lang.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-3 text-xs text-default-muted">
        <span className="flex items-center gap-1">★ {data.stargazerCount}</span>
        <span className="flex items-center gap-1">⑂ {data.forkCount}</span>
      </div>
    </a>
  )
}

// "editorial" (02): régua colorida lateral + tipografia serifada, no estilo de
// manchete de editorial - lista as techs como texto simples, sem chips.
function EditorialBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const accent = data.primaryLanguage?.color || "#ff5d2a"
  const showDescription = config.banner_show_description ?? true
  const languages = data.languages.slice(0, 3)

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[4px_1fr] overflow-hidden rounded-lg"
      style={{ background: "#f6f4ef" }}
    >
      <div style={{ background: accent }} />
      <div className="p-4">
        <div className="text-[9px] font-extrabold uppercase tracking-[0.16em]" style={{ color: accent }}>
          Open-source repository
        </div>
        <div className="mt-1.5 truncate text-2xl font-bold" style={{ color: "#171717", fontFamily: "Georgia, serif" }}>
          {data.name}
        </div>
        {showDescription && data.description && (
          <p className="mt-1.5 truncate text-xs" style={{ color: "#67645f" }}>
            {data.description}
          </p>
        )}
        {languages.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-3 text-[11px]" style={{ color: "#555" }}>
            {languages.map((lang) => (
              <span key={lang.name}>
                {lang.name} {lang.percentage}%
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

// "mono" (03): estética "terminal do GitHub" mas aplicada ao estilo default -
// monospace, fundo escuro fixo, chips com contorno e uma linha de comando falsa.
function MonoBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showLanguages = config.banner_show_languages ?? true
  const languages = showLanguages ? data.languages.slice(0, 3) : []

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg border p-4"
      style={{ background: "#0d1117", borderColor: "#30363d", fontFamily: "ui-monospace, monospace" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-xs" style={{ color: "#8b949e" }}>
            github.com/{data.owner.login}
          </div>
          <div className="truncate text-xl font-bold" style={{ color: "#f0f6fc" }}>
            ./{data.name}
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-3 text-xs" style={{ color: "#8b949e" }}>
          <span>★ {data.stargazerCount}</span>
          <span>⑂ {data.forkCount}</span>
        </div>
      </div>
      {showDescription && data.description && (
        <p className="mt-2.5 truncate text-xs" style={{ color: "#a8b3c0" }}>
          {data.description}
        </p>
      )}
      {languages.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang.name}
              className="rounded px-1.5 py-0.5 text-[11px]"
              style={{ color: "#58a6ff", background: "#0d2340", border: "1px solid #1f6feb" }}
            >
              {lang.name}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}

// "aurora" (04): fundo escuro com dois blobs de gradiente + painel de vidro
// (glassmorphism) por cima - o mais "chamativo" das variantes.
function AuroraBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const showLanguages = config.banner_show_languages ?? true
  const languages = showLanguages ? data.languages.slice(0, 4) : []

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden rounded-lg p-4"
      style={{ background: "linear-gradient(135deg,#0c1830,#182654 56%,#31205f)" }}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full blur-sm"
        style={{ background: "rgba(34,211,238,.21)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-14 -right-8 h-36 w-36 rounded-full blur-sm"
        style={{ background: "rgba(236,72,153,.18)" }}
      />
      <div
        className="relative rounded-lg p-3.5"
        style={{ border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.07)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(145deg,#38bdf8,#8b5cf6)" }}
            >
              {data.owner.login.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[10px]" style={{ color: "#9fb2dc" }}>
                {data.owner.login} /
              </div>
              <div className="truncate text-lg font-bold text-white">{data.name}</div>
            </div>
          </div>
          <div className="flex flex-shrink-0 gap-3 text-xs text-white">
            <span>★ {data.stargazerCount}</span>
            <span>⑂ {data.forkCount}</span>
          </div>
        </div>
        {showDescription && data.description && (
          <p className="mt-2.5 truncate text-xs" style={{ color: "#c8d4f2" }}>
            {data.description}
          </p>
        )}
        {languages.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <span
                key={lang.name}
                className="rounded-full px-2 py-0.5 text-[11px] text-white"
                style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.18)" }}
              >
                {lang.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

// "bold" (05): pouca informação, identidade forte - eyebrow laranja, nome gigante,
// barra de linguagens + badge de estrelas grande no rodapé.
function BoldBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const languages = data.languages.slice(0, 4)

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg p-4"
      style={{ background: "#fff7ed", color: "#321709" }}
    >
      <div className="text-[9px] font-extrabold uppercase tracking-[0.2em]" style={{ color: "#ea580c" }}>
        {data.owner.login} presents
      </div>
      <div className="mt-1.5 truncate text-3xl font-extrabold">{data.name}</div>
      {showDescription && data.description && (
        <p className="mt-1 truncate text-xs" style={{ color: "#7c4c31" }}>
          {data.description}
        </p>
      )}
      <div className="mt-3 flex items-end justify-between gap-3">
        {languages.length > 0 && (
          <div className="min-w-0 flex-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full">
              {languages.map((lang) => (
                <div key={lang.name} style={{ width: `${lang.percentage}%`, background: lang.color }} />
              ))}
            </div>
            <div className="mt-1.5 truncate text-[10px]" style={{ color: "#8a4c2a" }}>
              {languages.map((l) => l.name).join(" · ")}
            </div>
          </div>
        )}
        <div className="flex-shrink-0 text-2xl font-black" style={{ color: "#fb923c" }}>
          {data.stargazerCount}★
        </div>
      </div>
    </a>
  )
}

// "split" (06): duas colunas - nome/descrição/stats à esquerda, painel escuro com
// as tecnologias em barras individuais à direita.
function SplitBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const languages = data.languages.slice(0, 3)

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[1.25fr_.75fr] overflow-hidden rounded-lg"
      style={{ background: "#edf6ff", color: "#10243f" }}
    >
      <div className="p-4">
        <div className="text-[11px]" style={{ color: "#57718f" }}>
          {data.owner.login} / repository
        </div>
        <div className="mt-1 truncate text-xl font-bold">{data.name}</div>
        {showDescription && data.description && (
          <p className="mt-1.5 truncate text-xs" style={{ color: "#5b708a" }}>
            {data.description}
          </p>
        )}
        <div className="mt-3 flex gap-4 text-xs" style={{ color: "#10243f" }}>
          <span>★ {data.stargazerCount} Stars</span>
          <span>⑂ {data.forkCount} Forks</span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 p-4" style={{ background: "#10243f" }}>
        {languages.map((lang) => (
          <div key={lang.name}>
            <div className="flex items-center justify-between text-[11px] text-white">
              <span>{lang.name}</span>
              <span>{lang.percentage}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: "#294564" }}>
              <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, background: "#58c7ff" }} />
            </div>
          </div>
        ))}
      </div>
    </a>
  )
}

// "blueprint" (07): moldura técnica com cantos marcados, tudo em monospace maiúsculo -
// visual de "planta baixa" de projeto de programação.
function BlueprintBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const languages = data.languages.slice(0, 3)

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden rounded-lg p-4"
      style={{ background: "#061b2d", color: "#dff7ff", fontFamily: "ui-monospace, monospace" }}
    >
      <div className="relative border p-3.5" style={{ borderColor: "#1e6f8e" }}>
        <span className="absolute -left-px -top-px h-3 w-3" style={{ borderLeft: "3px solid #65dfff", borderTop: "3px solid #65dfff" }} />
        <span className="absolute -bottom-px -right-px h-3 w-3" style={{ borderRight: "3px solid #65dfff", borderBottom: "3px solid #65dfff" }} />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.11em]" style={{ color: "#69b7ce" }}>
              {data.owner.login.toUpperCase()}_REPOSITORY
            </div>
            <div className="mt-1 truncate text-xl font-bold">{data.name.toUpperCase()}</div>
          </div>
          <div className="flex-shrink-0 text-right text-[11px]" style={{ color: "#70d9f7" }}>
            STARS_{String(data.stargazerCount).padStart(3, "0")}
            <br />
            FORKS_{String(data.forkCount).padStart(3, "0")}
          </div>
        </div>
        {showDescription && data.description && (
          <p className="mt-2.5 max-w-[80%] truncate text-[11px]" style={{ color: "#9ad0df" }}>
            {data.description}
          </p>
        )}
        {languages.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2 text-[10px]">
            {languages.map((lang) => (
              <span key={lang.name}>[ {lang.name.toUpperCase()} ]</span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

// "ribbon" (08): marca circular (conic-gradient) + faixa inferior com stats/techs -
// separa identidade (topo) de metadados (rodapé).
function RibbonBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true
  const languages = data.languages.slice(0, 3)

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg" style={{ background: "#171717" }}>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="truncate text-[11px]" style={{ color: "#a3a3a3" }}>
            {data.owner.login} /
          </div>
          <div className="truncate text-xl font-bold text-white">{data.name}</div>
          {showDescription && data.description && (
            <p className="mt-1.5 truncate text-xs" style={{ color: "#b8b8b8" }}>
              {data.description}
            </p>
          )}
        </div>
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full p-0.5"
          style={{ background: "conic-gradient(#f43f5e,#8b5cf6,#22d3ee,#f43f5e)" }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "#171717" }}>
            {data.owner.login.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 py-2 text-[11px] font-semibold" style={{ background: "#f5f5f5", color: "#171717" }}>
        <span>★ {data.stargazerCount}</span>
        <span>⑂ {data.forkCount}</span>
        {languages.length > 0 && <span className="ml-auto truncate">{languages.map((l) => l.name).join(" · ")}</span>}
      </div>
    </a>
  )
}

// "social" (18): layout tipo Open Graph - conteúdo à esquerda, bloco decorativo à
// direita. Pensado pra size="full"; em "half" o bloco decorativo fica bem estreito.
function SocialBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const showDescription = config.banner_show_description ?? true

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[1.2fr_.8fr] overflow-hidden rounded-lg border border-default-border"
      style={{ background: "#fcfcfc" }}
    >
      <div className="flex flex-col justify-center p-4">
        <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "#6d6d6d" }}>
          Open-source project
        </div>
        <div className="mt-1 truncate text-2xl font-bold" style={{ color: "#171717" }}>
          {data.name}
        </div>
        {showDescription && data.description && (
          <p className="mt-2 truncate text-xs" style={{ color: "#626262" }}>
            {data.description}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-3 text-xs" style={{ color: "#171717" }}>
          <span>★ {data.stargazerCount}</span>
          <span>⑂ {data.forkCount}</span>
          {data.primaryLanguage && <span>{data.primaryLanguage.name}</span>}
        </div>
      </div>
      <div
        className="relative"
        style={{ background: "linear-gradient(145deg,#161d2d,#2d1f4f)", minHeight: 96 }}
      >
        <div
          className="absolute -right-14 -top-12 h-48 w-48 rounded-full"
          style={{ border: "35px solid rgba(81,171,255,.45)" }}
        />
        <div
          className="absolute -bottom-10 left-2.5 h-28 w-28 rounded-full"
          style={{ border: "27px solid rgba(255,102,183,.45)" }}
        />
      </div>
    </a>
  )
}

function DefaultBanner({ data, config }: { data: GithubRepoData; config: GithubRepoConfig }): React.ReactElement {
  const variant = config.banner_variant ?? "large"
  if (variant === "compact") return <CompactBanner data={data} config={config} />
  if (variant === "minimal") return <MinimalBanner data={data} config={config} />
  if (variant === "clean") return <CleanBanner data={data} config={config} />
  if (variant === "editorial") return <EditorialBanner data={data} config={config} />
  if (variant === "mono") return <MonoBanner data={data} config={config} />
  if (variant === "aurora") return <AuroraBanner data={data} config={config} />
  if (variant === "bold") return <BoldBanner data={data} config={config} />
  if (variant === "split") return <SplitBanner data={data} config={config} />
  if (variant === "blueprint") return <BlueprintBanner data={data} config={config} />
  if (variant === "ribbon") return <RibbonBanner data={data} config={config} />
  if (variant === "social") return <SocialBanner data={data} config={config} />
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
