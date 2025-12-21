import React from 'react'
import { MdOutlineMusicNote } from 'react-icons/md'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { CurrentlyPlaying as CurrentlyPlayingType } from '../types'

interface CurrentlyPlayingProps {
  data: CurrentlyPlayingType | null | undefined
  config: {
    currently_playing_title?: string
    currently_playing_hide_title?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function CurrentlyPlaying({ data, config, style = 'default', size = 'half' }: CurrentlyPlayingProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  const title = config.currently_playing_title || 'Now Playing'
  const hideTitle = config.currently_playing_hide_title || false

  return (
    <section id="spotify-currently-playing">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                icon={<MdOutlineMusicNote />}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
              {data.image && (
                <img
                  src={data.image}
                  alt={data.track}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{data.track}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{data.artist}</div>
                {data.album && (
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{data.album}</div>
                )}
                {data.isPlaying && (
                  <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px' }}>● Playing</div>
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
                section: 'currently_playing',
                size,
              })}
            />
            <div style={{ fontFamily: 'monospace', padding: '8px 0' }}>
              <div>{data.track}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{data.artist}</div>
              {data.album && (
                <div style={{ color: 'var(--text-tertiary)' }}>{data.album}</div>
              )}
              {data.isPlaying && (
                <div style={{ color: 'var(--accent)' }}>● Playing</div>
              )}
            </div>
          </>
        }
      />
    </section>
  )
}

