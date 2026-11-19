import React from "react"
import { useItemCascade } from "../../../templates/animations"
import { PROGRESS, progressBodyHeight, type Size, type Style } from "../layout"
import type { WowProgress } from "../types"
import { COLORS, ellipsis } from "./Section"

/**
 * Reputation standings in the game's colors, from Hated (0) to Exalted (7). Only the bar
 * takes them; the standing's name stays in the theme's text color.
 */
const STANDING_COLORS = ["#cc2222", "#ff0000", "#ee6622", "#ffff00", "#00ff00", "#00ff88", "#00ffcc", "#00ffff"]

function barColor(row: WowProgress, style: Style): string {
  if (row.tier !== undefined) return STANDING_COLORS[Math.max(0, Math.min(7, row.tier))]!
  return COLORS[style].accent
}

interface ProgressRowsProps {
  rows: WowProgress[]
  style: Style
  size: Size
}

/**
 * Rows of an icon, a name, a bar and a value, `PROGRESS.row` tall each, in one column
 * (half) or two (full). The bar is the value's share of the row's max.
 */
export function ProgressRows({ rows, style, size }: ProgressRowsProps): React.ReactElement {
  const cascade = useItemCascade(rows.length)
  const terminal = style === "terminal"
  const colors = COLORS[style]
  const iconSize = PROGRESS.icon[style]
  const barHeight = PROGRESS.bar[style]
  const hasIcons = rows.some((r) => r.icon)
  return (
    <div
      className={cascade?.className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${PROGRESS.columns[size]}, minmax(0, 1fr))`,
        gridAutoRows: `${PROGRESS.row[style]}px`,
        columnGap: `${PROGRESS.columnGap}px`,
        height: `${progressBodyHeight(style, size, rows.length)}px`,
        fontSize: `${PROGRESS.font[style]}px`,
        lineHeight: `${PROGRESS.row[style]}px`,
        ...cascade?.style,
      }}
    >
      {rows.map((row, i) => {
        const share = row.max > 0 ? Math.max(0, Math.min(1, row.value / row.max)) : 0
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            {hasIcons &&
              (row.icon ? (
                <img
                  src={row.icon}
                  alt=""
                  width={iconSize}
                  height={iconSize}
                  style={{
                    display: "block",
                    flexShrink: 0,
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    borderRadius: terminal ? 0 : "4px",
                  }}
                />
              ) : (
                <span style={{ display: "block", flexShrink: 0, width: `${iconSize}px` }} />
              ))}
            <span
              style={{
                ...ellipsis,
                flexShrink: 0,
                width: `${PROGRESS.nameWidth[style]}px`,
                color: terminal ? colors.label : colors.text,
                fontWeight: terminal ? 600 : 500,
              }}
            >
              {row.name}
            </span>
            <span
              style={{
                position: "relative",
                display: "block",
                flex: 1,
                minWidth: 0,
                height: `${barHeight}px`,
                borderRadius: terminal ? 0 : "999px",
                overflow: "hidden",
                background: terminal
                  ? "var(--terminal-color-surface)"
                  : "color-mix(in srgb, var(--default-color-muted) 18%, transparent)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(share * 100).toFixed(2)}%`,
                  borderRadius: terminal ? 0 : "999px",
                  backgroundColor: barColor(row, style),
                }}
              />
            </span>
            <span
              style={{
                ...ellipsis,
                flexShrink: 0,
                width: `${PROGRESS.valueWidth[style]}px`,
                textAlign: "right",
                color: colors.muted,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {row.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
