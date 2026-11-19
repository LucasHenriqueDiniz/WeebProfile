import React from "react"
import { useItemCascade } from "../../../templates/animations"
import { LIST, listBodyHeight, type Style } from "../layout"
import { COLORS, ellipsis } from "./Section"

export interface ListRowData {
  /** A game icon (data URI). Without one, `mark` draws a small colored mark in its place. */
  icon?: string | null
  /** The icon's frame, or the mark's color: an item's quality. */
  color?: string | null
  /** The fixed column before the text: an item's slot, a collection's kind. */
  lead?: string
  text: string
  /** Muted text after the main one, in a fixed column: the dungeon of a boss. */
  trail?: string
  /** The right-aligned value: an item level, a kill count, a date. */
  value?: string
}

interface ListRowsProps {
  rows: ListRowData[]
  style: Style
  columns: number
  /** Width of the `trail` column. */
  trailWidth?: number
  /** Width of the `value` column. */
  valueWidth?: number
  /** Whether the rows have an icon or mark slot at all. */
  withIcon?: boolean
}

function Mark({ row, style }: { row: ListRowData; style: Style }) {
  const size = LIST.icon[style]
  const terminal = style === "terminal"
  const color = row.color ?? COLORS[style].muted
  if (row.icon) {
    return (
      <img
        src={row.icon}
        alt=""
        width={size}
        height={size}
        style={{
          display: "block",
          flexShrink: 0,
          width: `${size}px`,
          height: `${size}px`,
          boxSizing: "border-box",
          border: `1px solid ${color}`,
          borderRadius: terminal ? 0 : "3px",
        }}
      />
    )
  }
  // No icon: a mark in the icon's place keeps the columns aligned.
  return (
    <span style={{ display: "flex", flexShrink: 0, width: `${size}px`, justifyContent: "center" }}>
      <span
        style={{
          display: "block",
          width: terminal ? "7px" : "3px",
          height: terminal ? "7px" : "14px",
          borderRadius: terminal ? 0 : "2px",
          backgroundColor: color,
        }}
      />
    </span>
  )
}

/**
 * One-line rows in a grid, `LIST.row` tall each: the shape of the equipment, dungeons,
 * achievements and collection sections. Text ends in an ellipsis instead of wrapping.
 */
export function ListRows({ rows, style, columns, trailWidth = 0, valueWidth = 30, withIcon = false }: ListRowsProps) {
  const cascade = useItemCascade(rows.length)
  const terminal = style === "terminal"
  const colors = COLORS[style]
  const row = LIST.row[style]
  return (
    <div
      className={cascade?.className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: `${row}px`,
        columnGap: `${LIST.columnGap}px`,
        height: `${listBodyHeight(style, rows.length, columns)}px`,
        fontSize: `${LIST.font[style]}px`,
        lineHeight: `${row}px`,
        ...cascade?.style,
      }}
    >
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          {withIcon && <Mark row={r} style={style} />}
          {r.lead !== undefined && (
            <span
              style={{
                ...ellipsis,
                flexShrink: 0,
                width: `${LIST.leadWidth[style]}px`,
                color: colors.label,
                fontWeight: terminal ? 600 : 400,
              }}
            >
              {terminal ? `${r.lead}:` : r.lead}
            </span>
          )}
          <span style={{ ...ellipsis, flex: 1, minWidth: 0, color: colors.text, fontWeight: terminal ? 400 : 500 }}>
            {r.text}
          </span>
          {r.trail !== undefined && (
            <span style={{ ...ellipsis, flexShrink: 0, width: `${trailWidth}px`, color: colors.muted }}>{r.trail}</span>
          )}
          {r.value !== undefined && (
            <span
              style={{
                ...ellipsis,
                flexShrink: 0,
                width: `${valueWidth}px`,
                textAlign: "right",
                color: colors.muted,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {r.value}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
