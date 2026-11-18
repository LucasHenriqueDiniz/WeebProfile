import React from "react"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { useItemCascade } from "../../../templates/animations"
import {
  COMMAND_HEIGHT,
  DEFAULT_PADDING_Y,
  SECTION_PADDING_X,
  TERMINAL_GAP,
  TERMINAL_PADDING_BOTTOM,
  neofetchBodyHeight,
  neofetchMetrics,
  type Size,
  type Style,
} from "../layout"
import type { NeofetchContent } from "../types"

/**
 * The theme's own colors, the way neofetch ends with the terminal's palette. Theme
 * variables rather than fixed ANSI colors, so the row follows the theme, a custom
 * accent and the light/dark switch of the auto color mode.
 */
const PALETTE: Record<Style, string[]> = {
  terminal: [
    "--terminal-color-muted-light",
    "--terminal-color-warning",
    "--terminal-color-success",
    "--terminal-color-highlight",
    "--terminal-color-muted",
    "--terminal-color-default",
  ],
  default: [
    "--default-color-highlight",
    "--default-color-success",
    "--default-color-default",
    "--default-color-muted",
    "--default-color-muted-light",
  ],
}

/** Longest a label column gets before its labels end in an ellipsis. */
const LABEL_MAX_WIDTH: Record<Size, number> = { half: 96, full: 150 }

/** "user@host" as its two halves; a title with no @ is all user. */
export function splitTitle(title: string): { user: string; host: string | null } {
  const at = title.indexOf("@")
  if (at < 0) return { user: title, host: null }
  return { user: title.slice(0, at), host: title.slice(at + 1) }
}

const ellipsis: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }

interface NeofetchProps {
  content: NeofetchContent
  style: Style
  size: Size
  showPalette: boolean
  showCursor: boolean
}

export function Neofetch({ content, style, size, showPalette, showCursor }: NeofetchProps): React.ReactElement {
  const terminal = style === "terminal"
  const m = neofetchMetrics(style, size)
  const hasImage = Boolean(content.image)
  const bodyHeight = neofetchBodyHeight(style, size, {
    fields: content.fields.length,
    hasImage,
    showPalette,
    showCursor,
  })
  const { user, host } = splitTitle(content.title)
  // Each field is a label and a value: they print in reading order, line by line.
  const cascade = useItemCascade(content.fields.length * 2)
  const accent = terminal ? "var(--terminal-color-highlight)" : "var(--default-color-highlight)"
  const text = terminal ? "var(--terminal-color-default)" : "var(--default-color-default)"

  const title = (
    <div
      style={{
        ...ellipsis,
        height: `${m.titleLine}px`,
        lineHeight: `${m.titleLine}px`,
        fontSize: `${m.titleFont}px`,
        fontWeight: terminal ? 600 : 700,
        color: accent,
      }}
    >
      {user}
      {host !== null && (
        <>
          <span style={{ color: text }}>@</span>
          {host}
        </>
      )}
    </div>
  )

  // neofetch underlines the title with as many dashes as it has characters.
  const rule = terminal ? (
    <div
      style={{
        ...ellipsis,
        height: `${m.rule}px`,
        lineHeight: `${m.rule}px`,
        fontSize: `${m.titleFont}px`,
        color: "var(--terminal-color-muted-light)",
      }}
    >
      {"-".repeat(Math.max(4, [...content.title].length))}
    </div>
  ) : (
    <div style={{ height: `${m.rule}px`, display: "flex", alignItems: "center" }}>
      <div
        style={{
          height: "1px",
          width: "100%",
          backgroundColor: "color-mix(in srgb, var(--default-color-muted) 30%, transparent)",
        }}
      />
    </div>
  )

  const fields =
    content.fields.length > 0 ? (
      <div
        className={cascade?.className}
        style={{
          display: "grid",
          gridTemplateColumns: `max-content minmax(0, 1fr)`,
          gridAutoRows: `${m.fieldLine}px`,
          columnGap: terminal ? "10px" : "14px",
          fontSize: `${m.fieldFont}px`,
          lineHeight: `${m.fieldLine}px`,
          ...cascade?.style,
        }}
      >
        {content.fields.map((field, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                ...ellipsis,
                maxWidth: `${LABEL_MAX_WIDTH[size]}px`,
                fontWeight: 600,
                color: terminal ? "var(--terminal-color-warning)" : accent,
              }}
            >
              {terminal && field.label ? `${field.label}:` : field.label}
            </span>
            <span style={{ ...ellipsis, color: text }}>{field.value}</span>
          </React.Fragment>
        ))}
      </div>
    ) : null

  const palette = showPalette ? (
    <div
      style={{
        display: "flex",
        gap: terminal ? 0 : "6px",
        height: `${m.swatch.height}px`,
        marginTop: `${m.paletteGap}px`,
        flexShrink: 0,
      }}
    >
      {PALETTE[style].map((variable) => (
        <span
          key={variable}
          style={{
            display: "block",
            width: `${m.swatch.width}px`,
            height: `${m.swatch.height}px`,
            borderRadius: terminal ? 0 : "3px",
            backgroundColor: `var(${variable})`,
          }}
        />
      ))}
    </div>
  ) : null

  const body = (
    <div
      className="about-neofetch"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: hasImage ? `${m.imageGap}px` : 0,
        height: `${bodyHeight}px`,
        marginTop: terminal ? `${TERMINAL_GAP}px` : 0,
        paddingLeft: terminal ? "4px" : 0,
        // The terminal's embedded JetBrains Mono, as TerminalBody gives the other
        // plugins' output; the container itself falls back to Courier New.
        ...(terminal ? { fontFamily: "var(--font-family)" } : {}),
      }}
    >
      {hasImage && (
        <img
          src={content.image!}
          alt=""
          width={m.image}
          height={m.image}
          style={{
            width: `${m.image}px`,
            height: `${m.image}px`,
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: terminal ? "4px" : "12px",
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {title}
        {rule}
        {fields}
        {palette}
      </div>
    </div>
  )

  if (!terminal) {
    return (
      <section id="about-neofetch" style={{ padding: `${DEFAULT_PADDING_Y}px ${SECTION_PADDING_X}px` }}>
        {body}
      </section>
    )
  }

  return (
    <section id="about-neofetch" style={{ padding: `0 ${SECTION_PADDING_X}px ${TERMINAL_PADDING_BOTTOM}px` }}>
      <TerminalCommand command="neofetch" />
      {body}
      {showCursor && (
        <div
          className="flex items-center gap-2 px-1 py-0.5"
          style={{ height: `${COMMAND_HEIGHT}px`, marginTop: `${TERMINAL_GAP}px`, boxSizing: "border-box" }}
        >
          <span
            className="text-terminal-highlight"
            style={{ fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: 700 }}
          >
            $
          </span>
          <span
            className="about-cursor"
            aria-hidden="true"
            style={{
              display: "block",
              width: "0.55rem",
              height: "1.05rem",
              backgroundColor: "var(--terminal-color-default)",
            }}
          />
        </div>
      )}
    </section>
  )
}
