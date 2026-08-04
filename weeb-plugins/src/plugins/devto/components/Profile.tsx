import React from "react"
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import { SiDevdotto } from "react-icons/si"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { DevToConfig, DevToProfile } from "../types"

interface ProfileProps {
  profile: DevToProfile
  config: DevToConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** Mantido em sincronia com calculateHeight em index.tsx. */
export const PROFILE_AVATAR_SIZE = 48

export function Profile({ profile, config, style = "default", size = "half" }: ProfileProps): React.ReactElement {
  const hideTitle = config.profile_hide_title === true || config.profile_hide_title === "true"
  const title = config.profile_title || "Dev.to"

  return (
    <section id="devto-profile">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<SiDevdotto />} />}
            <div className="flex items-center gap-3 w-full">
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ width: `${PROFILE_AVATAR_SIZE}px`, height: `${PROFILE_AVATAR_SIZE}px` }}
                />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-base font-semibold truncate text-default-highlight">{profile.name}</p>
                <p className="text-xs text-default-muted truncate">@{profile.username}</p>
                <div className="flex gap-3 text-xs text-default-muted">
                  {profile.location && (
                    <span className="flex items-center gap-1 truncate">
                      <FaMapMarkerAlt />
                      {profile.location}
                    </span>
                  )}
                  {profile.joinedAt && (
                    <span className="flex items-center gap-1 truncate">
                      <FaCalendarAlt />
                      {profile.joinedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "devto", section: "profile", size })} />
            <TerminalLineWithDots title="Name" value={profile.name} />
            <TerminalLineWithDots title="User" value={`@${profile.username}`} />
            {profile.location && <TerminalLineWithDots title="Location" value={profile.location} />}
            {profile.joinedAt && <TerminalLineWithDots title="Joined" value={profile.joinedAt} />}
          </>
        }
      />
    </section>
  )
}
