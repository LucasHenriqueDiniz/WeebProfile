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

/** Which list the gallery shows: the signed-in one adds the visitor's own templates and likes. */
export type GallerySource = "public" | "mine"

/**
 * Public while Clerk has not answered or nobody is signed in, the visitor's own list
 * once a session is known. While auth loads and then comes back signed out the source
 * stays "public", so that visit asks for the list once.
 */
export function gallerySource(authLoading: boolean, signedIn: boolean): GallerySource {
  return !authLoading && signedIn ? "mine" : "public"
}

export interface GalleryState {
  templates: Template[]
  loading: boolean
  failed: boolean
}

/**
 * Runs gallery fetches so that only the latest one lands. The page used to fire the
 * public and the signed-in list side by side and keep whichever answered last: a
 * signed-in visitor whose own list came back first saw the public list overwrite it
 * and their private templates vanish. A failed fetch keeps what is on screen.
 */
export function createGalleryLoader(update: (change: (state: GalleryState) => GalleryState) => void) {
  let latest = 0
  return async function load(fetchList: () => Promise<Template[]>): Promise<void> {
    const request = ++latest
    update((state) => ({ ...state, loading: true, failed: false }))
    try {
      const templates = await fetchList()
      if (request === latest) update(() => ({ templates, loading: false, failed: false }))
    } catch {
      if (request === latest) update((state) => ({ ...state, loading: false, failed: true }))
    }
  }
}
