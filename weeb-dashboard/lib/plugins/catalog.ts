import type {
  PluginCategory,
  PluginMetadata,
  PluginSection,
  SectionConfigOption,
} from "@weeb/weeb-plugins/plugins/metadata"
import { pluginSearchTexts } from "./plugin-search"

/** tWithFallback: an i18n key without "plugins." and the English text to fall back on. */
export type Translate = (key: string, fallback: string) => string

/** The text behind an i18nKey ("plugins.steam.sections..."), or the English one when there is none. */
function translated(translate: Translate, i18nKey: string | undefined, fallback: string): string {
  return i18nKey ? translate(i18nKey.replace(/^plugins\./, ""), fallback) : fallback
}

/**
 * What an option lets the user change, in the terms the catalog shows it: a switch, a
 * count, a choice between named values, a text, a list to fill in, or an image.
 */
export type OptionView =
  | { kind: "toggle"; key: string; label: string; description?: string; defaultOn: boolean }
  | {
      kind: "number"
      key: string
      label: string
      description?: string
      min?: number
      max?: number
      defaultValue?: number
    }
  | {
      kind: "choice"
      key: string
      label: string
      description?: string
      choices: { value: string; label: string }[]
      defaultValue?: string
    }
  | { kind: "text"; key: string; label: string; description?: string; defaultValue?: string }
  | { kind: "list"; key: string; label: string; description?: string; maxItems?: number }
  | { kind: "image"; key: string; label: string; description?: string }

export interface SectionView {
  id: string
  name: string
  description?: string
  /** Whether the section's title can be renamed and whether it can be hidden. */
  title: { rename: boolean; hide: boolean }
  /** Everything else the section lets the user change. */
  options: OptionView[]
}

/**
 * Every section of every card has the same pair, `<section>_title` and
 * `<section>_hide_title`: 129 of the 249 options. Listed one by one they would bury
 * what makes each section different, so the catalog folds them into one line.
 */
export function titleOptionOf(sectionId: string, key: string): "rename" | "hide" | null {
  if (key === `${sectionId}_title`) return "rename"
  if (key === `${sectionId}_hide_title`) return "hide"
  return null
}

export function describeOption(option: SectionConfigOption, translate: Translate): OptionView {
  const i18n = option.i18nKey ?? {}
  const base = {
    key: option.key,
    label: translated(translate, i18n.label, option.label),
    description: option.description ? translated(translate, i18n.description, option.description) : undefined,
  }
  switch (option.type) {
    case "boolean":
      return { ...base, kind: "toggle", defaultOn: option.defaultValue === true }
    case "number":
      return {
        ...base,
        kind: "number",
        min: option.min,
        max: option.max,
        defaultValue: typeof option.defaultValue === "number" ? option.defaultValue : undefined,
      }
    case "select":
      return {
        ...base,
        kind: "choice",
        choices: (option.options ?? []).map((choice) => ({
          value: choice.value,
          label: translated(translate, i18n.options?.[choice.value], choice.label),
        })),
        defaultValue: option.defaultValue === undefined ? undefined : String(option.defaultValue),
      }
    case "array":
    case "object-array":
      return { ...base, kind: "list", maxItems: option.maxItems }
    case "image":
      return { ...base, kind: "image" }
    default: {
      const text = typeof option.defaultValue === "string" ? option.defaultValue : ""
      return { ...base, kind: "text", defaultValue: text ? translated(translate, i18n.defaultValue, text) : undefined }
    }
  }
}

export function describeSection(section: PluginSection, translate: Translate): SectionView {
  const title = { rename: false, hide: false }
  const options: OptionView[] = []
  for (const option of section.configOptions ?? []) {
    const titleOption = titleOptionOf(section.id, option.key)
    if (titleOption) title[titleOption] = true
    else options.push(describeOption(option, translate))
  }
  return {
    id: section.id,
    name: translated(translate, section.i18nKey?.name, section.name),
    description: section.description
      ? translated(translate, section.i18nKey?.description, section.description)
      : undefined,
    title,
    options,
  }
}

/**
 * What a search over the catalog looks at: what the wizard's search looks at (id, name
 * and description, in English and in the viewer's language), plus the category and the
 * section names, so "anime" finds the anime plugins and "recent games" finds Steam.
 */
export function catalogSearchTexts(plugin: PluginMetadata, translate: Translate, categoryLabel: string): string[] {
  return [
    ...pluginSearchTexts(plugin.name, plugin, translate),
    plugin.category,
    categoryLabel,
    ...plugin.sections.flatMap((section) => [section.name, translated(translate, section.i18nKey?.name, section.name)]),
  ]
}

/**
 * The plugins under their categories, in the order of `categories`, each keeping the
 * order it had in `plugins`. Categories with no plugin are left out.
 */
export function groupByCategory<T extends { category: PluginCategory }>(
  plugins: readonly T[],
  categories: readonly PluginCategory[]
): { category: PluginCategory; plugins: T[] }[] {
  return categories
    .map((category) => ({ category, plugins: plugins.filter((plugin) => plugin.category === category) }))
    .filter((group) => group.plugins.length > 0)
}
