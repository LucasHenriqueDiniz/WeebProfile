import React from 'react'
import { MdOutlineAccountCircle } from 'react-icons/md'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import { abbreviateNumber } from '../../../utils/number.js'
import type { SpotifyProfile } from '../types.js'

interface ProfileProps {
  data: SpotifyProfile | null | undefined
  config: {
    profile_title?: string
    profile_hide_title?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Profile({ data, config, style = 'default', size = 'half' }: ProfileProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  const title = config.profile_title || 'Profile'
  const hideTitle = config.profile_hide_title || false

  return (
    <section id="spotify-profile">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                icon={<MdOutlineAccountCircle />}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
              {data.image && (
                <img
                  src={data.image}
                  alt={data.displayName}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '4px' }}>{data.displayName}</div>
                {data.followers !== undefined && (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {abbreviateNumber(data.followers.toString())} followers
                  </div>
                )}
              </div>
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'spotify',
                section: 'profile',
                size,
              })}
            />
            <div style={{ fontFamily: 'monospace', padding: '8px 0' }}>
              <div style={{ fontWeight: 600 }}>{data.displayName}</div>
              {data.followers !== undefined && (
                <div style={{ color: 'var(--text-secondary)' }}>
                  {abbreviateNumber(data.followers.toString())} followers
                </div>
              )}
            </div>
          </>
        }
      />
    </section>
  )
}

