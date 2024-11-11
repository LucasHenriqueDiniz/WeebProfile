import React from "react"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import { getThemeVariables } from "../plugins/@themes/theme-utils"
import TerminalHeader from "../templates/Terminal/TerminalHeader"

const TerminalStyles = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { terminalTheme, hideTerminalHeader } = getEnvVariables()
  const themeStyles = getThemeVariables(terminalTheme ?? "default")

  return (
    <div className="font-mono" style={themeStyles as React.CSSProperties}>
      {!hideTerminalHeader && <TerminalHeader />}
      {children}
    </div>
  )
}

const DefaultStyles = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <div className="font-poppins">{children}</div>
}

const PluginStyles = ({ children, style }: { children: React.ReactNode; style: string }): JSX.Element => {
  switch (style) {
    case "terminal":
      return <TerminalStyles>{children}</TerminalStyles>
    default:
      return <DefaultStyles>{children}</DefaultStyles>
  }
}

export default PluginStyles
