import { create } from "zustand"
import { mapApiToTemplates } from "@/lib/template-mapper"
import type { Template } from "@/types/template"

type FetchOpts = { limit?: number; force?: boolean; ttlMs?: number }

type PublicTemplatesState = {
  templates: Template[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  _inFlight?: Promise<Template[]>

  fetchPublic: (opts?: FetchOpts) => Promise<Template[]>
  clear: () => void
}

export const usePublicTemplatesStore = create<PublicTemplatesState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
  _inFlight: undefined,

  clear: () =>
    set({
      templates: [],
      loading: false,
      error: null,
      lastFetchedAt: null,
      _inFlight: undefined,
    }),

  fetchPublic: async (opts) => {
    const limit = opts?.limit ?? 5
    const ttlMs = opts?.ttlMs ?? 60_000
    const force = opts?.force ?? false

    const { templates, lastFetchedAt, _inFlight } = get()
    const isFresh = lastFetchedAt != null && Date.now() - lastFetchedAt < ttlMs

    if (!force && isFresh && templates.length) return templates
    if (!force && _inFlight) return _inFlight

    const p = (async () => {
      set({ loading: true, error: null })
      try {
        const res = await fetch(`/api/templates?public=true&limit=${limit}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        const list: Template[] = mapApiToTemplates(data.templates || [])

        set({ templates: list, lastFetchedAt: Date.now(), loading: false })
        return list
      } catch (e: any) {
        set({
          templates: [],
          loading: false,
          error: e?.message ?? "Failed to fetch templates",
          lastFetchedAt: Date.now(),
        })
        return []
      } finally {
        set({ _inFlight: undefined })
      }
    })()

    set({ _inFlight: p })
    return p
  },
}))
