import React from "react"
import { GiShield } from "react-icons/gi"
import { EQUIPMENT, LIST, type Size, type Style } from "../layout"
import type { ItemQuality, WowForeverData } from "../types"
import { ListRows } from "./ListRows"
import { WowSection } from "./Section"

/**
 * The game's item quality colors, drawn as the icon's frame or a mark beside the name and
 * never as the text itself: uncommon green on a white page is 1.4:1. Common is white in
 * the game, so it takes the theme's muted color instead (null here), which shows on both.
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
  if (items.length === 0) return null

  return (
    <WowSection
      id="wow-forever-equipment"
      style={style}
      title={title}
      hideTitle={hideTitle}
      icon={<GiShield />}
      command={`wow gear ${data.slug}`}
    >
      <ListRows
        style={style}
        columns={LIST.columns[size]}
        withIcon
        valueWidth={EQUIPMENT.levelWidth}
        rows={items.map((item) => ({
          icon: item.icon,
          color: QUALITY_COLORS[item.quality],
          lead: item.slot,
          text: item.name,
          value: item.itemLevel === null ? "" : String(item.itemLevel),
        }))}
      />
    </WowSection>
  )
}
