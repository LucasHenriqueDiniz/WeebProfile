import React from "react"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"

const TerminalCommand = ({ command, className }: { command: string; className?: string }): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalf = env.size === "half"

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
