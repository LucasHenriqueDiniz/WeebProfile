/**
 * Skills - problems solved per LeetCode tag, most solved first.
 */

import React from "react"
import { FaTags } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LeetCodeConfig, LeetCodeData } from "../types"
import { CountBars } from "./CountBars"
import { hiddenTitle, shownSkills } from "./shown"

interface SkillsProps {
  data: Pick<LeetCodeData, "skills">
  config: LeetCodeConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function Skills({ data, config, style = "default", size = "half" }: SkillsProps): React.ReactElement {
  const skills = shownSkills(data, config)
  if (skills.length === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.skills_hide_title)
  const title = ne.skills_title || "LeetCode Skills"
  const items = skills.map((skill) => ({ name: skill.name, count: skill.solved }))

  return (
    <section id="leetcode-skills">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTags />} />}
            <CountBars items={items} style="default" size={size} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "leetcode", section: "skills", size })} />
            <CountBars items={items} style="terminal" size={size} />
          </>
        }
      />
    </section>
  )
}
