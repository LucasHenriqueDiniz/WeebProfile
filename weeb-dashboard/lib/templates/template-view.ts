import { defaultThemes, terminalThemes } from "@weeb/weeb-plugins/themes"
import type { Template } from "@/types/template"

type TemplateSource = Pick<Template, "pluginsConfig" | "pluginsOrder" | "platforms">

export interface TemplatePlugin {
  id: string
  sections: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function orderOf(pluginsOrder: Template["pluginsOrder"]): string[] {
  const list = Array.isArray(pluginsOrder) ? pluginsOrder : (pluginsOrder ?? "").split(",")
  return list.map((id) => id.trim()).filter(Boolean)
}

/**
 * The plugins a template turns on, in its order, each with its sections. Plugins in the
 * config but missing from the order go last; a template without a config (older rows)
 * falls back to its platforms, with no sections known.
 */
export function templatePlugins(template: TemplateSource): TemplatePlugin[] {
  const config = isRecord(template.pluginsConfig) ? template.pluginsConfig : {}
  const configured = Object.keys(config)
  if (configured.length === 0) {
    return (template.platforms ?? []).filter(Boolean).map((id) => ({ id: id.toLowerCase(), sections: [] }))
  }

  const order = orderOf(template.pluginsOrder)
  const ids = [...order.filter((id) => id in config), ...configured.filter((id) => !order.includes(id))]
  return ids.flatMap((id) => {
    const plugin = config[id]
    if (!isRecord(plugin) || plugin.enabled === false) return []
    const sections = Array.isArray(plugin.sections) ? plugin.sections.filter((s) => typeof s === "string") : []
    return [{ id, sections }]
  })
}

/** What PreviewRenderer takes to draw a template: its own config, in its order. */
export function templatePreviewConfig(template: TemplateSource): {
  plugins: Record<string, { enabled: boolean; sections: string[] } & Record<string, unknown>>
  pluginsOrder: string[]
} {
  const config = isRecord(template.pluginsConfig) ? template.pluginsConfig : {}
  const list = templatePlugins(template)
  const plugins: Record<string, { enabled: boolean; sections: string[] } & Record<string, unknown>> = {}
  for (const { id, sections } of list) {
    const own = isRecord(config[id]) ? config[id] : {}
    plugins[id] = { ...own, enabled: true, sections }
  }
  return { plugins, pluginsOrder: list.map((plugin) => plugin.id) }
}

/**
 * The palette a template is drawn with. A theme the style does not have falls back to
 * its default, as the generator does: "Anime & Music" in production is terminal with
 * "pink", a default-style theme, and its card is the default terminal.
 */
export function effectiveTheme(style: string, theme: string | undefined): string {
  if (style === "terminal") return theme && theme in terminalThemes ? theme : "default"
  if (theme === "custom") return "custom"
  return theme && theme in defaultThemes ? theme : "default"
}

/** The theme's highlight colour, for a swatch next to its name. */
export function themeSwatch(style: string, theme: string, customColors?: Record<string, string>): string {
  if (style === "terminal") {
    return (terminalThemes[theme] ?? terminalThemes.default)!["--terminal-color-highlight"] as string
  }
  const base = (defaultThemes[theme] ?? defaultThemes.default)!["--default-color-highlight"] as string
  return (theme === "custom" && customColors?.["--default-color-highlight"]) || base
}
