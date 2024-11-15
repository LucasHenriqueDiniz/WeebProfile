import React from "react"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import { getDefaultThemeVariables, getTerminalThemeVariables } from "../plugins/@themes/theme-utils"
import TerminalHeader from "../templates/Terminal/TerminalHeader"

const TerminalStyles = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const terminalTheme = env.terminalTheme
  const hideTerminalHeader = env.hideTerminalHeader

  const baseStyles = {
    fontFamily: "ui-monospace, monospace",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  }

  const themeStyles = {
    ...baseStyles,
    ...getTerminalThemeVariables(terminalTheme ?? "default"),
  }

  return (
    <div className="terminal-container" style={themeStyles as React.CSSProperties}>
      {!hideTerminalHeader && <TerminalHeader />}
      {children}
    </div>
  )
}

const DefaultStyles = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const defaultTheme = env.defaultTheme

  const baseStyles = {
    fontFamily: "'Poppins', sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  }

  const themeStyles = {
    ...baseStyles,
    ...getDefaultThemeVariables(defaultTheme ?? "default"),
  }

  return (
    <div className="default-container" style={themeStyles as React.CSSProperties}>
      {children}
    </div>
  )
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
