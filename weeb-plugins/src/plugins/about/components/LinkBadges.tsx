import React from "react"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { useItemCascade } from "../../../templates/animations"
import {
  BADGE,
  DEFAULT_PADDING_Y,
  SECTION_PADDING_X,
  TERMINAL_GAP,
  TERMINAL_PADDING_BOTTOM,
  badgeRowIndent,
  cardBadgeWidth,
  type Size,
  type Style,
} from "../layout"
import type { AboutLink } from "../types"
import { LinkBadge } from "./LinkBadge"

interface LinkBadgesProps {
  links: AboutLink[]
  style: Style
  size: Size
  brandColors: boolean
}

/**
 * The links section: a wrapping row of badges.
 *
 * In a README the card is one image with one click target, so these badges are for
 * looking at; the tiles (Plugin.tiles) give each badge an image and a link of its own.
 */
export function LinkBadges({ links, style, size, brandColors }: LinkBadgesProps): React.ReactElement | null {
  const cascade = useItemCascade(links.length)
  if (links.length === 0) return null
  const terminal = style === "terminal"

  return (
    <section
      id="about-links"
      style={{
        padding: terminal
          ? `0 ${SECTION_PADDING_X}px ${TERMINAL_PADDING_BOTTOM}px`
          : `${DEFAULT_PADDING_Y}px ${SECTION_PADDING_X}px`,
      }}
    >
      {terminal && <TerminalCommand command="ls ~/links" />}
      <div
        className={cascade?.className}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: terminal ? "flex-start" : "center",
          gap: `${BADGE.gap}px`,
          marginTop: terminal ? `${TERMINAL_GAP}px` : 0,
          paddingLeft: `${badgeRowIndent(style)}px`,
          ...cascade?.style,
        }}
      >
        {links.map((link, i) => (
          <LinkBadge
            key={`${i}-${link.href}`}
            link={link}
            style={style}
            width={cardBadgeWidth(link.label, style, size)}
            brandColors={brandColors}
          />
        ))}
      </div>
    </section>
  )
}
