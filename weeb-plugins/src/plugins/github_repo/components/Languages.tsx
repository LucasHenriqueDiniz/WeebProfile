import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { resolveLanguagesVariant } from "../types"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, LangDot } from "./redesign"

const LANGUAGES_DISPLAY_LIMIT = 5

interface LanguagesProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

type Lang = GithubRepoData["languages"][number]

// Contraste simples (luminância relativa) pra decidir texto preto ou branco em cima
// da cor da linguagem.
function readableTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "")
  if (hex.length !== 6) return "#ffffff"
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff"
}

function Legend({ langs, column = false }: { langs: Lang[]; column?: boolean }): React.ReactElement {
  return (
    <div className={column ? "flex flex-col gap-[7px]" : "mt-3 flex flex-wrap gap-x-4 gap-y-1.5"}>
      {langs.map((lang) => (
        <span key={lang.name} className="flex items-center gap-1.5 text-xs text-default-text">
          <LangDot color={lang.color} />
          <b className="font-semibold">{lang.name}</b>
          <span className="text-[11px] text-default-muted">{lang.percentage}%</span>
        </span>
      ))}
    </div>
  )
}

// "spectrum" (default): barra segmentada arredondada com gaps + legenda inline.
function SpectrumLanguages({ langs }: { langs: Lang[] }): React.ReactElement {
  return (
    <Card className="px-[18px] py-4">
      <div className="flex h-3.5 gap-0.5 overflow-hidden rounded-full">
        {langs.map((lang) => (
          <span key={lang.name} className="h-full" style={{ width: `${lang.percentage}%`, background: lang.color }} />
        ))}
      </div>
      <Legend langs={langs} />
    </Card>
  )
}

// "bars": uma linha por linguagem - nome, trilha, porcentagem.
function BarsLanguages({ langs }: { langs: Lang[] }): React.ReactElement {
  return (
    <Card className="flex flex-col gap-2.5 px-[18px] py-4">
      {langs.map((lang) => (
        <div key={lang.name} className="grid items-center gap-2.5 text-xs" style={{ gridTemplateColumns: "86px 1fr 40px" }}>
          <b className="truncate font-semibold text-default-text">{lang.name}</b>
          <div className="h-2 overflow-hidden rounded-full bg-default-muted/10">
            <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, background: lang.color }} />
          </div>
          <span className="text-right text-[11px] text-default-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
            {lang.percentage}%
          </span>
        </div>
      ))}
    </Card>
  )
}

// "donut": rosca SVG com a linguagem principal no centro + legenda em coluna.
function DonutLanguages({ langs }: { langs: Lang[] }): React.ReactElement {
  const R = 38
  const CIRC = 2 * Math.PI * R
  const primary = langs[0]
  // segmentos maiores por último pra ficarem por cima na ordem certa
  let offset = 0
  const segments = langs.map((lang) => {
    const len = (lang.percentage / 100) * CIRC
    const seg = { ...lang, len, offset }
    offset += len
    return seg
  })

  return (
    <Card className="flex flex-row items-center gap-2">
      <div className="flex-shrink-0 py-4 pl-[18px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" style={{ width: 96, height: 96 }} aria-hidden="true">
          <circle
            cx="48"
            cy="48"
            r={R}
            fill="none"
            stroke="color-mix(in srgb, var(--default-color-muted) 12%, transparent)"
            strokeWidth="12"
          />
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx="48"
              cy="48"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${seg.len} ${CIRC}`}
              strokeDashoffset={-seg.offset}
              transform="rotate(-90 48 48)"
            />
          ))}
          {primary && (
            <>
              <text
                x="48"
                y="45"
                textAnchor="middle"
                style={{ fontSize: 17, fontWeight: 600, fill: "var(--default-color-default)" }}
              >
                {primary.percentage}%
              </text>
              <text x="48" y="60" textAnchor="middle" style={{ fontSize: 9, fill: "var(--default-color-muted)" }}>
                {primary.name}
              </text>
            </>
          )}
        </svg>
      </div>
      <div className="px-[18px]">
        <Legend langs={langs} column />
      </div>
    </Card>
  )
}

// "blocks": mosaico proporcional - primeira linguagem em bloco grande, segunda média,
// o resto empilhado numa coluna.
function BlocksLanguages({ langs }: { langs: Lang[] }): React.ReactElement {
  const [first, second, ...rest] = langs
  if (!first) return <></>
  const restTotal = rest.reduce((acc, l) => acc + l.percentage, 0)
  const firstW = first.percentage
  const secondW = second?.percentage ?? 0
  const total = firstW + secondW + restTotal || 1

  return (
    <Card>
      <div className="flex gap-[3px] px-3.5 pb-2 pt-3" style={{ height: 88 }}>
        <div
          className="flex flex-col justify-end rounded-lg px-3 py-2.5"
          style={{ width: `${(firstW / total) * 100}%`, background: first.color, color: readableTextColor(first.color) }}
        >
          <b className="truncate text-sm font-semibold">{first.name}</b>
          <span className="text-[11px]" style={{ opacity: 0.8 }}>
            {first.percentage}%
          </span>
        </div>
        {second && (
          <div
            className="flex flex-col justify-end rounded-lg px-2.5 py-2.5"
            style={{
              width: `${(secondW / total) * 100}%`,
              background: second.color,
              color: readableTextColor(second.color),
            }}
          >
            <b className="truncate text-xs font-semibold">{second.name}</b>
            <span className="text-[10px]" style={{ opacity: 0.8 }}>
              {second.percentage}%
            </span>
          </div>
        )}
        {rest.length > 0 && (
          <div className="flex flex-col gap-[3px]" style={{ width: `${(restTotal / total) * 100}%`, minWidth: 72 }}>
            {rest.map((lang) => (
              <div
                key={lang.name}
                className="flex flex-1 items-center gap-1 truncate rounded-lg px-2.5 text-[11px]"
                style={{ background: lang.color, color: readableTextColor(lang.color) }}
              >
                <b className="font-semibold">{lang.name}</b> {lang.percentage}%
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-[18px] pb-3 text-[10px] uppercase tracking-[0.1em] text-default-muted-light">
        Code composition
      </div>
    </Card>
  )
}

// Terminal (pré-redesign, alturas calibradas): barra fina + legenda inline.
function TerminalLanguages({ langs }: { langs: Lang[] }): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-default-muted/10">
        {langs.map((lang) => (
          <div key={lang.name} style={{ width: `${lang.percentage}%`, background: lang.color }} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {langs.map((lang) => (
          <span key={lang.name} className="flex items-center gap-1 text-xs text-terminal-muted">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: lang.color }} />
            {lang.name}
            <span style={{ opacity: 0.7 }}>{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Languages({ config, data, style = "default", size = "half" }: LanguagesProps): React.ReactElement {
  if (!config.enabled || !data || data.languages.length === 0) return <></>

  const maxLanguages = Math.min(config.max_languages ?? LANGUAGES_DISPLAY_LIMIT, LANGUAGES_DISPLAY_LIMIT)
  const variant = resolveLanguagesVariant(config.languages_variant)
  const langs = data.languages.slice(0, maxLanguages)

  return (
    <section id="github-repo-languages">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {variant === "bars" && <BarsLanguages langs={langs} />}
              {variant === "donut" && <DonutLanguages langs={langs} />}
              {variant === "blocks" && <BlocksLanguages langs={langs} />}
              {variant === "spectrum" && <SpectrumLanguages langs={langs} />}
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "languages", size })} />
              <div className="px-1 pb-1">
                <TerminalLanguages langs={langs} />
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
