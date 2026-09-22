/**
 * Terminal utilities for generating decorative borders and layouts
 */

export interface TerminalBorderOptions {
  title?: string
  size: "half" | "full"
  type?: "single" | "double"
}

/**
 * Generate decorative terminal border with title
 * ╭─ Title ─────────────────────────────╮
 * ╰─────────────────────────────────────╯
 */
export function generateTerminalBorder(options: TerminalBorderOptions): {
  top: string
  bottom: string
} {
  const { title = "", size, type = "single" } = options

  // Define widths based on size
  const widths = {
    half: 45, // Smaller for half mode
    full: 80, // Larger for full mode
  }

  const width = widths[size]
  const titleLength = title.length

  // Calculate padding for centered title
  const totalPadding = width - titleLength - 4 // 4 = 2 for borders + 2 for spaces
  const leftPadding = Math.floor(totalPadding / 2)
  const rightPadding = totalPadding - leftPadding

  // Generate borders based on type
  const chars =
    type === "double"
      ? { topLeft: "╔", topRight: "╗", bottomLeft: "╚", bottomRight: "╝", horizontal: "═", vertical: "║" }
      : { topLeft: "╭", topRight: "╮", bottomLeft: "╰", bottomRight: "╯", horizontal: "─", vertical: "│" }

  const top = title
    ? `${chars.topLeft}${chars.horizontal} ${title} ${chars.horizontal.repeat(Math.max(0, rightPadding))}${chars.topRight}`
    : `${chars.topLeft}${chars.horizontal.repeat(width - 2)}${chars.topRight}`

  const bottom = `${chars.bottomLeft}${chars.horizontal.repeat(width - 2)}${chars.bottomRight}`

  return { top, bottom }
}

/**
 * Generate a simple horizontal line
 */
export function generateHorizontalLine(size: "half" | "full", type: "single" | "double" = "single"): string {
  const widths = {
    half: 45,
    full: 80,
  }

  const width = widths[size]
  const char = type === "double" ? "═" : "─"

  return char.repeat(width)
}

/**
 * Generate a section divider with optional title
 */
export function generateSectionDivider(title?: string, size: "half" | "full" = "full"): string {
  if (!title) {
    return generateHorizontalLine(size)
  }

  const widths = {
    half: 45,
    full: 80,
  }

  const width = widths[size]
  const titleWithSpaces = ` ${title} `
  const remaining = width - titleWithSpaces.length
  const left = "─".repeat(Math.floor(remaining / 2))
  const right = "─".repeat(remaining - left.length)

  return `${left}${titleWithSpaces}${right}`
}
