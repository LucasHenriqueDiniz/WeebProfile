/**
 * TerminalHeader - Header do terminal com dots
 */

import React from "react"

/**
 * Height of the header in px, measured in Chromium. It is drawn once per SVG, above every
 * plugin, so it is added to the SVG's height once (svg-generator's generateSvg), never
 * by a plugin's calculateHeight.
 */
export const TERMINAL_HEADER_HEIGHT = 32

interface TerminalHeaderProps {
  title?: string
  className?: string
}

export function TerminalHeader({ title = "weeb@profile:~", className = "" }: TerminalHeaderProps): React.ReactElement {
  return (
    <div className={`terminal-header ${className}`}>
      <div className="terminal-header-dots">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
      </div>
      <div className="terminal-header-title text-overflow">{title}</div>
    </div>
  )
}
