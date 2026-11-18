import React from "react"
import { readFlag } from "../services/options"
import type { Size, Style } from "../layout"
import type { AboutConfig, AboutData } from "../types"
import { LinkBadges } from "./LinkBadges"
import { Neofetch } from "./Neofetch"

interface RenderAboutProps {
  config: AboutConfig
  data: AboutData
  style: Style
  size: Size
}

/** The enabled sections, in the order the card lists them. */
export function RenderAbout({ config, data, style, size }: RenderAboutProps): React.ReactElement {
  const sections = (config.sections ?? []).filter((id) => id === "neofetch" || id === "links")
  return (
    <>
      {sections.map((id) =>
        id === "neofetch" ? (
          <Neofetch
            key={id}
            content={data.neofetch}
            style={style}
            size={size}
            showPalette={readFlag(config, "neofetch_show_palette")}
            showCursor={readFlag(config, "neofetch_show_cursor")}
          />
        ) : (
          <LinkBadges
            key={id}
            links={data.links}
            style={style}
            size={size}
            brandColors={readFlag(config, "links_brand_colors")}
          />
        )
      )}
    </>
  )
}
