import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { PluginMetadata, SectionConfigOption } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * What a template shares with whoever uses it: which plugins and sections are on, and
 * the choices made in each section's options. Not who made it.
 *
 * A template's pluginsConfig is its author's own saved config, so it carries the
 * author's username and the other requiredFields (repository owner, Stack Overflow id,
 * 16personalities URL), plus whatever they typed into free-text options: section
 * titles, an introduction, their list of websites, featured repositories. Options with
 * a closed set of values (boolean, number, select) are layout; anything else is
 * content and stays with the author.
 *
 * The API applies this before a template leaves for anyone but its owner, and the
 * wizard applies it again on load, so "Use template" always starts from the layout
 * with the identity fields empty, the same as a fresh wizard, whoever made it.
 */

export interface TemplatePluginLayout {
  enabled: boolean
  sections: string[]
  sectionConfigs: Record<string, Record<string, unknown>>
}

export type TemplateLayout = Record<string, TemplatePluginLayout>

/** uiConfig keys a template may carry. terminalHeaderText is free text, so it is not one. */
export interface TemplateUiLayout {
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  hideTerminalCommand?: boolean
  animations?: boolean
  fontFamily?: string
  customThemeColors?: Record<string, string>
}

const METADATA = PLUGINS_METADATA as Record<string, PluginMetadata>

/**
 * Closed-choice options a template still must not carry, because they decide which of
 * the user's own private data goes on a public card. Someone else's template turning
 * one on would publish what the user never chose to show.
 */
const PRIVACY_OPTIONS = new Set(["repositories_use_private"])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** D1 json columns come back parsed, but older rows and some callers hand over the raw string. */
function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value)
      return isRecord(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }
  return isRecord(value) ? value : {}
}

function isLayoutValue(option: SectionConfigOption, value: unknown): boolean {
  switch (option.type) {
    case "boolean":
      return typeof value === "boolean"
    case "number":
      return typeof value === "number" && Number.isFinite(value)
    case "select":
      return typeof value === "string" && (option.options ?? []).some((choice) => choice.value === value)
    default:
      return false
  }
}

function sectionLayout(
  metadata: PluginMetadata,
  sectionId: string,
  saved: unknown
): Record<string, unknown> | undefined {
  if (!isRecord(saved)) return undefined
  const section = metadata.sections.find((s) => s.id === sectionId)
  const options = [...(section?.configOptions ?? []), ...(metadata.globalConfigOptions ?? [])]

  const kept: Record<string, unknown> = {}
  for (const option of options) {
    if (PRIVACY_OPTIONS.has(option.key)) continue
    if (option.key in saved && isLayoutValue(option, saved[option.key])) {
      kept[option.key] = saved[option.key]
    }
  }
  return Object.keys(kept).length > 0 ? kept : undefined
}

/** The plugin layout a template may share. Unknown plugins and sections are dropped. */
export function templateLayout(pluginsConfig: unknown): TemplateLayout {
  const layout: TemplateLayout = {}

  for (const [pluginName, config] of Object.entries(asRecord(pluginsConfig))) {
    const metadata = METADATA[pluginName]
    if (!metadata || !isRecord(config)) continue

    const knownSections = new Set(metadata.sections.map((s) => s.id))
    const sections = Array.isArray(config.sections)
      ? config.sections.filter((s): s is string => typeof s === "string" && knownSections.has(s))
      : []

    const savedSectionConfigs = isRecord(config.sectionConfigs) ? config.sectionConfigs : {}
    const sectionConfigs: Record<string, Record<string, unknown>> = {}
    for (const sectionId of sections) {
      const kept = sectionLayout(metadata, sectionId, savedSectionConfigs[sectionId])
      if (kept) sectionConfigs[sectionId] = kept
    }

    layout[pluginName] = { enabled: config.enabled !== false, sections, sectionConfigs }
  }

  return layout
}

/** The presentation flags a template may share. */
export function templateUiLayout(uiConfig: unknown): TemplateUiLayout {
  const saved = asRecord(uiConfig)
  const ui: TemplateUiLayout = {}

  for (const key of ["hideTerminalEmojis", "hideTerminalHeader", "hideTerminalCommand", "animations"] as const) {
    if (typeof saved[key] === "boolean") ui[key] = saved[key]
  }
  if (typeof saved.fontFamily === "string") ui.fontFamily = saved.fontFamily
  if (isRecord(saved.customThemeColors)) {
    const colors = Object.entries(saved.customThemeColors).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    )
    if (colors.length > 0) ui.customThemeColors = Object.fromEntries(colors)
  }

  return ui
}

interface TemplateRow {
  userId: string
  svgId?: string | null
  pluginsConfig?: unknown
  uiConfig?: unknown
}

/**
 * A template row as the given viewer may see it. Its owner gets it whole; anyone else
 * gets the layout, without the author's Clerk id, the id of the SVG it was made from,
 * or anything typed into it.
 */
export function templateForViewer<T extends TemplateRow>(
  template: T,
  viewerId: string | null
): T | Omit<T, "userId" | "svgId"> {
  if (viewerId !== null && template.userId === viewerId) return template

  const { userId: _author, svgId: _sourceSvg, ...shared } = template
  return {
    ...shared,
    pluginsConfig: templateLayout(template.pluginsConfig),
    uiConfig: templateUiLayout(template.uiConfig),
  }
}
