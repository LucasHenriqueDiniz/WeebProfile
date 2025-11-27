/**
 * Renderizador de Templates
 * 
 * Cria o container SVG principal com foreignObject
 */

import React from 'react'
import { PluginStyles } from '@weeb/weeb-plugins/templates'
import type { SvgConfig } from '../types/index.js'

interface SvgContainerProps {
  width: number
  height: number
  size: 'half' | 'full'
  style: 'default' | 'terminal'
  cssDefs: React.ReactElement
  children: React.ReactNode
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
}

/**
 * Cria o container SVG principal
 * 
 * Usa foreignObject para permitir HTML/CSS dentro do SVG
 */
export function createSvgContainer(props: SvgContainerProps): React.ReactElement {
  const {
    width,
    height,
    size,
    style,
    cssDefs,
    children,
    terminalTheme,
    defaultTheme,
    hideTerminalHeader,
  } = props

  const containerClass = `${size} ${style} flex flex-col relative`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="svg-main"
      width={width}
      height={height}
      className={containerClass}
      data-terminal-theme={terminalTheme}
      data-default-theme={defaultTheme}
    >
      {cssDefs}
      <foreignObject width="100%" height="100%">
        <div
          // @ts-expect-error -- xmlns attributes required for SVG foreignObject
          xmlns="http://www.w3.org/1999/xhtml"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <PluginStyles
            style={style}
            terminalTheme={terminalTheme}
            defaultTheme={defaultTheme}
            hideTerminalHeader={hideTerminalHeader}
          >
            {children}
          </PluginStyles>
        </div>
      </foreignObject>
    </svg>
  )
}

