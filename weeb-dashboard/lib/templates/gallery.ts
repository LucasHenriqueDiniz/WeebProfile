import type { Template } from "@/types/template"

/**
 * A grid of up to 6 templates fits in two rows on a desktop and shows everything at
 * once, so search, filters and sorting only add controls to read. The gallery had
 * all four for 3 templates, with a theme list of every built-in theme.
 */
const TEMPLATES_WITHOUT_TOOLBAR = 6

export function showsGalleryToolbar(templateCount: number): boolean {
  return templateCount > TEMPLATES_WITHOUT_TOOLBAR
}

/** The values some template actually has, sorted, for a filter that cannot come up empty. */
export function distinctValues(templates: Template[], field: "style" | "theme"): string[] {
  return [...new Set(templates.map((template) => template[field]).filter(Boolean))].sort()
}

// The templates in production carry SQLite's "2026-07-22 22:17:13" (UTC, no T), which
// Safari's Date.parse rejects. Written as ISO, every browser reads it.
function createdTime(template: Template): number {
  const value = template.createdAt
  if (!value) return 0
  return Date.parse(value.includes("T") ? value : `${value.replace(" ", "T")}Z`) || 0
}

// "newest" and "oldest" compared new Date(template.id), and the id is a UUID: both
// dates were Invalid Date, the comparison NaN, and the order whatever the API sent.
export function sortTemplates(templates: Template[], sortBy: string): Template[] {
  return [...templates].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return createdTime(b) - createdTime(a)
      case "oldest":
        return createdTime(a) - createdTime(b)
      case "mostLiked":
        return (b.likes || 0) - (a.likes || 0)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}
