/**
 * TerminalLine - Linha de texto para estilo terminal
 */

import React from 'react'
import type { TerminalLineProps } from '../types'

interface ClassNames {
  right?: string
  left?: string
  container?: string
}

interface Styles {
  right?: React.CSSProperties
  left?: React.CSSProperties
  container?: React.CSSProperties
}

export interface TerminalLineComponentProps extends TerminalLineProps {
  className?: ClassNames
  style?: Styles
}

export function TerminalLine({ right, className, left, style }: TerminalLineComponentProps): React.ReactElement {
  return (
    <div
      className={`grid grid-cols-[auto_min-content] overflow-hidden px-1 ${className?.container || ''}`}
      style={{ ...(style?.container ? style.container : {}) }}
    >
      <span
        className={`text-bold text-overflow truncate sm-text ${className?.right || ''}`}
        style={{ ...(style?.right ? style.right : {}) }}
      >
        {right}
      </span>
      <span className={`text-terminal-muted truncate sm-text ${className?.left || ''}`} style={style?.left}>
        {left}
      </span>
    </div>
  )
}
