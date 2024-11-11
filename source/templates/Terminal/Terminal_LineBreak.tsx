import React from "react"

const TerminalLineBreak = ({ className }: { className?: string }): JSX.Element => (
  <div className={`text-terminal-muted text-clip overflow-hidden ${className}`}>
    ============================================================================================================================================================
  </div>
)

export default TerminalLineBreak
