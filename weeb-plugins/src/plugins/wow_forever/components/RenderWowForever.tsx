import React from "react"
import type { Size, Style } from "../layout"
import { resolveOptions } from "../options"
import type { WowForeverConfig, WowForeverData } from "../types"
import { Character } from "./Character"
import { Equipment } from "./Equipment"
import { Stats } from "./Stats"

interface RenderWowForeverProps {
  config: WowForeverConfig
  data: WowForeverData
  style: Style
  size: Size
}

/** The enabled sections, in the order the card lists them. */
export function RenderWowForever({ config, data, style, size }: RenderWowForeverProps): React.ReactElement {
  const options = resolveOptions(config)
  return (
    <>
      {(config.sections ?? []).map((id) => {
        if (id === "character") {
          return (
            <Character
              key={id}
              data={data}
              style={style}
              size={size}
              title={options.characterTitle}
              hideTitle={options.characterHideTitle}
            />
          )
        }
        if (id === "equipment") {
          return (
            <Equipment
              key={id}
              data={data}
              style={style}
              size={size}
              title={options.equipmentTitle}
              hideTitle={options.equipmentHideTitle}
              max={options.equipmentMax}
            />
          )
        }
        if (id === "stats") {
          return (
            <Stats
              key={id}
              data={data}
              style={style}
              size={size}
              title={options.statsTitle}
              hideTitle={options.statsHideTitle}
            />
          )
        }
        return null
      })}
    </>
  )
}
