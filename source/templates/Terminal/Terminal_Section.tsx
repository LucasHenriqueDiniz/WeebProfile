import React from "react"

interface TerminalSectionProps {
  title?: string
  icon?: string
  children: React.ReactNode
}

const Terminal_Section = ({ title, icon, children }: TerminalSectionProps) => {
  return (
    <div className="mb-4 last:mb-0">
      {title && (
        <div className="terminal-header">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

export default Terminal_Section
