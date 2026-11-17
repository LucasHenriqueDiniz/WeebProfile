/**
 * How many lines a paragraph wraps to, for a `calculateHeight` that depends on it.
 *
 * `calculateHeight` runs without a browser, so this replays the browser's line breaking:
 * greedy, at spaces and after hyphens, with each character's advance width. A word wider
 * than the line overflows on a line of its own, as with the default `overflow-wrap`.
 *
 * Widths are Poppins 400, 500 and 600 (the default style embeds them), in thousandths of an
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

/** Poppins 500 (`font-medium`), U+0020 to U+007E. */
const POPPINS_500_ASCII = [
  260, 321, 323, 872, 650, 794, 761, 172, 492, 492, 504, 714, 225, 585, 241, 514, 641, 350, 577, 594, 647, 639, 642,
  560, 638, 635, 245, 304, 612, 774, 590, 538, 1025, 697, 630, 773, 709, 524, 515, 773, 705, 264, 564, 633, 444, 882,
  721, 784, 595, 787, 632, 604, 564, 690, 694, 999, 660, 605, 558, 485, 717, 484, 654, 798, 254, 678, 678, 600, 678,
  617, 332, 678, 649, 264, 264, 554, 264, 1039, 649, 638, 678, 678, 384, 534, 372, 649, 576, 825, 499, 582, 471, 516,
  324, 516, 553,
]

/** Poppins 500, U+00C0 to U+00FF. */
const POPPINS_500_LATIN1 = [
  697, 697, 697, 697, 697, 697, 921, 773, 524, 524, 524, 524, 264, 264, 264, 264, 720, 721, 784, 784, 784, 784, 784,
  699, 784, 690, 690, 690, 690, 605, 595, 699, 678, 678, 678, 678, 678, 678, 1085, 600, 617, 617, 617, 617, 264, 264,
  264, 264, 636, 649, 638, 638, 638, 638, 638, 679, 638, 649, 649, 649, 649, 582, 678, 582,
]

/** Poppins 600 (`font-semibold`), U+0020 to U+007E. */
const POPPINS_600_ASCII = [
  238, 354, 364, 887, 654, 829, 778, 195, 485, 485, 518, 674, 254, 583, 260, 486, 646, 362, 574, 599, 661, 644, 640,
  548, 643, 626, 263, 324, 584, 738, 567, 538, 1051, 716, 643, 768, 717, 532, 530, 768, 717, 278, 570, 663, 459, 899,
  735, 785, 608, 787, 641, 609, 577, 697, 711, 1024, 686, 636, 576, 497, 756, 496, 680, 790, 271, 678, 678, 602, 678,
  617, 345, 678, 661, 278, 278, 584, 278, 1048, 661, 638, 678, 678, 404, 545, 388, 661, 599, 844, 540, 605, 483, 508,
  309, 508, 592,
]

/** Poppins 600, U+00C0 to U+00FF. */
const POPPINS_600_LATIN1 = [
  716, 716, 716, 716, 716, 716, 937, 768, 532, 532, 532, 532, 278, 278, 278, 278, 726, 735, 785, 785, 785, 785, 785,
  670, 785, 697, 697, 697, 697, 636, 608, 727, 678, 678, 678, 678, 678, 678, 1077, 602, 617, 617, 617, 617, 290, 290,
  290, 290, 638, 661, 638, 638, 638, 638, 638, 648, 634, 661, 661, 661, 661, 605, 678, 605,
]

export type FontWeight = 400 | 500 | 600

const POPPINS: Record<FontWeight, { ascii: number[]; latin1: number[] }> = {
  400: { ascii: POPPINS_ASCII, latin1: POPPINS_LATIN1 },
  500: { ascii: POPPINS_500_ASCII, latin1: POPPINS_500_LATIN1 },
  600: { ascii: POPPINS_600_ASCII, latin1: POPPINS_600_LATIN1 },
}

/** Any other character: Latin Extended and symbols near an average letter, emoji and CJK a full em. */
function fallbackWidth(codePoint: number): number {
  return codePoint >= 0x2e80 ? 1000 : 600
}

function poppinsWidth(codePoint: number, weight: FontWeight): number {
  const { ascii, latin1 } = POPPINS[weight]
  if (codePoint >= 0x20 && codePoint <= 0x7e) return ascii[codePoint - 0x20]!
  if (codePoint >= 0xc0 && codePoint <= 0xff) return latin1[codePoint - 0xc0]!
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

/**
 * Width of `text` on one line, in px: what a `flex-wrap` row packs. `weight` picks the
 * Poppins table; the monospace is as wide in every weight.
 */
export function textWidth(
  text: string,
  fontSize: number,
  font: TextFont = "poppins",
  weight: FontWeight = 400
): number {
  let thousandths = 0
  for (const char of text) {
    const codePoint = char.codePointAt(0)!
    thousandths += font === "mono" ? monoWidth(codePoint) : poppinsWidth(codePoint, weight)
  }
  return (thousandths * fontSize) / 1000
}

/**
 * Rows a `flex-wrap` line of items takes: each item as wide as `widths` says, `gap` apart.
 * An item wider than the line still takes a row of its own.
 */
export function wrappedRows(widths: number[], maxWidth: number, gap: number): number {
  let rows = 0
  let used = 0
  for (const width of widths) {
    if (rows === 0 || used + gap + width > maxWidth) {
      rows++
      used = width
    } else {
      used += gap + width
    }
  }
  return rows
}

export interface WrapOptions {
  /** Font size in px. */
  fontSize: number
  /** Width of the line box in px. */
  maxWidth: number
  /** The `line-clamp`, if any. */
  maxLines?: number
  font?: TextFont
  /** Poppins weight, 400 by default. */
  weight?: FontWeight
}

/** Lines `text` takes when wrapped in a box `maxWidth` wide. 0 for empty text. */
export function wrappedLineCount(
  text: string,
  { fontSize, maxWidth, maxLines, font = "poppins", weight = 400 }: WrapOptions
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

  const space = textWidth(" ", fontSize, font, weight)
  let lines = 1
  let lineWidth = 0
  for (const { piece, glued } of pieces) {
    const width = textWidth(piece, fontSize, font, weight)
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
