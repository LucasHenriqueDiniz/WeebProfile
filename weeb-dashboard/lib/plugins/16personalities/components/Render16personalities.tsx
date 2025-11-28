/**
 * Main rendering component for the 16personalities plugin
 */

import React from 'react'
import { FaExternalLinkAlt, FaBrain } from 'react-icons/fa'
import type { Personality16Config, Personality16Data } from '../types'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { TerminalLineWithDots } from '../../../weeb-plugins/templates/Terminal/TerminalLineWithDots'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'

interface RenderPersonality16Props {
  config: Personality16Config
  data: Personality16Data
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

const DefaultPersonality = ({ data, config }: { data: Personality16Data; config: Personality16Config }) => {
  const showDescription = config.personality_show_description !== false
  const showLink = config.personality_show_link !== false

  return (
    <div className="flex flex-col gap-4">
      {/* Tipo e Nome */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-default-muted/20">
          <FaBrain className="w-8 h-8 text-default-text" />
        </div>
        <div>
          <div className="text-2xl font-bold text-default-text">
            {data.type} - {data.name}
          </div>
          <div className="text-sm text-default-muted">
            {data.traits.E} • {data.traits.N} • {data.traits.F} • {data.traits.J}
          </div>
        </div>
      </div>

      {/* Description */}
      {showDescription && (
        <p className="text-default-text text-sm leading-relaxed">{data.description}</p>
      )}

      {/* Link */}
      {showLink && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-default-link hover:text-default-link-hover transition-colors"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
          <span>Learn more on 16Personalities</span>
        </a>
      )}
    </div>
  )
}

/**
 * Renderiza o plugin 16personalities
 */
export function RenderPersonality16({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderPersonality16Props): React.ReactElement {
  // If not enabled or no data, return empty
  if (!config.enabled || !data) {
    return <div></div>
  }

  const title = config.personality_title || 'Personality'
  const hideTitle = config.personality_hide_title || false
  const showDescription = config.personality_show_description !== false
  const showLink = config.personality_show_link !== false

  return (
    <section id="personality-16">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaBrain />} />}
            <DefaultPersonality data={data} config={config} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: '16personalities',
                section: 'personality',
                type: data.type,
                size,
              })}
            />
            <TerminalLineWithDots
              title={`${data.emoji} ${data.type} - ${data.name}`}
              value={`${data.traits.E} • ${data.traits.N} • ${data.traits.F} • ${data.traits.J}`}
            />
            {showDescription && (
              <TerminalLineWithDots
                title="📝 Description"
                value={data.description}
              />
            )}
            {showLink && (
              <TerminalLineWithDots
                title="🔗 Link"
                value={data.url}
              />
            )}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
