import React from "react"
import { GiShield } from "react-icons/gi"
import { useItemCascade } from "../../../templates/animations"
import { EQUIPMENT, equipmentBodyHeight, type Size, type Style } from "../layout"
import type { ItemQuality, WowForeverData, WowItem } from "../types"
import { COLORS, WowSection, ellipsis } from "./Section"

/**
 * The game's item quality colors, drawn as a mark beside the name and never as the text
 * itself: uncommon green on a white page is 1.4:1. Common is white in the game, so it
 * takes the theme's muted color instead, which shows on both pages.
 */
const QUALITY_COLORS: Record<ItemQuality, string | null> = {
  POOR: "#9d9d9d",
  COMMON: null,
  UNCOMMON: "#1eff00",
  RARE: "#0070dd",
  EPIC: "#a335ee",
  LEGENDARY: "#ff8000",
  ARTIFACT: "#e6cc80",
  HEIRLOOM: "#00ccff",
}

function qualityColor(quality: ItemQuality, style: Style): string {
  return QUALITY_COLORS[quality] ?? COLORS[style].muted
}

function Row({ item, style }: { item: WowItem; style: Style }) {
  const terminal = style === "terminal"
  const colors = COLORS[style]
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
      <span
        style={{
          display: "block",
          flexShrink: 0,
          width: terminal ? "7px" : "3px",
          height: terminal ? "7px" : "14px",
          borderRadius: terminal ? 0 : "2px",
          backgroundColor: qualityColor(item.quality, style),
        }}
      />
      <span
        style={{
          ...ellipsis,
          flexShrink: 0,
          width: `${EQUIPMENT.slotWidth[style]}px`,
          color: colors.label,
          fontWeight: terminal ? 600 : 400,
        }}
      >
        {terminal ? `${item.slot}:` : item.slot}
      </span>
      <span style={{ ...ellipsis, flex: 1, minWidth: 0, color: colors.text, fontWeight: terminal ? 400 : 500 }}>
        {item.name}
      </span>
      {item.itemLevel !== null && (
        <span
          style={{
            flexShrink: 0,
            width: `${EQUIPMENT.levelWidth}px`,
            textAlign: "right",
            color: colors.muted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {item.itemLevel}
        </span>
      )}
    </div>
  )
}

interface EquipmentProps {
  data: WowForeverData
  style: Style
  size: Size
  title: string
  hideTitle: boolean
  max: number
}

export function Equipment({ data, style, size, title, hideTitle, max }: EquipmentProps): React.ReactElement | null {
  const items = data.equipment.slice(0, max)
  const cascade = useItemCascade(items.length)
  if (items.length === 0) return null
  const row = EQUIPMENT.row[style]

  return (
    <WowSection
      id="wow-forever-equipment"
      style={style}
      title={title}
      hideTitle={hideTitle}
      icon={<GiShield />}
      command={`wow gear ${data.slug}`}
    >
      <div
        className={cascade?.className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${EQUIPMENT.columns[size]}, minmax(0, 1fr))`,
          gridAutoRows: `${row}px`,
          columnGap: `${EQUIPMENT.columnGap}px`,
          height: `${equipmentBodyHeight(style, size, items.length)}px`,
          fontSize: `${EQUIPMENT.font[style]}px`,
          lineHeight: `${row}px`,
          ...cascade?.style,
        }}
      >
        {items.map((item, i) => (
          <Row key={i} item={item} style={style} />
        ))}
      </div>
    </WowSection>
  )
}
