import React from "react"
import { GiHeartPlus } from "react-icons/gi"
import { useItemCascade } from "../../../templates/animations"
import { STATS, statsBodyHeight, type Size, type Style } from "../layout"
import type { WowForeverData } from "../types"
import { COLORS, WowSection, ellipsis } from "./Section"

const formatStat = (value: number): string => Math.round(value).toLocaleString("en-US")

interface StatsProps {
  data: WowForeverData
  style: Style
  size: Size
  title: string
  hideTitle: boolean
}

export function Stats({ data, style, size, title, hideTitle }: StatsProps): React.ReactElement | null {
  const cascade = useItemCascade(data.stats.length)
  if (data.stats.length === 0) return null
  const terminal = style === "terminal"
  const colors = COLORS[style]
  const columns = STATS.columns[style][size]

  return (
    <WowSection
      id="wow-forever-stats"
      style={style}
      title={title}
      hideTitle={hideTitle}
      icon={<GiHeartPlus />}
      command={`wow stats ${data.slug}`}
    >
      <div
        className={cascade?.className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: terminal ? `${STATS.terminalLine}px` : undefined,
          gap: terminal ? "0 16px" : `${STATS.gap}px`,
          height: `${statsBodyHeight(style, size, data.stats.length)}px`,
          ...cascade?.style,
        }}
      >
        {data.stats.map((stat) =>
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
