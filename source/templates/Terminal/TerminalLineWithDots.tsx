import React from "react"

const TerminalLineWithDots = ({ title, value }: { title: string; value: string }): JSX.Element => (
  <div className="flex items-end justify-between w-full text-nowrap">
    <span className="font-semibold text-terminal-warning shrink-0">{title}</span>
    <span className="text-terminal-muted-light overflow-hidden text-clip leading-3">
      ·································································
    </span>
    <span className="font-semibold text-terminal-muted text-nowrap">{value}</span>
  </div>
)

export default TerminalLineWithDots
