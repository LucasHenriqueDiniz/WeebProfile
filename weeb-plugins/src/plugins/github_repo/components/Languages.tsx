import React from "react"
import { FaCode } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"

const LANGUAGES_DISPLAY_LIMIT = 5

interface LanguagesProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
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

export function Languages({ config, data, style = "default", size = "half" }: LanguagesProps): React.ReactElement {
  if (!config.enabled || !data || data.languages.length === 0) return <></>

  const title = config.languages_title ?? "Technologies"
  const hideTitle = config.languages_hide_title ?? false
  const maxLanguages = Math.min(config.max_languages ?? LANGUAGES_DISPLAY_LIMIT, LANGUAGES_DISPLAY_LIMIT)

  return (
    <section id="github-repo-languages">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <div className="rounded-lg border border-default-border p-4">
              <LanguageBars languages={data.languages} max={maxLanguages} />
            </div>
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
    </section>
  )
}
