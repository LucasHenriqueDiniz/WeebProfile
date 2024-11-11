import React from "react"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"

const TerminalCommand = ({ command, className }: { command: string; className?: string }): JSX.Element => {
  const { size } = getEnvVariables()
  const isHalf = size === "half"
  return (
    <div className={`truncate font-mono text-sm ${className} my-1`}>
      {!isHalf ? (
        <>
          <span className="font-semibold text-terminal-success">root</span>
          <span className="text-terminal-muted">@</span>
          <span className="font-semibold text-terminal-success">weeb-profile</span>
          <span className="text-terminal-muted">:</span>
          <span className="text-terminal-highlight">~</span>
        </>
      ) : (
        <span className="text-terminal-highlight">$ </span>
      )}
      <span className="text-terminal-raw ml-1">{command}</span>
    </div>
  )
}

export default TerminalCommand
