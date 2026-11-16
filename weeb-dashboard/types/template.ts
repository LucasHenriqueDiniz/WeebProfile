export type TemplateStyle = "default" | "terminal"

export type TemplateSize = "half" | "full"

// A key of defaultThemes or terminalThemes in weeb-plugins, which are Record<string, …>.
// The union typed here had drifted: no cyan, orange, red or monokai, and Gamer Stats
// in production is cyan.
export type TemplateTheme = string

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
  fontFamily?: string
  terminalHeaderText?: string
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
