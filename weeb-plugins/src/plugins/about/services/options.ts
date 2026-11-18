import type { AboutConfig } from "../types"

/**
 * An option of the About plugin, wherever the config carries it.
 *
 * The generator and the card preview hand the plugin its options at the root (and the
 * PluginManager copies them to `nonEssential`). The wizard's live preview calls
 * fetchData with the store's config as it is, where each section keeps its options
 * under `sectionConfigs[sectionId]`. Reading all three makes the preview draw what the
 * user is typing, not the mock.
 */
export function readOption(config: AboutConfig, key: string): unknown {
  const root = config as Record<string, unknown>
  if (root[key] !== undefined) return root[key]
  const nonEssential = config.nonEssential as Record<string, unknown> | undefined
  if (nonEssential?.[key] !== undefined) return nonEssential[key]
  const sectionConfigs = root.sectionConfigs
  if (sectionConfigs && typeof sectionConfigs === "object") {
    for (const section of Object.values(sectionConfigs as Record<string, unknown>)) {
      if (section && typeof section === "object" && (section as Record<string, unknown>)[key] !== undefined) {
        return (section as Record<string, unknown>)[key]
      }
    }
  }
  return undefined
}

/** A boolean option: anything but an explicit false is the default true. */
export function readFlag(config: AboutConfig, key: string): boolean {
  return readOption(config, key) !== false
}
