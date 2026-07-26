import React from "react"
import { FaCode } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"

const LANGUAGES_DISPLAY_LIMIT = 5

interface LanguagesProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Contraste simples (luminância relativa) pra decidir texto preto ou branco em cima
// da cor da linguagem - sem isso, badges em cores claras (JS amarelo, etc) ficam ilegíveis.
function readableTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "")
  if (hex.length !== 6) return "#ffffff"
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff"
}

// "badges" (shields.io style): retângulos sólidos na cor da linguagem, como os badges
// de README - mais "carimbo de tecnologia" do que barra de proporção.
function LanguageBadges({ languages, max }: { languages: GithubRepoData["languages"]; max: number }): React.ReactElement | null {
  const visible = languages.slice(0, max)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((lang) => (
        <span
          key={lang.name}
          className="rounded-[3px] px-2 py-1 text-[11px] font-semibold leading-none"
          style={{ background: lang.color, color: readableTextColor(lang.color) }}
        >
          {lang.name}
        </span>
      ))}
    </div>
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

// "spectrum" (15 Technology Spectrum): barra mais grossa + legenda em duas colunas
// com a porcentagem em destaque - mais "dashboard", menos "tag list".
function LanguageSpectrum({ languages, max }: { languages: GithubRepoData["languages"]; max: number }): React.ReactElement | null {
  const visible = languages.slice(0, max)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-3.5 w-full overflow-hidden rounded-full">
        {visible.map((lang) => (
          <div key={lang.name} style={{ width: `${lang.percentage}%`, background: lang.color }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {visible.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 text-default-muted">
              <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: lang.color }} />
              <span className="truncate">{lang.name}</span>
            </span>
            <span className="flex-shrink-0 font-semibold text-default-text">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Languages({ config, data, style = "default", size = "half" }: LanguagesProps): React.ReactElement {
  if (!config.enabled || !data || data.languages.length === 0) return <></>

  const title = config.languages_title ?? "Technologies"
  const hideTitle = config.languages_hide_title ?? false
  const maxLanguages = Math.min(config.max_languages ?? LANGUAGES_DISPLAY_LIMIT, LANGUAGES_DISPLAY_LIMIT)
  const variant = config.languages_variant ?? "bars"

  return (
    <section id="github-repo-languages">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
              {variant === "spectrum" && <LanguageSpectrum languages={data.languages} max={maxLanguages} />}
              {variant === "badges" && <LanguageBadges languages={data.languages} max={maxLanguages} />}
              {variant === "bars" && <LanguageBars languages={data.languages} max={maxLanguages} />}
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "languages", size })} />
              <div className="px-1 pb-1">
                <LanguageBars languages={data.languages} max={maxLanguages} />
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
