/**
 * Languages - problems solved per programming language, most solved first.
 */

import React from "react"
import { FaCode } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getLanguageIcon } from "../../../utils/language-icons"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LeetCodeConfig, LeetCodeData } from "../types"
import { CountBars } from "./CountBars"
import { hiddenTitle, shownLanguages } from "./shown"

interface LanguagesProps {
  data: Pick<LeetCodeData, "languages">
  config: LeetCodeConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** LeetCode names Python 3 "Python3"; the icon map knows it as Python. */
function iconFor(name: string): ReturnType<typeof getLanguageIcon> {
  return getLanguageIcon(name.replace(/\d+$/, ""))
}

export function Languages({ data, config, style = "default", size = "half" }: LanguagesProps): React.ReactElement {
  const languages = shownLanguages(data, config)
  if (languages.length === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.languages_hide_title)
  const title = ne.languages_title || "LeetCode Languages"

  return (
    <section id="leetcode-languages">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <CountBars
              items={languages.map((language) => {
                const Icon = iconFor(language.name)
                return {
                  name: language.name,
                  count: language.solved,
                  icon: <Icon className="w-3.5 h-3.5 flex-shrink-0 text-default-highlight" />,
                }
              })}
              style="default"
              size={size}
            />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "leetcode", section: "languages", size })} />
            <CountBars
              items={languages.map((language) => ({ name: language.name, count: language.solved }))}
              style="terminal"
              size={size}
            />
          </>
        }
      />
    </section>
  )
}
