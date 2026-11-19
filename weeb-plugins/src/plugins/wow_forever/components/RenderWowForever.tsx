import React from "react"
import {
  GiAnvil,
  GiCheckedShield,
  GiDungeonGate,
  GiHorseHead,
  GiScrollUnfurled,
  GiSpellBook,
  GiTrophy,
} from "react-icons/gi"
import { LIST, type Size, type Style } from "../layout"
import { SECTION_IDS, collectionRows, resolveOptions, sectionBody, visibleData, type SectionId } from "../options"
import type { WowForeverConfig, WowForeverData } from "../types"
import { Character } from "./Character"
import { Equipment } from "./Equipment"
import { ListRows } from "./ListRows"
import { ProgressRows } from "./ProgressRows"
import { WowSection } from "./Section"
import { Stats } from "./Stats"

interface RenderWowForeverProps {
  config: WowForeverConfig
  data: WowForeverData
  style: Style
  size: Size
}

/** "Nov 18": the day an achievement was completed. UTC, so every render agrees. */
const shortDate = (ms: number): string =>
  new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

const formatCount = (n: number): string => n.toLocaleString("en-US")

/** The enabled sections, in the order the card lists them. */
export function RenderWowForever({ config, data: fetched, style, size }: RenderWowForeverProps): React.ReactElement {
  const options = resolveOptions(config)
  const data = visibleData(fetched, config)
  const ids = (config.sections ?? []).filter((id): id is SectionId => (SECTION_IDS as readonly string[]).includes(id))

  const frame = (id: SectionId, icon: React.ReactElement, command: string, body: React.ReactNode) => (
    <WowSection
      key={id}
      id={`wow-forever-${id}`}
      style={style}
      title={options.title(id)}
      hideTitle={options.hideTitle(id)}
      icon={icon}
      command={`wow ${command} ${data.slug}`}
    >
      {body}
    </WowSection>
  )

  return (
    <>
      {ids.map((id) => {
        // Exactly the sections calculateHeight counts: one with nothing to draw is left out.
        if (sectionBody(id, data, style, size, options) === null) return null
        const common = { data, style, size, title: options.title(id), hideTitle: options.hideTitle(id) }
        switch (id) {
          case "character":
            return <Character key={id} {...common} />
          case "equipment":
            return <Equipment key={id} {...common} max={options.max(id)} />
          case "stats":
            return (
              <Stats
                key={id}
                id="wow-forever-stats"
                command={`wow stats ${data.slug}`}
                stats={data.stats}
                style={style}
                size={size}
                title={common.title}
                hideTitle={common.hideTitle}
              />
            )
          case "journey":
            return (
              <Stats
                key={id}
                id="wow-forever-journey"
                command={`wow journey ${data.slug}`}
                icon={<GiScrollUnfurled />}
                stats={data.journey}
                style={style}
                size={size}
                title={common.title}
                hideTitle={common.hideTitle}
              />
            )
          case "professions":
            return frame(
              id,
              <GiAnvil />,
              "professions",
              <ProgressRows rows={data.professions} style={style} size={size} />
            )
          case "reputations":
            return frame(
              id,
              <GiCheckedShield />,
              "rep",
              <ProgressRows rows={data.reputations.slice(0, options.max(id))} style={style} size={size} />
            )
          case "talents":
            return frame(id, <GiSpellBook />, "talents", <ProgressRows rows={data.talents} style={style} size={size} />)
          case "dungeons":
            return frame(
              id,
              <GiDungeonGate />,
              "dungeons",
              <ListRows
                style={style}
                columns={LIST.columns[size]}
                trailWidth={132}
                valueWidth={36}
                rows={data.dungeons.slice(0, options.max(id)).map((kill) => ({
                  text: kill.boss,
                  trail: kill.dungeon,
                  value: `×${kill.kills}`,
                }))}
              />
            )
          case "achievements":
            return frame(
              id,
              <GiTrophy />,
              "achievements",
              <ListRows
                style={style}
                columns={LIST.columns[size]}
                withIcon
                valueWidth={48}
                rows={data.achievements.slice(0, options.max(id)).map((a) => ({
                  icon: a.icon,
                  text: a.name,
                  value: shortDate(a.completedAt),
                }))}
              />
            )
          case "collection":
            return frame(
              id,
              <GiHorseHead />,
              "collection",
              <ListRows
                style={style}
                columns={1}
                valueWidth={30}
                rows={collectionRows(data).map((row) => ({
                  lead: row.kind,
                  text: row.names.join(", "),
                  value: formatCount(row.names.length),
                }))}
              />
            )
        }
      })}
    </>
  )
}
