import { Github, Music, BookOpen, Brain } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Registry estático de ícones do lucide-react
 * Mapeia nome do ícone (string) para componente React
 */
const ICON_REGISTRY: Record<string, LucideIcon> = {
  Github,
  Music,
  BookOpen,
  Brain,
  UserCircle: BookOpen, // Fallback para UserCircle
  // Adicionar novos ícones aqui quando novos plugins forem criados
}

/**
 * Helper para obter ícone do plugin dinamicamente
 * Busca o nome do ícone da metadata e retorna o componente correspondente
 * Funciona automaticamente com qualquer plugin novo adicionado
 */
export const getPluginIcon = (pluginName: string): LucideIcon | null => {
  // Acessa o metadata de forma genérica para funcionar com qualquer plugin
  // Usa Record<string, any> para ser compatível com qualquer plugin novo
  const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!metadata?.icon) {
    return null
  }
  
  const IconComponent = ICON_REGISTRY[metadata.icon]
  return IconComponent || null
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


