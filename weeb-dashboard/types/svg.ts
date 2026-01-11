export type SvgStyle = "default" | "terminal"

export type SvgSize = "half" | "full"

export type SvgTheme = "default" | "dark" | "purple" | "pink" | "blue" | "green" | "dracula"

export interface SvgUser {
  id: string
  name: string
  avatar?: string
}

export interface SvgTemplate {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: SvgStyle
  theme: SvgTheme
  size: SvgSize
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customCss?: string
  customThemeColors?: Record<string, string>
  likes?: number
  liked?: boolean
  pluginsConfig?: Record<string, any>
  pluginsOrder?: string | string[]
  user?: SvgUser
  createdAt?: string
  updatedAt?: string
}
