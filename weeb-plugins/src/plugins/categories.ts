/**
 * Plugin categories, in the order the dashboard lists them. Each plugin.metadata.ts
 * picks one and generate-metadata rejects anything else.
 *
 * The list used to stop at coding, music, anime and gaming, so Duolingo, 16Personalities
 * and Websites were filed under coding and Lyfta under gaming, and the landing showed
 * them that way. The landing already had labels for profile, fitness and languages.
 */
export const PLUGIN_CATEGORIES = [
  "coding",
  "music",
  "anime",
  "gaming",
  "profile",
  "fitness",
  "languages",
  "repository",
] as const

export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number]

export function isPluginCategory(value: string): value is PluginCategory {
  return (PLUGIN_CATEGORIES as readonly string[]).includes(value)
}
