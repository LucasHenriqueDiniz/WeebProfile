/**
 * Heights of the GitHub sections, in px, as the browser lays them out (see
 * `calculateHeight` in index.tsx, which sums them).
 *
 * Measured 17/11/2026 in Chrome, Firefox and WebKit (Playwright 1.60) the way
 * `pnpm --filter @weeb/svg-generator audit:heights` measures, with the mock and with real
 * data from the GitHub API; `section-heights.test.ts` pins the measurements. Every number
 * below is a box from the components, named where it is used. Text that wraps goes through
 * `wrappedLineCount`: Poppins, which the default style embeds, and 0.6em a character for
 * the terminal's monospace.
 *
 * Terminal heights are the section drawn alone, so they include the 8px `padding-bottom` of
 * `.terminal-body`, which wraps all the sections of the card once. `calculateHeight` takes
 * it back off every section after the first.
 */

import { type TextFont, textWidth, wrappedLineCount } from "../../utils/text-lines"
import type { GithubConfig, GithubData } from "./types"
import { groupActivitiesByDay } from "./components/RecentActivity"

type Size = "half" | "full"

/** DefaultTitle: 28px row plus `my-1.5`. */
export const DEFAULT_TITLE_HEIGHT = 40
/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND_HEIGHT = 24
/** `.terminal-body` `padding-bottom`, drawn once per card. */
export const TERMINAL_BODY_PADDING = 8
/** One `text-sm` line (TerminalGrid row and header, terminal lines). */
const LINE = 20
/** "+N more" under a terminal list: `mt-2` and a `text-sm` line. */
const TERMINAL_MORE = 8 + LINE
/** "+N more" under a default list of cards: `mt-3` and a `text-sm` line. */
const DEFAULT_MORE = 12 + LINE

/** Width a section's content gets: the card minus the section's 8px side padding. */
const CONTENT_WIDTH: Record<Size, number> = { half: 415 - 16, full: 830 - 16 }

const title = (hidden: boolean | undefined): number => (hidden ? 0 : DEFAULT_TITLE_HEIGHT)

/** Height of boxes stacked with `gap` between them. */
const stack = (heights: number[], gap: number): number =>
  heights.length === 0 ? 0 : heights.reduce((sum, h) => sum + h, 0) + gap * (heights.length - 1)

/** TerminalCommand, then a TerminalGrid: its header row and one row per item. */
const terminalGrid = (rows: number, more = false): number =>
  TERMINAL_COMMAND_HEIGHT + LINE + rows * LINE + (more ? TERMINAL_MORE : 0) + TERMINAL_BODY_PADDING

/**
 * Lines a text takes, by `wrappedLineCount`, one paragraph per line break (the custom
 * introduction keeps them, `whitespace-pre-line`); an empty paragraph is still a line.
 *
 * The width loses one space: WebKit moves a word down when the space after it does not
 * fit. 47 monospace characters filled a 399px line in Chrome and Firefox and wrapped in
 * WebKit.
 */
function textLines(text: string, maxWidth: number, fontSize: number, font: TextFont, maxLines?: number): number {
  const width = maxWidth - textWidth(" ", fontSize, font)
  const lines = text
    .split("\n")
    .reduce((sum, paragraph) => sum + Math.max(1, wrappedLineCount(paragraph, { fontSize, maxWidth: width, font })), 0)
  return maxLines === undefined ? lines : Math.min(lines, maxLines)
}

/** Rows a `flex-wrap` line of items of these widths takes, `gap` apart. */
function wrappedRows(widths: number[], available: number, gap: number): number {
  let rows = 0
  let used = 0
  for (const width of widths) {
    if (rows === 0 || used + gap + width > available) {
      rows++
      used = width
    } else {
      used += gap + width
    }
  }
  return rows
}

/** Repository cards (starred, gists, top repositories): 120px each, 16px apart. */
function repositoryCards(n: number, hideTitle: boolean | undefined, more: boolean): number {
  return title(hideTitle) + stack(Array(n).fill(120), 16) + (more ? DEFAULT_MORE : 0)
}

export function favoriteLanguagesHeight(cfg: GithubConfig, languages: GithubData["languages"], isTerminal: boolean) {
  const ignored = cfg.favorite_languages_ignore_languages
    ? cfg.favorite_languages_ignore_languages.split(",").map((lang) => lang.trim().toLowerCase())
    : []
  const shown = (languages ?? []).filter((lang) => !ignored.includes(lang.name.toLowerCase())).length
  if (shown === 0) return 0
  const n = Math.min(shown, cfg.favorite_languages_max_languages ?? 10)
  // The bar, then one row per language, `gap-1` apart: 20px rows under a 20px text bar in
  // the terminal, 24px rows under a 10px bar in the default style.
  if (isTerminal) return TERMINAL_COMMAND_HEIGHT + LINE + n * (4 + LINE) + TERMINAL_BODY_PADDING
  return title(cfg.favorite_languages_hide_title) + 10 + n * (4 + 24)
}

export function favoriteLicenseHeight(cfg: GithubConfig, isTerminal: boolean): number {
  // Terminal: the tree's 19px title (18 in WebKit) and its three 20px lines. Default: the
  // 45px icon beside an `text-lg` and a `text-sm` line.
  if (isTerminal) return TERMINAL_COMMAND_HEIGHT + 19 + 3 * LINE + TERMINAL_BODY_PADDING
  return title(cfg.favorite_license_hide_title) + 48
}

export function codeHabitsHeight(
  cfg: GithubConfig,
  habits: GithubData["codeHabits"] | undefined,
  size: Size,
  isTerminal: boolean
): number {
  if (!habits) return 0
  const hours = !cfg.code_habits_hide_hours
  const weekdays = !cfg.code_habits_hide_weekdays
  const footer = !cfg.code_habits_hide_footer
  const stats = !cfg.code_habits_hide_stats && !!habits.commitStats
  const languages = cfg.code_habits_hide_languages ? 0 : Object.keys(habits.languages ?? {}).length

  if (isTerminal) {
    // One `gap-1` column: each block is a label (a 19px line with `my-1`) and its 20px lines.
    const label = 4 + 19 + 4
    const lines: number[] = []
    if (hours) lines.push(label, ...Array(24).fill(LINE))
    if (weekdays) lines.push(label, ...Array(7).fill(LINE))
    // The bar, then the top 5
    if (languages > 0) lines.push(label, LINE, ...Array(Math.min(languages, 5)).fill(LINE))
    if (stats) lines.push(label, LINE, LINE, LINE)
    // `text-xs` line with `mt-1`
    if (footer) lines.push(4 + 16)
    return TERMINAL_COMMAND_HEIGHT + stack(lines, 4) + TERMINAL_BODY_PADDING
  }

  // One `gap-2` column: the hour chart (title and 128px bars), the grid of the weekday and
  // language charts (always there, even empty), the statistics and the footer.
  const width = CONTENT_WIDTH[size]
  const weekdayChart = 7 * 28 + 6 * 4 // 7 rows (a `text-xs` line, `mb-1`, an 8px bar), `gap-1`
  const weekdayTitle = (columnWidth: number) =>
    textLines("Commit activity per day of week", columnWidth, 14, "poppins") * LINE
  let grid = 0
  if (weekdays && languages > 0) {
    // Two columns, `gap-x-2`: titles, then charts. The language chart is at most 7 rows,
    // never taller. The weekday title wraps to two lines in a half card's column.
    grid = weekdayTitle((width - 8) / 2) + 8 + weekdayChart
  } else if (weekdays) {
    grid = weekdayTitle(width) + 8 + weekdayChart
  } else if (languages > 0) {
    // Title and chart side by side in the two columns.
    grid = Math.max(LINE, Math.min(languages, 7) * 32 - 4)
  }
  const blocks: number[] = []
  if (hours) blocks.push(LINE + 128)
  blocks.push(grid)
  if (stats) {
    // Title, `gap-2`, then three columns (`gap-2`, `px-4`) of a `text-2xl` number over a
    // `text-xs` label: three lines in a half card, one in a full card.
    const column = (width - 16) / 3 - 32
    const labels = ["Avg. Changes per Commit", "Total Files Changed", "Largest Commit (changes)"]
    const labelLines = Math.max(...labels.map((label) => textLines(label, column, 12, "poppins")))
    blocks.push(LINE + 8 + 32 + labelLines * 16)
  }
  if (footer) blocks.push(16)
  return title(cfg.code_habits_hide_title) + stack(blocks, 8)
}

export function starredRepositoriesHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  const starred = gh.starredRepositories
  if (!starred || starred.totalCount === 0) return 0
  const max = cfg.starred_repositories_max ?? 10
  const n = Math.min(starred.nodes.length, max)
  const more = starred.totalCount > max
  return isTerminal ? terminalGrid(n, more) : repositoryCards(n, cfg.starred_repositories_hide_title, more)
}

export function gistsHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  const gists = gh.gists
  if (!gists || gists.totalCount === 0) return 0
  const max = cfg.gists_max ?? 10
  const n = Math.min(gists.nodes.length, max)
  const more = gists.totalCount > max
  return isTerminal ? terminalGrid(n, more) : repositoryCards(n, cfg.gists_hide_title, more)
}

export function topRepositoriesHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  const repos = gh.topRepositories ?? []
  if (repos.length === 0) return 0
  const max = cfg.top_repositories_max ?? 10
  const n = Math.min(repos.length, max)
  const more = repos.length > max
  return isTerminal ? terminalGrid(n, more) : repositoryCards(n, cfg.top_repositories_hide_title, more)
}

export function stargazersHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  const stargazers = gh.stargazers
  if (!stargazers || stargazers.totalCount === 0) return 0
  // The component lists at most 10 repositories.
  const n = Math.min(stargazers.repositories.length, 10)
  const more = stargazers.repositories.length > 10
  // Terminal: a "Total Stars" row before the repositories.
  if (isTerminal) return terminalGrid(n + 1, more)
  // The 84px total box and its `mb-4`, then 73px rows `gap-4` apart; "+N more" has `mt-4`.
  return title(cfg.stargazers_hide_title) + 84 + 16 + stack(Array(n).fill(73), 16) + (more ? 16 + LINE : 0)
}

export function starListsHeight(cfg: GithubConfig, gh: GithubData, size: Size, isTerminal: boolean): number {
  const lists = (gh.starLists ?? []).slice(0, cfg.star_lists_max ?? 5)
  if (lists.length === 0) return 0
  if (isTerminal) return terminalGrid(lists.length)
  const inner = CONTENT_WIDTH[size] - 24 // the card's `p-3`
  const cards = lists.map((list) => {
    const repos = Math.min(list.repositories.length, 5)
    const repoLines: number[] = Array(repos).fill(LINE)
    // "+N more" is a `text-xs` line with `mt-1`
    if (list.repositories.length > 5) repoLines.push(4 + 16)
    // The description is clamped to two lines.
    const description = list.description ? textLines(list.description, inner, 14, "poppins", 2) * LINE + 12 : 0
    // `p-3`, the name (24px, `mb-2`), the description (`mb-3`), the repositories `gap-2`
    return 24 + 24 + 8 + description + stack(repoLines, 8)
  })
  return title(cfg.star_lists_hide_title) + stack(cards, 16)
}

export function notableContributionsHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  const n = Math.min(gh.notableContributions?.length ?? 0, cfg.notable_contributions_max ?? 10)
  if (n === 0) return 0
  if (isTerminal) return terminalGrid(n)
  // Cards of a fixed 100px, `gap-3`
  return title(cfg.notable_contributions_hide_title) + stack(Array(n).fill(100), 12)
}

const ACTIVITY_BADGES = new Set(["commit", "pr", "issue", "comment", "branch", "merged"])

export function recentActivityHeight(cfg: GithubConfig, gh: GithubData, size: Size, isTerminal: boolean): number {
  const activities = (gh.recentActivity ?? []).slice(0, cfg.recent_activity_max ?? 10)
  if (activities.length === 0) return 0
  // One truncated 20px line per activity, `gap-1`
  if (isTerminal) return TERMINAL_COMMAND_HEIGHT + stack(Array(activities.length).fill(LINE), 4) + TERMINAL_BODY_PADDING

  // Card content beside the 14px icon and its `gap-3`, inside the card's `p-3`
  const inner = CONTENT_WIDTH[size] - 24 - 14 - 12
  const activityHeight = (activity: (typeof activities)[number]): number => {
    // Badge and time: the badge is 20px, the time alone a 16px `text-xs` line.
    const header = ACTIVITY_BADGES.has(activity.type) ? 20 : 16
    // The title, `text-sm`, clamped to two lines
    const titleLines = textLines(activity.title, inner, 14, "poppins", 2)
    // Files, additions, deletions and repository: `text-xs` items, `gap-2`, wrapping. The
    // file count is in the card's font, the rest `font-mono`.
    const items: number[] = []
    if (activity.filesChanged) {
      const { files, additions, deletions } = activity.filesChanged
      items.push(textWidth(`${files} file${files !== 1 ? "s" : ""}`, 12))
      if (additions > 0) items.push(textWidth(`+${additions}`, 12, "mono"))
      if (deletions > 0) items.push(textWidth(`-${deletions}`, 12, "mono"))
    }
    items.push(textWidth(activity.repository, 12, "mono"))
    const footerRows = wrappedRows(items, inner, 8)
    // `p-3`, then the three rows, each with `mb-1.5`
    return 24 + header + 6 + titleLines * LINE + 6 + footerRows * 16 + 6
  }
  // Activities grouped by day: the day's `text-xs` label, `gap-3`, its cards `gap-3`; days `gap-4`
  const days = Array.from(groupActivitiesByDay(activities).values()).map(
    (day) => 16 + 12 + stack((day ?? []).map(activityHeight), 12)
  )
  return title(cfg.recent_activity_hide_title) + stack(days, 16)
}

export function introductionHeight(cfg: GithubConfig, gh: GithubData, size: Size, isTerminal: boolean): number {
  const intro = gh.introduction
  if (!intro) return 0
  const custom = cfg.introduction_custom_text
  // The bio is a plain paragraph: its line breaks render as spaces.
  const bio = intro.bio?.replace(/\s+/g, " ")
  const organizations = gh.activity?.organizations ?? 0
  const width = CONTENT_WIDTH[size]

  // The details the component lists, as it writes them
  const details: string[] = []
  if (intro.location) details.push(intro.location)
  if (intro.company) details.push(intro.company)
  if (organizations > 0) details.push(`${organizations} organization${organizations !== 1 ? "s" : ""}`)

  if (isTerminal) {
    if (intro.websiteUrl) details.push(intro.websiteUrl)
    if (intro.twitterUsername) details.push(`@${intro.twitterUsername}`)
    // `text-sm` monospace across the body's `px-2`; each detail starts with an emoji.
    const lines = (text: string) => textLines(text, width, 14, "mono") * LINE
    const blocks: number[] = []
    // Paragraphs keep the browser's 1em (14px) margins inside the `gap-1` column.
    if (custom) blocks.push(14 + lines(custom) + 14)
    if (bio) blocks.push(14 + lines(bio) + 14)
    blocks.push(
      stack(
        details.map((detail) => lines(`📍 ${detail}`)),
        4
      )
    )
    return TERMINAL_COMMAND_HEIGHT + stack(blocks, 4) + TERMINAL_BODY_PADDING
  }

  if (intro.websiteUrl) details.push(intro.websiteUrl.replace(/^https?:\/\//, ""))
  if (intro.twitterUsername) details.push(`@${intro.twitterUsername}`)
  const lines = (text: string) => textLines(text, width, 14, "poppins") * LINE
  const blocks: number[] = []
  if (custom) blocks.push(lines(custom))
  if (bio) blocks.push(lines(bio))
  // Details: a 16px icon, `gap-1.5`, the `text-sm` text; `flex-wrap` with `gap-4` both ways
  const rows = wrappedRows(
    details.map((detail) => 16 + 6 + textWidth(detail, 14)),
    width,
    16
  )
  blocks.push(stack(Array(rows).fill(LINE), 16))
  return title(cfg.introduction_hide_title) + stack(blocks, 12)
}

export function featuredRepositoriesHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  // The component draws every repository the fetch kept (at most 20).
  const n = Math.min(gh.featuredRepositories?.length ?? 0, 20)
  if (n === 0) return 0
  if (isTerminal) return terminalGrid(n)
  return title(cfg.featured_repositories_hide_title) + stack(Array(n).fill(120), 16)
}

/** Sponsors and sponsorships draw the same list, and an empty state instead of nothing. */
function sponsorListHeight(
  list: { totalCount: number; nodes: unknown[] } | undefined,
  max: number,
  hideTitle: boolean | undefined,
  isTerminal: boolean
): number {
  const n = Math.min(list?.nodes.length ?? 0, max)
  if (isTerminal) {
    // The empty state is one `h-6` line.
    return n === 0 ? TERMINAL_COMMAND_HEIGHT + 24 + TERMINAL_BODY_PADDING : terminalGrid(n)
  }
  // Empty: a `text-sm` line with `py-4`
  if (n === 0) return title(hideTitle) + 16 + LINE + 16
  // Rows of a 40px avatar in `p-3`, `gap-2`; "+N more" has `mt-2`
  const rows: number[] = Array(n).fill(64)
  if ((list?.totalCount ?? 0) > max) rows.push(8 + LINE)
  return title(hideTitle) + stack(rows, 8)
}

export function sponsorsHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  return sponsorListHeight(gh.sponsors, cfg.sponsors_max ?? 10, cfg.sponsors_hide_title, isTerminal)
}

export function sponsorshipsHeight(cfg: GithubConfig, gh: GithubData, isTerminal: boolean): number {
  return sponsorListHeight(gh.sponsorships, cfg.sponsorships_max ?? 10, cfg.sponsorships_hide_title, isTerminal)
}

export function peopleHeight(cfg: GithubConfig, gh: GithubData, size: Size, isTerminal: boolean): number {
  if (cfg.people_type === "repository" && !cfg.people_repository) {
    // The component draws an error box instead, in both styles: `p-3` around a `text-sm`
    // message that wraps to two lines in a half card.
    return 24 + (size === "half" ? 2 : 1) * LINE + (isTerminal ? TERMINAL_BODY_PADDING : 0)
  }
  const people = gh.people
  if (!people || people.nodes.length === 0) return 0
  const max = cfg.people_max ?? 10
  const n = Math.min(people.nodes.length, max)
  if (isTerminal) return terminalGrid(n)

  // 40px avatars, `flex-wrap` with `gap-2` both ways
  const width = CONTENT_WIDTH[size]
  const perRow = Math.floor((width + 8) / 48)
  const rows = Math.ceil(n / perRow)
  let height = stack(Array(rows).fill(40), 8)
  if (people.totalCount > max) {
    // "+N more" (`ml-2`, `text-sm`) follows the last avatar, or starts a 20px row of its own.
    const used = (n - perRow * (rows - 1)) * 48 - 8
    const moreWidth = 8 + 8 + textWidth(`+${people.totalCount - max} more`, 14)
    if (used + moreWidth > width) height += 8 + LINE
  }
  return title(cfg.people_hide_title) + height
}

export function repositoryContributorsHeight(cfg: GithubConfig, gh: GithubData, size: Size, isTerminal: boolean) {
  const n = Math.min(gh.repositoryContributors?.length ?? 0, cfg.repository_contributors_max ?? 10)
  if (n === 0) return 0
  if (isTerminal) return terminalGrid(n)
  // Cards of a 32px avatar beside two lines (20 + 16) in `p-2`, 2 or 3 columns, `gap-3`
  const rows = Math.ceil(n / (size === "full" ? 3 : 2))
  return title(cfg.repository_contributors_hide_title) + stack(Array(rows).fill(52), 12)
}
