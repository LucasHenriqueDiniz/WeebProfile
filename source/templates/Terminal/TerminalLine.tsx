import React from "react"
import { TerminalLineProps } from "../types"

interface ClassNames {
  right?: string
  left?: string
  container?: string
}

export interface Props extends TerminalLineProps {
  className?: ClassNames
}

function TerminalLine({ right, className, left }: Props): JSX.Element {
  return (
    <div className={`grid grid-cols-[1fr_min-content] text-wrap px-1 ${className?.container}`}>
      <span className={`text-bold text-overflow sm-text ${className?.right}`}>{right}</span>
      <span className={`text-terminal-muted ml-auto sm-text ${className?.left}`}>{left}</span>
    </div>
  )
}

export default TerminalLine
