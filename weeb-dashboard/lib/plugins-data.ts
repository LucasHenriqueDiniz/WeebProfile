import { FaGithub, FaSteam, FaLastfmSquare } from "react-icons/fa"
import { TbNumber16Small } from "react-icons/tb"
import { SiMyanimelist } from "react-icons/si"
import { GiWeightLiftingUp } from "react-icons/gi"
import type { ComponentType } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

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
}

/**
 * Returns the appropriate icon component for a plugin
 * @param pluginId - The plugin identifier (must match plugin name in metadata)
 * @returns The icon component or null if not found
 */
export function getPluginIcon(pluginId: string): ComponentType<{ className?: string }> | null {
  return PLUGIN_ICON_MAP[pluginId] || null
}

// Converter metadata centralizada para formato usado pelo frontend
// Mantém compatibilidade com código existente
// Funciona automaticamente com qualquer plugin novo adicionado
export const PLUGINS_DATA = Object.fromEntries(
  Object.entries(PLUGINS_METADATA as Record<string, any>).map(([key, metadata]) => [
    key,
    {
      name: metadata.displayName,
      icon: key, // Nome do ícone para referência
      description: metadata.description,
      sections: (metadata.sections || []).map((section: any) => ({
        id: section.id,
        name: section.name,
        description: section.description,
      })),
    },
  ])
) as Record<string, {
  name: string
  icon: string
  description: string
  sections: Array<{ id: string; name: string; description?: string }>
}>

export type PluginName = keyof typeof PLUGINS_DATA
