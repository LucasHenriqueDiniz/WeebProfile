import React from "react"
import { TerminalLineProps } from "../types"

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

export interface Props extends TerminalLineProps {
  className?: ClassNames
  style?: Styles
}

function TerminalLine({ right, className, left, style }: Props): JSX.Element {
  return (
    <div
      className={`grid grid-cols-[auto_min-content] overflow-hidden px-1 ${className?.container}`}
      style={{ ...(style?.container ? style.container : {}) }}
    >
      <span
        className={`text-bold text-overflow truncate sm-text ${className?.right}`}
        style={{ ...(style?.right ? style.right : {}) }}
      >
        {right}
      </span>
      <span className={`text-terminal-muted truncate sm-text ${className?.left}`} style={style?.left}>
        {left}
      </span>
    </div>
  )
}

export default TerminalLine
