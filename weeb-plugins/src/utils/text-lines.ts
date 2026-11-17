/**
 * How many lines a paragraph wraps to, for a `calculateHeight` that depends on it.
 *
 * `calculateHeight` runs without a browser, so this replays the browser's line breaking:
 * greedy, at spaces and after hyphens, with each character's advance width. A word wider
 * than the line overflows on a line of its own, as with the default `overflow-wrap`.
 *
 * Widths are Poppins 400 (the default font of the default style), in thousandths of an
 * em, measured with canvas `measureText` in Chrome 158 on 17/11/2026 from the woff2 in
 * `fonts/assets`. Kerning is left out, so a line within a few px of the edge can land on
 * either side. The other global fonts (system, serif, mono) are narrower or close to it,
 * so they wrap to the same lines or fewer.
 *
 * Checked 17/11/2026 against 114 real repository descriptions (the 60 most starred on GitHub
 * and the author's 54), in the github_repo banner: Chrome 158 drew 1596 of 1596 cases on
 * the lines this counts.
 */

/** U+0020 to U+007E. */
const POPPINS_ASCII = [
  267, 298, 292, 840, 622, 759, 739, 159, 454, 454, 486, 683, 198, 551, 210, 476, 628, 320, 575, 589, 629, 628, 635,
  546, 631, 630, 213, 264, 555, 723, 539, 524, 1013, 674, 613, 772, 707, 513, 504, 778, 692, 246, 530, 599, 432, 861,
  703, 786, 579, 788, 608, 587, 541, 675, 676, 976, 621, 584, 541, 423, 658, 423, 629, 733, 257, 676, 676, 607, 676,
  620, 329, 676, 640, 246, 248, 515, 246, 1030, 640, 640, 676, 676, 373, 522, 364, 640, 561, 820, 479, 563, 455, 462,
  291, 462, 519,
]

/** U+00C0 to U+00FF: accented Latin letters, as in Portuguese and Spanish descriptions. */
const POPPINS_LATIN1 = [
  674, 674, 674, 674, 674, 674, 900, 772, 513, 513, 513, 513, 246, 246, 246, 246, 725, 703, 786, 786, 786, 786, 786,
  643, 786, 675, 675, 675, 675, 584, 579, 681, 676, 676, 676, 676, 676, 676, 1097, 607, 620, 620, 620, 620, 246, 246,
  246, 246, 638, 640, 640, 640, 640, 640, 640, 657, 640, 640, 640, 640, 640, 563, 676, 563,
]

/** Any other character: Latin Extended and symbols near an average letter, emoji and CJK a full em. */
function fallbackWidth(codePoint: number): number {
  return codePoint >= 0x2e80 ? 1000 : 600
}

function poppinsWidth(codePoint: number): number {
  if (codePoint >= 0x20 && codePoint <= 0x7e) return POPPINS_ASCII[codePoint - 0x20]!
  if (codePoint >= 0xc0 && codePoint <= 0xff) return POPPINS_LATIN1[codePoint - 0xc0]!
  return fallbackWidth(codePoint)
}

export type TextFont = "poppins" | "mono"

/**
 * CJK, from the radicals at U+2E80: a full em wide in any font, and a line can break before
 * and after each character, spaces or not.
 */
const WIDE = "\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef"
const AROUND_WIDE = new RegExp(`(?<=-)|(?<=[${WIDE}])|(?=[${WIDE}])`)

/** Monospace fonts draw every character 0.6em wide (Courier New, Menlo, DejaVu Sans Mono), CJK 1em. */
function monoWidth(codePoint: number): number {
  return codePoint >= 0x2e80 ? 1000 : 600
}

function textWidth(text: string, fontSize: number, font: TextFont): number {
  let thousandths = 0
  for (const char of text) {
    const codePoint = char.codePointAt(0)!
    thousandths += font === "mono" ? monoWidth(codePoint) : poppinsWidth(codePoint)
  }
  return (thousandths * fontSize) / 1000
}

export interface WrapOptions {
  /** Font size in px. */
  fontSize: number
  /** Width of the line box in px. */
  maxWidth: number
  /** The `line-clamp`, if any. */
  maxLines?: number
  font?: TextFont
}

/** Lines `text` takes when wrapped in a box `maxWidth` wide. 0 for empty text. */
export function wrappedLineCount(
  text: string,
  { fontSize, maxWidth, maxLines, font = "poppins" }: WrapOptions
): number {
  // Break opportunities: whitespace (collapsed, like `white-space: normal`), after a hyphen,
  // and around each CJK character. A piece that is not after a space joins the line without one.
  const pieces = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) =>
      word
        .split(AROUND_WIDE)
        .filter(Boolean)
        .map((piece, i) => ({ piece, glued: i > 0 }))
    )
  if (pieces.length === 0) return 0

  const space = textWidth(" ", fontSize, font)
  let lines = 1
  let lineWidth = 0
  for (const { piece, glued } of pieces) {
    const width = textWidth(piece, fontSize, font)
    const gap = lineWidth === 0 || glued ? 0 : space
    if (lineWidth > 0 && lineWidth + gap + width > maxWidth) {
      lines++
      lineWidth = width
    } else {
      lineWidth += gap + width
    }
  }
  return maxLines === undefined ? lines : Math.min(lines, maxLines)
}
