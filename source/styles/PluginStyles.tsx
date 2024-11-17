import React from "react"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import { getDefaultThemeVariables, getTerminalThemeVariables } from "../plugins/@themes/theme-utils"
import TerminalHeader from "../templates/Terminal/TerminalHeader"
import { DefaultTheme } from "source/plugins/@themes/default-themes"
import { TerminalTheme } from "source/plugins/@themes/terminal-themes"

const TerminalStyles = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()

  const terminalTheme = env.terminal_theme ?? "default"
  const hideTerminalHeader = env.hide_terminal_header

  const baseStyles = {
    fontFamily: "ui-monospace, monospace",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    ...getTerminalThemeVariables(terminalTheme as TerminalTheme),
  }

  const themeStyles = {
    ...baseStyles,
    ...getTerminalThemeVariables(terminalTheme as TerminalTheme),
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
  const defaultTheme = env.default_theme ?? "default"

  const baseStyles = {
    fontFamily: "'Poppins', sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    ...getDefaultThemeVariables(defaultTheme as DefaultTheme),
  }

  const themeStyles = {
    ...baseStyles,
    ...getDefaultThemeVariables(defaultTheme as DefaultTheme),
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
