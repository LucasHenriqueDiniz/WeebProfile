import { ensureConsistentPlatforms } from "@/lib/templates-utils"
import type { Template } from "@/types/template"

export function mapApiToTemplate(apiTemplate: any): Template {
  const platforms = ensureConsistentPlatforms(apiTemplate)
  return {
    id: apiTemplate.id,
    name: apiTemplate.name,
    description: apiTemplate.description || "",
    preview: apiTemplate.previewUrl || "",
    platforms,
    style: (apiTemplate.style as "default" | "terminal") || "default",
    theme: (apiTemplate.theme as "default" | "dark" | "purple" | "pink" | "blue" | "green" | "dracula") || "default",
    size: (apiTemplate.size as "half" | "full") || "half",
    likes: apiTemplate.likesCount || apiTemplate.likes || 0,
    liked: apiTemplate.userLiked || apiTemplate.liked || false,
    pluginsConfig: apiTemplate.pluginsConfig,
    pluginsOrder: apiTemplate.pluginsOrder,
  }
}

export function mapApiToTemplates(apiTemplates: any[]): Template[] {
  return (apiTemplates || []).map(mapApiToTemplate)
}
