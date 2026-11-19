/**
 * TerminalLine - Linha de texto para estilo terminal
 */

import React from "react"
import { ExternalLink } from "../../utils/external-link"
import type { TerminalLineProps } from "../types"

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
  /** Makes the whole line a link; an href that is not http(s) leaves it plain. */
  href?: string
}

export function TerminalLine({ right, className, left, style, href }: TerminalLineComponentProps): React.ReactElement {
  return (
    <ExternalLink
      href={href}
      className={`grid grid-cols-[auto_min-content] overflow-hidden px-1 ${className?.container || ""}`}
      // A fixed line: `sm-text` sets only the font size, and the inherited line-height made
      // the line 16px in Chrome and WebKit and 17 in Firefox, so a list of ten ran 10px past
      // the card's calculated height there (measured 18/11/2026).
      style={{ lineHeight: "16px", ...(style?.container ? style.container : {}) }}
    >
      <span
        className={`text-bold text-overflow truncate sm-text ${className?.right || ""}`}
        style={{ ...(style?.right ? style.right : {}) }}
      >
        {right}
      </span>
      <span className={`text-terminal-muted truncate sm-text ${className?.left || ""}`} style={style?.left}>
        {left}
      </span>
    </ExternalLink>
  )
}
