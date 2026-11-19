import React from "react"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { SECTION_PADDING_X, SECTION_PADDING_Y, TERMINAL_GAP, type Style } from "../layout"

export const ellipsis: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }

/** The theme colors each style draws its text in. */
export const COLORS: Record<Style, { text: string; muted: string; accent: string; label: string }> = {
  default: {
    text: "var(--default-color-default)",
    muted: "var(--default-color-muted)",
    accent: "var(--default-color-highlight)",
    label: "var(--default-color-muted)",
  },
  terminal: {
    text: "var(--terminal-color-default)",
    muted: "var(--terminal-color-muted)",
    accent: "var(--terminal-color-highlight)",
    label: "var(--terminal-color-warning)",
  },
}

interface WowSectionProps {
  id: string
  style: Style
  title: string
  hideTitle: boolean
  icon: React.ReactElement
  command: string
  children: React.ReactNode
}

/**
 * A section's frame: the title (default) or the command line (terminal) above the body,
 * with the paddings `sectionHeight` counts.
 */
export function WowSection({ id, style, title, hideTitle, icon, command, children }: WowSectionProps) {
  if (style === "terminal") {
    return (
      <section id={id} style={{ padding: `0 ${SECTION_PADDING_X}px ${SECTION_PADDING_Y}px` }}>
        <TerminalCommand command={command} />
        {/* The terminal's embedded JetBrains Mono, as TerminalBody gives the other plugins. */}
        <div style={{ marginTop: `${TERMINAL_GAP}px`, paddingLeft: "4px", fontFamily: "var(--font-family)" }}>
          {children}
        </div>
      </section>
    )
  }
  return (
    <section
      id={id}
      style={{ padding: `${hideTitle ? SECTION_PADDING_Y : 0}px ${SECTION_PADDING_X}px ${SECTION_PADDING_Y}px` }}
    >
      {!hideTitle && <DefaultTitle title={title} icon={icon} />}
      {children}
    </section>
  )
}
