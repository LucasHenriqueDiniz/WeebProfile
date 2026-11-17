import { type FontWeight, type TextFont, textWidth, wrappedLineCount, wrappedRows } from "../../utils/text-lines"
import { computeStarDelta, formatCount } from "./components/redesign"
import { resolveLanguagesVariant, resolveStarGraphVariant } from "./types"
import type { GithubRepoConfig, GithubRepoData } from "./types"

/**
 * Heights of the stats, star_graph, languages, topics and overview sections, at content size
 * md, before `content_size` scales them (the banner is in banner-height.ts).
 *
 * Every constant is the section's height measured 17/11/2026 in Chrome 158, Firefox 150 and
 * WebKit 26.4 (Playwright 1.60) the way `pnpm --filter @weeb/svg-generator audit:heights`
 * measures it (renderPlugins, theme CSS, no terminal header), with the mock and with real
 * repositories; `section-heights.test.ts` pins them. Where the engines differ by a fraction
 * of a px (Firefox rounds the `normal` line height of Poppins up), the constant is the
 * tallest, and the caller rounds up once.
 *
 * Until 11/2026 each default section added 24px on top of the 24px the PluginManager adds to
 * every card, and counted fixed rows: a stats card had 31px of blank under it, a languages
 * card in full 54px, and a card of ten topics in half cut its third row of chips.
 *
 * The terminal heights are the section drawn alone: the command line and the content.
 * `calculateHeight` takes the PluginManager's 24px back off them, as it always did.
 *
 * `width` is the section's content width divided by `scale`, the content size's zoom:
 * ScaledBox zooms inside the section, so its text wraps in that width. The default style's
 * section pads 8px each side, outside the zoom (399px in half), and its card 18px more inside
 * (the card's `border` draws nothing: there is no `border-style`). The terminal section has
 * no padding (415px in half) and its content sits in `px-1`.
 */

/** One `text-xs` line (12px, 16px line height). */
const XS_LINE = 16
/** One `text-sm` line in the terminal (14px, 20px line height). */
const SM_LINE = 20
/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND = 24

const cardInner = (width: number) => width - 36
const terminalInner = (width: number) => width - 8

/**
 * A flex or grid `gap` of `px`, in the zoomed section's px. WebKit 26.4 does not zoom `gap`:
 * at sm (0.82) an 8px gap stays 8 screen px, 9.76 of the section's px, where Chrome and
 * Firefox draw 8. That put a chip on a row of its own and 7px under five language bars.
 * Below md this counts WebKit's gap; above md WebKit's is the smaller one.
 */
const gapAt = (px: number, scale: number) => px / Math.min(1, scale)

// ---------------------------------------------------------------------------------------
// Text in a flex row

type Piece = { width: number; space: number }

/**
 * A text's unbreakable pieces, each with the width of the space before it (none at the start
 * or after a hyphen).
 * `slash` also breaks after "/", as Firefox does and Chrome and WebKit do not.
 */
function pieces(text: string, fontSize: number, font: TextFont, weight: FontWeight = 400, slash = false): Piece[] {
  const space = textWidth(" ", fontSize, font, weight)
  const split = slash ? /(?<=[-/])/ : /(?<=-)/
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word, w) =>
      word
        .split(split)
        .filter(Boolean)
        .map((piece, i) => ({ width: textWidth(piece, fontSize, font, weight), space: w > 0 && i === 0 ? space : 0 }))
    )
}

/** Lines `pieces` take, greedy, in a box `maxWidth` wide. */
function packedLines(list: Piece[], maxWidth: number): number {
  let lines = 0
  let used = 0
  for (const { width, space } of list) {
    if (lines === 0 || used + space + width > maxWidth) {
      lines++
      used = width
    } else {
      used += space + width
    }
  }
  return lines
}

/** An item of a `flex` row: `fixed` px that never wrap (an icon and its gap) beside a text. */
type RowItem = { fixed: number; text: Piece[] }

const itemBasis = ({ fixed, text }: RowItem) =>
  fixed + text.reduce((sum, p, i) => sum + (i > 0 ? p.space : 0) + p.width, 0)
const itemMin = ({ fixed, text }: RowItem) => fixed + Math.max(0, ...text.map((p) => p.width))

/**
 * Lines the tallest item of a one-line `flex` row takes: when the items do not fit, each
 * shrinks in proportion to its width, never under its longest piece, and its text wraps
 * (CSS flexbox's "resolve the flexible lengths").
 */
function flexRowLines(items: RowItem[], gap: number, maxWidth: number): number {
  const basis = items.map(itemBasis)
  const min = items.map(itemMin)
  const available = maxWidth - gap * (items.length - 1)
  const sum = (list: number[]) => list.reduce((total, n) => total + n, 0)
  if (sum(basis) <= available) return 1

  const size = [...basis]
  const frozen = basis.map((b, i) => b <= min[i]!)
  for (;;) {
    const frozenSize = sum(size.filter((_, i) => frozen[i]))
    const shrinkable = sum(basis.filter((_, i) => !frozen[i]))
    if (shrinkable === 0) break
    const free = available - frozenSize - shrinkable
    let clamped = false
    basis.forEach((b, i) => {
      if (frozen[i]) return
      size[i] = b + (free * b) / shrinkable
      if (size[i]! < min[i]!) {
        size[i] = min[i]!
        frozen[i] = true
        clamped = true
      }
    })
    if (!clamped) break
  }
  return Math.max(
    ...items.map((item, i) => (size[i]! >= basis[i]! ? 1 : packedLines(item.text, size[i]! - item.fixed)))
  )
}

// ---------------------------------------------------------------------------------------
// Sections

/**
 * Stats. The terminal draws one `text-sm` line in `py-1`. In the default style the grid is
 * 78.25px (Chrome, Firefox and WebKit alike), `sparkstats` 29px more for the sparkline under
 * the stars when there is a history to draw, and `inline` is one 48px row. That row holds the
 * four counters and the star delta, `justify-between`: when they do not fit (half at lg and
 * xl), the delta, the only item with a space, wraps to two 16px lines and the row grows 8px.
 */
export function statsHeight(
  cfg: GithubRepoConfig,
  repo: GithubRepoData,
  isTerminal: boolean,
  width: number,
  scale = 1
): number {
  if (isTerminal) return TERMINAL_COMMAND + 8 + SM_LINE
  switch (cfg.stats_variant ?? "grid") {
    case "inline": {
      const delta = computeStarDelta(repo.starHistory)
      if (!delta) return 48
      const counters: Array<[number, string]> = [
        [repo.stargazerCount, "stars"],
        [repo.forkCount, "forks"],
        [repo.openIssuesCount, "issues"],
        [repo.watcherCount, "watchers"],
      ]
      // Each counter is a 16px semibold number, `gap-1.5`, a 12px label: it never wraps.
      const items: RowItem[] = counters.map(([value, label]) => ({
        fixed: textWidth(formatCount(value), 16, "poppins", 600) + gapAt(6, scale) + textWidth(label, 12),
        text: [],
      }))
      // The delta, `text-xs` medium: its "▲" comes from a fallback font, 1em in all three engines.
      const percent = delta.label.slice(delta.label.indexOf(" ") + 1)
      items.push({
        fixed: 0,
        text: [
          { width: 12, space: 0 },
          { width: textWidth(percent, 12, "poppins", 500), space: textWidth(" ", 12, "poppins", 500) },
        ],
      })
      const lines = flexRowLines(items, 0, cardInner(width))
      return 48 + Math.max(0, lines * XS_LINE - 24)
    }
    case "sparkstats":
      return repo.starHistory.length >= 2 ? 107.25 : 78.25
    case "featured":
      // WebKit draws the "▲" of the delta 0.1px taller.
      return 84.1
    default:
      return 78.25
  }
}

/** Star graph: fixed heights, and nothing without two points of history. */
export function starGraphHeight(cfg: GithubRepoConfig, repo: GithubRepoData, isTerminal: boolean): number {
  if (repo.starHistory.length < 2) return 0
  // The command, then the 120px chart in `pb-1`, with 5px of line box under the inline svg.
  if (isTerminal) return 153
  switch (resolveStarGraphVariant(cfg.star_graph_variant)) {
    case "area":
      // Eyebrow, stars head, `mt-2` and the 110px chart.
      return 185.65
    case "milestones":
      return 114.2
    case "sparkline":
      return 76
    default:
      // bars, steps, dots: the stars head and 110px of chart, or the bars and their labels.
      return 163.65
  }
}

/** Languages, as the component caps them. */
const LANGUAGES_LIMIT = 5

/** Height of `rows` lines of `lineHeight` with `gap` between them; 0 rows is 0. */
const lines = (rows: number, lineHeight: number, gap: number) => (rows > 0 ? lineHeight * rows + gap * (rows - 1) : 0)

export function languagesHeight(
  cfg: GithubRepoConfig,
  repo: GithubRepoData,
  isTerminal: boolean,
  width: number,
  scale = 1
): number {
  if (repo.languages.length === 0) return 0
  const langs = repo.languages.slice(0, Math.min(cfg.max_languages ?? LANGUAGES_LIMIT, LANGUAGES_LIMIT))
  const gap = (px: number) => gapAt(px, scale)

  if (isTerminal) {
    // Command, 6px bar, `gap-2`, the legend and `pb-1`. Legend items: 8px dot, the 12px
    // monospace name and percentage, `gap-1` inside, `gap-x-3` and `gap-y-1` between.
    const rows = wrappedRows(
      langs.map((l) => 8 + gap(4) + textWidth(l.name, 12, "mono") + gap(4) + textWidth(`${l.percentage}%`, 12, "mono")),
      terminalInner(width),
      gap(12)
    )
    return TERMINAL_COMMAND + 6 + gap(8) + 4 + lines(rows, XS_LINE, gap(4))
  }

  switch (resolveLanguagesVariant(cfg.languages_variant)) {
    case "bars":
      // `py-4`, a 16px row per language, `gap-2.5`.
      return 32 + lines(langs.length, XS_LINE, gap(10))
    case "donut": {
      // The 96px donut in `py-4`, and 7px under the inline svg for the text's descent. The
      // legend column beside it (`gap-2` away, `px-[18px]`, `gap-[7px]`) is shorter unless
      // its names wrap: each row shrinks its 12px semibold name between the 8px dot and the
      // percentage, `gap-1.5`. The column never gets narrower than its longest word; past
      // that it runs out of the card, which clips it.
      const legendRows = langs.map((l): RowItem[] => [
        { fixed: 8, text: [] },
        { fixed: 0, text: pieces(l.name, 12, "poppins", 600) },
        { fixed: textWidth(`${l.percentage}%`, 11), text: [] },
      ])
      const rowMin = (items: RowItem[]) => items.reduce((sum, item) => sum + itemMin(item), 0) + gap(6) * 2
      const legendWidth = Math.max(width - 18 - 96 - gap(8) - 36, ...legendRows.map(rowMin))
      const rows = legendRows.map((items) => flexRowLines(items, gap(6), legendWidth))
      const legend = rows.reduce((sum, n) => sum + XS_LINE * n, 0) + gap(7) * Math.max(0, rows.length - 1)
      return Math.max(135, legend)
    }
    case "blocks":
      // 88px of blocks, the 15px caption and `pb-3`; nothing without a language.
      return langs.length > 0 ? 116 : 0
    case "spectrum":
    default: {
      // `py-4`, the 14px bar, `mt-3`, then the legend: 8px dot, `gap-1.5`, the 12px
      // semibold name, the 11px percentage; `gap-x-4` and `gap-y-1.5` between items.
      const rows = wrappedRows(
        langs.map(
          (l) => 8 + gap(6) + textWidth(l.name, 12, "poppins", 600) + gap(6) + textWidth(`${l.percentage}%`, 11)
        ),
        cardInner(width),
        gap(16)
      )
      return 58 + lines(rows, XS_LINE, gap(6))
    }
  }
}

/** Topics, as the component caps them. */
const TOPICS_LIMIT = 6

/**
 * Rows of chips, `gap` apart both ways: a chip wider than the line wraps its own text.
 *
 * A chip has 12px of padding each side, 5px up and down, and a 0.5px border that the
 * browser draws one device pixel wide: 1px at md, and 1/scale of the zoomed px at the other
 * content sizes (1.22px at sm). At sm those fractions moved the last chip of a full row to the
 * next one. Screens with two device pixels a px draw it thinner, so this is the widest.
 */
function chipRowsHeight(
  chips: Array<{ text: string; fontSize: number; lineHeight: number }>,
  maxWidth: number,
  scale: number
): number {
  const gap = gapAt(8, scale)
  const frame = 24 + 2 / scale
  const sized = chips.map(({ text, fontSize, lineHeight }) => {
    const natural = textWidth(text, fontSize, "poppins", 500) + frame
    const wraps = natural > maxWidth
    const textLines = wraps ? wrappedLineCount(text, { fontSize, maxWidth: maxWidth - frame, weight: 500 }) : 1
    return { width: Math.min(natural, maxWidth), height: lineHeight * textLines + 10 + 2 / scale }
  })
  const rows: number[] = []
  let used = 0
  for (const { width, height } of sized) {
    if (rows.length === 0 || used + gap + width > maxWidth) {
      rows.push(height)
      used = width
    } else {
      rows[rows.length - 1] = Math.max(rows[rows.length - 1]!, height)
      used += gap + width
    }
  }
  return rows.reduce((sum, h) => sum + h, 0) + gap * Math.max(0, rows.length - 1)
}

export function topicsHeight(
  cfg: GithubRepoConfig,
  repo: GithubRepoData,
  isTerminal: boolean,
  width: number,
  scale = 1
): number {
  if (repo.topics.length === 0) return 0
  const visible = repo.topics.slice(0, Math.min(cfg.max_topics ?? TOPICS_LIMIT, TOPICS_LIMIT))
  const remaining = repo.topics.length - visible.length

  if (isTerminal) {
    // The command stays without topics. 12px monospace items, `gap-1.5` both ways, `pb-1`.
    const items = visible.map((t) => `#${t}`)
    if (visible.length > 0 && remaining > 0) items.push(`+${remaining} more`)
    const gap = gapAt(6, scale)
    const rows = wrappedRows(
      items.map((t) => textWidth(t, 12, "mono")),
      terminalInner(width),
      gap
    )
    return TERMINAL_COMMAND + 4 + lines(rows, XS_LINE, gap)
  }

  // The default style draws nothing without a visible topic.
  if (visible.length === 0) return 0
  const inner = cardInner(width)

  switch (cfg.topics_variant ?? "chips") {
    case "hash": {
      // `py-3.5`, 14px medium text at `leading-[1.9]`, wrapping. Chrome breaks the line as if
      // the `tracking-[-0.01em]` were not there (486 of 486 measured cases), Firefox and
      // WebKit with it: counting without it is never short, a line over in a few cases.
      const text = visible.map((t) => `#${t}`).join(" ")
      return 28 + 26.6 * wrappedLineCount(text, { fontSize: 14, maxWidth: inner, weight: 500 })
    }
    case "cloud":
      // The first two at 13px on a 20px line, the rest 12px on 18px; `py-4`, `gap-2`.
      return (
        32 +
        chipRowsHeight(
          visible.map((text, i) =>
            i < 2 ? { text, fontSize: 13, lineHeight: 20 } : { text, fontSize: 12, lineHeight: 18 }
          ),
          inner,
          scale
        )
      )
    case "chips":
    default: {
      // `text-xs` chips and a "+N" chip for the rest; `py-4`, `gap-2`.
      const chips = visible.map((text) => ({ text, fontSize: 12, lineHeight: XS_LINE }))
      if (remaining > 0) chips.push({ text: `+${remaining}`, fontSize: 12, lineHeight: XS_LINE })
      return 32 + chipRowsHeight(chips, inner, scale)
    }
  }
}

/**
 * Overview. Default: name and meta row, the description when there is one, the stars row,
 * and the 92px chart when there are two points of history; the meta row (language, forks,
 * issues, license) shrinks and wraps to a second line when it does not fit. Terminal: one
 * `text-sm` line in `py-1` that wraps the same way.
 */
export function overviewHeight(repo: GithubRepoData, isTerminal: boolean, width: number, scale = 1): number {
  if (isTerminal) {
    const others = [`★ ${repo.stargazerCount}`, `⑂ ${repo.forkCount}`, `issues ${repo.openIssuesCount}`]
    // Firefox breaks after the "/" of owner/repo, Chrome and WebKit do not: the most lines of the two.
    const rowLines = Math.max(
      ...[false, true].map((slash) =>
        flexRowLines(
          [repo.nameWithOwner, ...others].map((text, i) => ({
            fixed: 0,
            text: pieces(text, 14, "mono", 400, slash && i === 0),
          })),
          gapAt(16, scale),
          terminalInner(width)
        )
      )
    )
    return TERMINAL_COMMAND + 8 + SM_LINE * rowLines
  }

  // Meta row: `text-xs`, `gap-3.5`, a 3px dot between items.
  const items: RowItem[] = []
  const dot: RowItem = { fixed: 3, text: [] }
  if (repo.primaryLanguage) {
    items.push({ fixed: 8 + gapAt(6, scale), text: pieces(repo.primaryLanguage.name, 12, "poppins") }, dot)
  }
  const counter = (value: number, label: string): RowItem => ({
    fixed: 0,
    text: [
      { width: textWidth(formatCount(value), 12, "poppins", 600), space: 0 },
      { width: textWidth(label, 12), space: textWidth(" ", 12) },
    ],
  })
  items.push(counter(repo.forkCount, "forks"), dot, counter(repo.openIssuesCount, "issues"))
  if (repo.licenseInfo?.spdxId) items.push(dot, { fixed: 0, text: pieces(repo.licenseInfo.spdxId, 12, "poppins") })
  const metaLines = flexRowLines(items, gapAt(14, scale), cardInner(width))

  return 105.4 + (repo.description ? 22 : 0) + (repo.starHistory.length >= 2 ? 98 : 0) + XS_LINE * (metaLines - 1)
}
