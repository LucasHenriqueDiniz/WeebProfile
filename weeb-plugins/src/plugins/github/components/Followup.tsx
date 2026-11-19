import React from "react"
import { GoDotFill, GoIssueOpened } from "react-icons/go"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { HorizontalMultipleItemsBar } from "../../../templates/Default/HorizontalMultipleItemsBar"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubConfig, GithubData } from "../types"

type Followup = NonNullable<GithubData["followup"]>

interface FollowupProps {
  data: GithubData["followup"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

/**
 * GitHub's own state colors (green open, purple closed issue and merged pull request, red
 * closed pull request, gray draft), as data, like a language's color: a theme has no
 * variable for "merged" or "closed". The mid tones GitHub's dark theme uses read on the
 * light page and on the dark one.
 */
const STATE_COLOR = {
  open: "#238636",
  done: "#8957e5",
  closed: "#da3633",
  draft: "#8b949e",
} as const

/** The bar of a group with nothing in it. */
const EMPTY_BAR_COLOR = "var(--default-color-muted-light)"

interface State {
  label: string
  value: number
  color: string
}

interface Group {
  label: string
  states: State[]
}

/** The two groups, in the order the bar and the legend draw their states. */
export function followupGroups(data: Followup): [Group, Group] {
  const { issues, pullRequests: pr } = data
  return [
    {
      label: "Issues",
      states: [
        { label: "open", value: issues.open, color: STATE_COLOR.open },
        { label: "closed", value: issues.closed, color: STATE_COLOR.done },
      ],
    },
    {
      label: "Pull requests",
      states: [
        { label: "open", value: pr.open, color: STATE_COLOR.open },
        { label: pr.draft === 1 ? "draft" : "drafts", value: pr.draft, color: STATE_COLOR.draft },
        { label: "merged", value: pr.merged, color: STATE_COLOR.done },
        { label: "closed", value: pr.closed, color: STATE_COLOR.closed },
      ],
    },
  ]
}

const totalOf = (group: Group) => group.states.reduce((sum, state) => sum + state.value, 0)

/** Bar segments; one gray segment when the group is empty, so the bar is still drawn. */
function barItems(group: Group, colorProperty: "backgroundColor" | "color") {
  if (totalOf(group) === 0) return [{ value: 1, style: { [colorProperty]: EMPTY_BAR_COLOR } }]
  return group.states.map((state) => ({ value: state.value, style: { [colorProperty]: state.color } }))
}

/**
 * Default: a column per group, its label and total on a 20px line, the 10px bar, then the
 * legend, each state a 20px line, `gap-1` between all of them. Full puts two states a row;
 * half one, since a half column is 191px and two to a row cut "534 closed" and "1.9K merged".
 */
const DefaultGroup = ({ group, size }: { group: Group; size: "half" | "full" }) => (
  <div className="flex flex-col gap-1 min-w-0">
    <div className="flex justify-between items-center gap-2 h-5 text-sm leading-5">
      <span className="font-semibold text-default-text truncate">{group.label}</span>
      <span className="text-default-muted whitespace-nowrap">
        <AnimatedNumber value={abbreviateNumber(totalOf(group))} />
      </span>
    </div>
    <HorizontalMultipleItemsBar items={barItems(group, "backgroundColor")} />
    <ul className={`grid ${size === "half" ? "grid-cols-1" : "grid-cols-2"} gap-x-2 gap-y-1 m-0 p-0 list-none`}>
      {group.states.map((state) => (
        <li key={state.label} className="flex items-center gap-1 h-5 text-sm leading-5 min-w-0 whitespace-nowrap">
          <GoDotFill className="flex-shrink-0" style={{ color: state.color, fill: state.color }} />
          <span className="text-default-text">
            <AnimatedNumber value={abbreviateNumber(state.value)} />
          </span>
          <span className="text-default-muted truncate">{state.label}</span>
        </li>
      ))}
    </ul>
  </div>
)

/**
 * The terminal bar: each state a box as wide as its share, filled with blocks it clips.
 * TerminalHorizontalMultipleItemsBar counts blocks instead, 58 in half, wider than the line
 * (391px fit about 46), and centers them: both ends were cut, and with them the red of the
 * closed pull requests (antfu, 185 of 2128) and the green of the open ones.
 */
const TerminalBar = ({ group }: { group: Group }) => (
  <div className="flex w-full h-5 px-1 overflow-hidden text-sm leading-5 font-mono" style={{ boxSizing: "border-box" }}>
    {barItems(group, "color").map((item, i) => (
      <span
        key={i}
        className="block h-5 overflow-hidden whitespace-nowrap flex-shrink-0"
        style={{ width: `${(item.value / Math.max(1, totalOf(group))) * 100}%`, ...item.style }}
      >
        {"█".repeat(120)}
      </span>
    ))}
  </div>
)

/**
 * Terminal: per group, the label and total, the bar, then the legend two states a line;
 * every line 20px, the groups `gap-2` apart.
 */
const TerminalGroup = ({ group }: { group: Group }) => (
  <div className="flex flex-col">
    <TerminalLineWithDots title={group.label} value={abbreviateNumber(totalOf(group))} />
    <TerminalBar group={group} />
    <div className="grid grid-cols-2">
      {group.states.map((state) => (
        <TerminalLineWithDots
          key={state.label}
          title={
            <>
              <span style={{ color: state.color }}>█</span> {state.label}
            </>
          }
          titleClassName="font-normal"
          titleStyle={{ color: "var(--terminal-color-default)" }}
          value={abbreviateNumber(state.value)}
        />
      ))}
    </div>
  </div>
)

export function GithubFollowup({ data, config, style, size }: FollowupProps): React.ReactElement {
  if (!data) return <></>

  const groups = followupGroups(data)
  const title = config.followup_title ?? "Issues & Pull Requests"
  const hideTitle = config.followup_hide_title ?? false
  const subtitle = data.scope === "repositories" ? "on my repositories" : "opened by me"

  return (
    <section id="github-followup">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} subtitle={subtitle} icon={<GoIssueOpened />} />}
            <div className="w-full grid grid-cols-2 gap-4">
              {groups.map((group) => (
                <DefaultGroup key={group.label} group={group} size={size} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github", section: "followup", size })} />
            <div className="flex flex-col gap-2">
              {groups.map((group) => (
                <TerminalGroup key={group.label} group={group} />
              ))}
            </div>
          </>
        }
      />
    </section>
  )
}
