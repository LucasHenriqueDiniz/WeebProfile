/**
 * Container SVG como div (para Puppeteer medir altura)
 */

import * as React from 'react'
import { PluginStyles } from '@weeb/weeb-plugins/templates'

interface SvgContainerDivProps {
  size: 'half' | 'full'
  style: 'default' | 'terminal'
  cssDefs: React.ReactElement
  children: React.ReactElement
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
}

/**
 * Cria o container como div (para Puppeteer medir altura)
 */
export function createSvgContainerDiv(props: SvgContainerDivProps): React.ReactElement {
  const {
    size,
    style,
    cssDefs,
    children,
    terminalTheme,
    defaultTheme,
    hideTerminalHeader,
  } = props

  const svgWidth = size === 'half' ? 415 : 830
  const containerClass = `${size} ${style} flex flex-col relative`

  return (
    <div
      className={containerClass}
      style={{ width: `${svgWidth}px` }}
      id="svg-main"
      data-terminal-theme={terminalTheme}
      data-default-theme={defaultTheme}
    >
      {cssDefs}
      <PluginStyles
        style={style}
        terminalTheme={terminalTheme}
        defaultTheme={defaultTheme}
        hideTerminalHeader={hideTerminalHeader}
      >
        {children}
      </PluginStyles>
    </div>
  )
}

