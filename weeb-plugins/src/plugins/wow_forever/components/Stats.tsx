import React from "react"
import { GiHeartPlus } from "react-icons/gi"
import { useItemCascade } from "../../../templates/animations"
import { STATS, statsBodyHeight, type Size, type Style } from "../layout"
import type { WowStat } from "../types"
import { COLORS, WowSection, ellipsis } from "./Section"

const formatStat = (value: number): string => Math.round(value).toLocaleString("en-US")

interface StatsProps {
  /** The section's element id and the terminal's command. */
  id: string
  command: string
  icon?: React.ReactElement
  stats: WowStat[]
  style: Style
  size: Size
  title: string
  hideTitle: boolean
}

/** Numbers in tiles (default) or "Label: value" lines (terminal): attributes, the journey. */
export function Stats({
  id,
  command,
  icon,
  stats,
  style,
  size,
  title,
  hideTitle,
}: StatsProps): React.ReactElement | null {
  const cascade = useItemCascade(stats.length)
  if (stats.length === 0) return null
  const terminal = style === "terminal"
  const colors = COLORS[style]
  const columns = STATS.columns[style][size]

  return (
    <WowSection
      id={id}
      style={style}
      title={title}
      hideTitle={hideTitle}
      icon={icon ?? <GiHeartPlus />}
      command={command}
    >
      <div
        className={cascade?.className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: terminal ? `${STATS.terminalLine}px` : undefined,
          gap: terminal ? "0 16px" : `${STATS.gap}px`,
          height: `${statsBodyHeight(style, size, stats.length)}px`,
          ...cascade?.style,
        }}
      >
        {stats.map((stat) =>
          terminal ? (
            <div
              key={stat.label}
              style={{
                ...ellipsis,
                fontSize: "12.5px",
                lineHeight: `${STATS.terminalLine}px`,
                height: `${STATS.terminalLine}px`,
              }}
            >
              <span style={{ color: colors.label, fontWeight: 600 }}>{stat.label}:</span>{" "}
              <span style={{ color: colors.text }}>{formatStat(stat.value)}</span>
            </div>
          ) : (
            <div
              key={stat.label}
              style={{
                minWidth: 0,
                padding: `${STATS.tile.paddingY}px 8px`,
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--default-color-muted) 12%, transparent)",
              }}
            >
              <div
                style={{
                  ...ellipsis,
                  height: `${STATS.tile.label}px`,
                  lineHeight: `${STATS.tile.label}px`,
                  fontSize: "10.5px",
                  color: colors.muted,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  ...ellipsis,
                  height: `${STATS.tile.value}px`,
                  lineHeight: `${STATS.tile.value}px`,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: colors.text,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatStat(stat.value)}
              </div>
            </div>
          )
        )}
      </div>
    </WowSection>
  )
}
