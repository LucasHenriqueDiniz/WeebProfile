/**
 * Recent - the latest accepted submissions, newest first, each linking to its problem.
 */

import React from "react"
import { FaCheck, FaHistory } from "react-icons/fa"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLine } from "../../../templates/Terminal/TerminalLine"
import { ExternalLink } from "../../../utils/external-link"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LeetCodeConfig, LeetCodeData, LeetCodeSubmission } from "../types"
import { hiddenTitle, shownRecent } from "./shown"

/** Default rows are 24px, `gap-1` apart; terminal lines are TerminalLine's 16px. */
export const RECENT_ROW_HEIGHT = 24
export const RECENT_ROW_GAP = 4
export const RECENT_TERMINAL_LINE_HEIGHT = 16

interface RecentProps {
  data: Pick<LeetCodeData, "recent">
  config: LeetCodeConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function problemUrl(submission: LeetCodeSubmission): string {
  return `https://leetcode.com/problems/${encodeURIComponent(submission.slug)}/`
}

/** A fixed format: the card is rendered on a server whose locale is not the reader's. */
function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function DefaultRows({ submissions }: { submissions: LeetCodeSubmission[] }): React.ReactElement {
  const cascade = useItemCascade(submissions.length)
  return (
    <div
      className={withCascade("flex flex-col w-full", cascade)}
      style={{ gap: `${RECENT_ROW_GAP}px`, ...cascade?.style }}
    >
      {submissions.map((submission) => (
        <ExternalLink
          key={`${submission.slug}-${submission.date}`}
          href={problemUrl(submission)}
          className="flex items-center gap-2 w-full overflow-hidden"
          style={{ height: `${RECENT_ROW_HEIGHT}px`, lineHeight: `${RECENT_ROW_HEIGHT}px` }}
        >
          <FaCheck className="w-3 h-3 flex-shrink-0 text-green-500" />
          <span className="flex-1 truncate text-sm font-medium text-default-highlight">{submission.title}</span>
          <span className="text-xs text-default-muted whitespace-nowrap flex-shrink-0">
            {formatDate(submission.date)}
          </span>
        </ExternalLink>
      ))}
    </div>
  )
}

export function Recent({ data, config, style = "default", size = "half" }: RecentProps): React.ReactElement {
  const submissions = shownRecent(data, config)
  if (submissions.length === 0) return <></>

  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.recent_hide_title)
  const title = ne.recent_title || "Recent Accepted Submissions"

  return (
    <section id="leetcode-recent">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaHistory />} />}
            <DefaultRows submissions={submissions} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "leetcode", section: "recent", size })} />
            <CascadeGroup count={submissions.length}>
              {submissions.map((submission) => (
                <TerminalLine
                  key={`${submission.slug}-${submission.date}`}
                  href={problemUrl(submission)}
                  right={submission.title}
                  left={formatDate(submission.date)}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
