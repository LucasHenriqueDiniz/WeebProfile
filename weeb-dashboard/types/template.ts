export type TemplateStyle = "default" | "terminal"

export type TemplateSize = "half" | "full"

export type TemplateTheme = "default" | "dark" | "purple" | "pink" | "blue" | "green" | "dracula"

export interface TemplateUser {
  id: string
  name: string
  avatar?: string
}

export interface Template {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: TemplateStyle
  theme: TemplateTheme
  size: TemplateSize
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customCss?: string
  customThemeColors?: Record<string, string>
  likes?: number
  liked?: boolean
  pluginsConfig?: Record<string, any>
  pluginsOrder?: string | string[]
  user?: TemplateUser
  createdAt?: string
  updatedAt?: string
}
