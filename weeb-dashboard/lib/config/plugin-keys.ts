import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ESSENTIAL_CONFIG_ALIASES } from "../../functions/api/_shared/essential-config-aliases"

export interface StoredKey {
  plugin: string
  key: string
  updatedAt: string
}

export interface PluginKeyRow {
  /** Plugin namespace the key is stored under, as the DELETE route takes it. */
  plugin: string
  key: string
  /** The metadata's label (or its i18n key), or the bare key for a row no plugin declares. */
  label: string
  labelI18nKey?: string
  updatedAt?: string
  /** Saved cards that read this key: the plugin's own and those of plugins aliased to it. */
  usedBy: number
  /** Plugins that fall back to this key when they have none of their own (github_repo -> github). */
  sharedWith: string[]
}

interface SvgLike {
  pluginsConfig?: Record<string, { enabled?: boolean; sections?: string[] } | undefined> | null
}

type KeyMeta = { key: string; label?: string; i18nKey?: { label?: string } }

const metadataOf = (plugin: string) =>
  (PLUGINS_METADATA as Record<string, { essentialConfigKeysMetadata?: KeyMeta[] }>)[plugin]

const usesPlugin = (svg: SvgLike, plugin: string) => {
  const config = svg.pluginsConfig?.[plugin]
  return !!config && config.enabled !== false && (config.sections?.length ?? 0) > 0
}

/**
 * One row per key a plugin asks for, stored or not, plus any stored key no plugin
 * declares (a github_repo token of its own, a plugin since removed), so every row in
 * plugin_secrets shows up and can be removed.
 *
 * A plugin whose keys fall back to another's (github_repo uses github's token) gets no
 * rows of its own: its cards count toward the key it reads.
 */
export function pluginKeyRows(stored: StoredKey[], svgs: SvgLike[]): PluginKeyRow[] {
  const storedAt = new Map(stored.map((row) => [`${row.plugin.toLowerCase()}/${row.key.toLowerCase()}`, row.updatedAt]))
  const aliasesOf = (plugin: string) =>
    Object.entries(ESSENTIAL_CONFIG_ALIASES)
      .filter(([, target]) => target === plugin)
      .map(([alias]) => alias)
  const usedBy = (plugin: string, readers: string[]) =>
    svgs.filter((svg) => [plugin, ...readers].some((p) => usesPlugin(svg, p))).length

  const rows: PluginKeyRow[] = []
  const covered = new Set<string>()

  for (const plugin of Object.keys(PLUGINS_METADATA)) {
    if (ESSENTIAL_CONFIG_ALIASES[plugin]) continue
    const keys = metadataOf(plugin)?.essentialConfigKeysMetadata ?? []
    const sharedWith = aliasesOf(plugin)
    for (const meta of keys) {
      const id = `${plugin}/${meta.key.toLowerCase()}`
      covered.add(id)
      rows.push({
        plugin,
        key: meta.key,
        label: meta.label ?? meta.key,
        labelI18nKey: meta.i18nKey?.label,
        updatedAt: storedAt.get(id),
        usedBy: usedBy(plugin, sharedWith),
        sharedWith,
      })
    }
  }

  for (const row of stored) {
    const plugin = row.plugin.toLowerCase()
    const id = `${plugin}/${row.key.toLowerCase()}`
    if (covered.has(id)) continue
    const meta = metadataOf(plugin)?.essentialConfigKeysMetadata?.find(
      (m) => m.key.toLowerCase() === row.key.toLowerCase()
    )
    rows.push({
      plugin,
      key: row.key,
      label: meta?.label ?? row.key,
      labelI18nKey: meta?.i18nKey?.label,
      updatedAt: row.updatedAt,
      usedBy: usedBy(plugin, []),
      sharedWith: [],
    })
  }

  return rows
}
