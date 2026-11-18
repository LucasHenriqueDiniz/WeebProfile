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
    theme: apiTemplate.theme || "default",
    size: (apiTemplate.size as "half" | "full") || "half",
    likes: apiTemplate.likesCount || apiTemplate.likes || 0,
    liked: apiTemplate.userLiked || apiTemplate.liked || false,
    pluginsConfig: apiTemplate.pluginsConfig,
    pluginsOrder: apiTemplate.pluginsOrder,
    // The gallery sorts by it: without it "newest" and "oldest" kept the API's order.
    createdAt: apiTemplate.createdAt,
  }
}

export function mapApiToTemplates(apiTemplates: any[]): Template[] {
  return (apiTemplates || []).map(mapApiToTemplate)
}
