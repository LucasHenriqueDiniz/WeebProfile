import { FaGithub, FaSteam, FaLastfmSquare, FaCode, FaSpotify, FaBookOpen } from "react-icons/fa"
import { TbNumber16Small } from "react-icons/tb"
import { SiMyanimelist, SiStackoverflow } from "react-icons/si"
import { GiWeightLiftingUp } from "react-icons/gi"
import type { ComponentType } from "react"

/**
 * Icon mapping for plugins using react-icons
 * Maps plugin ID to the appropriate icon component
 *
 * IMPORTANT: This mapping must match the plugin IDs exactly from metadata
 */
const PLUGIN_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  lastfm: FaLastfmSquare,
  myanimelist: SiMyanimelist,
  "16personalities": TbNumber16Small,
  lyfta: GiWeightLiftingUp,
  steam: FaSteam,
  codewars: FaCode,
  codeforces: FaCode,
  stackoverflow: SiStackoverflow,
  duolingo: FaBookOpen,
  spotify: FaSpotify,
}

/**
 * Returns the appropriate icon component for a plugin
 * @param pluginId - The plugin identifier (must match plugin name in metadata)
 * @returns The icon component or null if not found
 */
export function getPluginIcon(pluginId: string): ComponentType<{ className?: string }> | null {
  return PLUGIN_ICON_MAP[pluginId] || null
}
