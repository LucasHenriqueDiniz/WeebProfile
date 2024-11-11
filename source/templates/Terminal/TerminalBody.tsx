import React from "react"

const TerminalBody = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <div className="font-mono terminal-body">{children}</div>
}

export default TerminalBody
