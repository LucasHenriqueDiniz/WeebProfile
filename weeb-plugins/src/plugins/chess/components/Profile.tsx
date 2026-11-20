/**
 * Profile - avatar (Chess.com) or the site's logo (Lichess has no avatars), title, name,
 * site, country, join date and followers or play time.
 */

import React from "react"
import { FaChessKnight } from "react-icons/fa"
import { SiChessdotcom, SiLichess } from "react-icons/si"
import { CascadeGroup } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { ExternalLink } from "../../../utils/external-link"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { ChessConfig, ChessData } from "../types"
import { formatDate, formatPlayTime, hiddenTitle, profileLines, siteName } from "./shown"

/** The header: a 56px avatar beside a 24px name line and a 20px detail line. */
export const PROFILE_HEADER_HEIGHT = 56

interface ProfileProps {
  data: ChessData
  config: ChessConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function SiteIcon({ platform, size }: { platform: ChessData["platform"]; size: number }): React.ReactElement {
  const Icon = platform === "lichess" ? SiLichess : SiChessdotcom
  return <Icon style={{ width: size, height: size }} />
}

function details(data: ChessData): string[] {
  const p = data.profile
  const parts = [siteName(data.platform)]
  if (p.country) parts.push(p.country)
  if (p.joined) parts.push(`since ${formatDate(p.joined, false)}`)
  if (p.followers !== undefined) parts.push(`${p.followers.toLocaleString("en-US")} followers`)
  if (p.playTimeSeconds) parts.push(`${formatPlayTime(p.playTimeSeconds)} played`)
  return parts
}

export function Profile({ data, config, style = "default", size = "half" }: ProfileProps): React.ReactElement {
  const ne = config.nonEssential ?? {}
  const hideTitle = hiddenTitle(ne.profile_hide_title)
  const title = ne.profile_title || "Chess Profile"
  const p = data.profile
  const lines = profileLines(data)

  return (
    <section id="chess-profile">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaChessKnight />} />}
            <ExternalLink
              href={data.profileUrl}
              className="w-full overflow-hidden flex items-center gap-3"
              style={{ height: `${PROFILE_HEADER_HEIGHT}px` }}
            >
              {p.avatar ? (
                <img
                  src={p.avatar}
                  alt={`${data.username}'s avatar`}
                  width={PROFILE_HEADER_HEIGHT}
                  height={PROFILE_HEADER_HEIGHT}
                  className="rounded-lg flex-shrink-0"
                  style={{ width: PROFILE_HEADER_HEIGHT, height: PROFILE_HEADER_HEIGHT }}
                />
              ) : (
                <span
                  className="rounded-lg flex-shrink-0 flex items-center justify-center bg-default-15 text-default-highlight"
                  style={{ width: PROFILE_HEADER_HEIGHT, height: PROFILE_HEADER_HEIGHT }}
                >
                  <SiteIcon platform={data.platform} size={30} />
                </span>
              )}
              <div className="flex-1 min-w-0 flex flex-col">
                <p
                  className="truncate text-default-highlight"
                  style={{ fontSize: "1rem", lineHeight: "24px", height: "24px", fontWeight: 600 }}
                >
                  {p.title && (
                    <span
                      className="rounded"
                      style={{
                        background: "var(--default-color-highlight)",
                        color: "var(--default-color-background)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "1px 5px",
                        marginRight: "6px",
                      }}
                    >
                      {p.title}
                    </span>
                  )}
                  {data.username}
                  {p.name && <span className="text-default-muted font-normal"> · {p.name}</span>}
                </p>
                <p
                  className="truncate text-default-muted"
                  style={{ fontSize: "0.8125rem", lineHeight: "20px", height: "20px" }}
                >
                  {details(data).join(" · ")}
                </p>
              </div>
            </ExternalLink>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "chess", section: "profile", size })} />
            <CascadeGroup count={lines.length}>
              {lines.map(([label, value]) => (
                <TerminalLineWithDots
                  key={label}
                  title={label}
                  value={value}
                  {...(label === "Player" ? { href: data.profileUrl } : {})}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
