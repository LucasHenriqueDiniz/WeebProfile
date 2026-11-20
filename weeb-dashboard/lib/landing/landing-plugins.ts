import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/** Display order on the landing grid — profile plugins first, repository mode last. */
const PLUGIN_ORDER = [
  "github",
  "lastfm",
  "myanimelist",
  "anilist",
  "steam",
  "wow_forever",
  "codeforces",
  "codewars",
  "stackoverflow",
  "wakatime",
  "devto",
  "duolingo",
  "lyfta",
  "16personalities",
  "websites",
  "about",
  "github_repo",
]

// Every registered plugin is shown, in PLUGIN_ORDER where it is listed. The list used
// to be the only source, and AniList and Dev.to were left out of it for months while
// the hero counted 14 plugins and the grid showed 12. A plugin missing from the list
// now still appears, after the listed ones and before the repository card.
export const LANDING_PLUGINS = [
  ...PLUGIN_ORDER.filter((id) => id !== "github_repo"),
  ...Object.keys(PLUGINS_METADATA)
    .filter((id) => !PLUGIN_ORDER.includes(id))
    .sort(),
  "github_repo",
]

/**
 * Plugins that are not a platform of their own, so the "pulls data from" strip leaves
 * them out: the repository card reads GitHub, and Websites and About show what the
 * user types in.
 */
export const NOT_A_PLATFORM = new Set(["github_repo", "websites", "about"])

// The strip was a hand-typed list of 10 chips that stopped being updated: Stack
// Overflow and 16Personalities never made it, under a hero that counts 14 plugins.
// It now follows the registered plugins.
export const PLATFORM_STRIP_PLUGINS = LANDING_PLUGINS.filter((id) => !NOT_A_PLATFORM.has(id))
