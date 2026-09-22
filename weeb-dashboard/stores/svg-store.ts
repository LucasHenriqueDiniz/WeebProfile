import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Svg } from "@/lib/db/schema"
import { svgApi } from "@/lib/api"

interface SvgStore {
  // Lista de SVGs
  svgs: Svg[]
  svgsLoading: boolean
  svgsError: Error | null
  lastFetchTime: number | null
  _hasHydrated: boolean // Flag para saber se já reidratou do localStorage

  // SVG individual (cache por ID)
  svgCache: Record<string, { svg: Svg; timestamp: number }>
  cacheMaxAge: number // 5 minutos em ms

  // Actions
  fetchSvgs: (force?: boolean) => Promise<void>
  getSvg: (id: string, force?: boolean) => Promise<Svg | null>
  getSvgSync: (id: string) => Svg | null // Versão síncrona para pegar do cache
  updateSvg: (id: string, updates: Partial<Svg>) => void
  removeSvg: (id: string) => void
  clearCache: () => void
  setHasHydrated: (state: boolean) => void
}

const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutos

export const useSvgStore = create<SvgStore>()(
  persist(
    (set, get) => ({
      svgs: [],
      svgsLoading: false,
      svgsError: null,
      lastFetchTime: null,
      _hasHydrated: false,
      svgCache: {},
      cacheMaxAge: CACHE_MAX_AGE,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state })
      },

      fetchSvgs: async (force = false) => {
        const state = get()

        // Se não for forçado e já temos dados recentes (menos de 5 minutos), não buscar
        // Aumentar tempo de cache para evitar requests desnecessários
        if (!force && state.svgs.length > 0 && state.lastFetchTime) {
          const timeSinceLastFetch = Date.now() - state.lastFetchTime
          if (timeSinceLastFetch < 5 * 60 * 1000) {
            // 5 minutos
            return // Cache válido, não fazer fetch
          }
        }

        // Só mostrar loading se não tiver dados em cache
        // Se já tiver dados, fazer fetch em background sem mostrar loading
        const hasCachedData = state.svgs.length > 0
        if (!hasCachedData) {
          set({ svgsLoading: true, svgsError: null })
        }

        try {
          const data = await svgApi.list()
          const svgsList = data.svgs || []
          set({
            svgs: svgsList,
            svgsLoading: false,
            lastFetchTime: Date.now(),
          })
        } catch (error) {
          console.error("Error fetching SVGs:", error)
          set({
            svgsError: error instanceof Error ? error : new Error("Unknown error"),
            svgsLoading: false,
          })
          // Se tiver dados em cache e o fetch falhou, manter os dados antigos
          if (!hasCachedData) {
            set({ svgs: [] }) // Só limpar se não tinha dados antes
          }
        }
      },

      getSvg: async (id: string, force = false) => {
        const state = get()

        // Verificar cache primeiro
        if (!force && state.svgCache[id]) {
          const cached = state.svgCache[id]
          const age = Date.now() - cached.timestamp

          // Se o cache ainda é válido, retornar imediatamente
          if (age < state.cacheMaxAge) {
            return cached.svg
          }
        }

        // Buscar do servidor apenas se necessário
        try {
          const data = await svgApi.get(id)
          const svg = data.svg

          // Atualizar cache
          set({
            svgCache: {
              ...state.svgCache,
              [id]: {
                svg,
                timestamp: Date.now(),
              },
            },
          })

          // Também atualizar na lista se existir
          const svgs = state.svgs.map((s) => (s.id === id ? svg : s))
          set({ svgs })

          return svg
        } catch (error) {
          console.error("Error fetching SVG:", error)
          // Retornar cache antigo se disponível, mesmo se expirado
          if (state.svgCache[id]) {
            return state.svgCache[id].svg
          }
          return null
        }
      },

      getSvgSync: (id: string) => {
        const state = get()
        const cached = state.svgCache[id]
        if (cached) {
          const age = Date.now() - cached.timestamp
          if (age < state.cacheMaxAge) {
            return cached.svg
          }
        }
        return null
      },

      updateSvg: (id: string, updates: Partial<Svg>) => {
        const state = get()

        // Atualizar na lista
        const svgs = state.svgs.map((s) => (s.id === id ? { ...s, ...updates } : s))

        // Atualizar no cache
        const svgCache = { ...state.svgCache }
        if (svgCache[id]) {
          svgCache[id] = {
            ...svgCache[id],
            svg: { ...svgCache[id].svg, ...updates },
          }
        }

        set({ svgs, svgCache })
      },

      removeSvg: (id: string) => {
        const state = get()

        // Remover da lista
        const svgs = state.svgs.filter((s) => s.id !== id)

        // Remover do cache
        const svgCache = { ...state.svgCache }
        delete svgCache[id]

        set({ svgs, svgCache })
      },

      clearCache: () => {
        set({
          svgCache: {},
          lastFetchTime: null,
        })
      },
    }),
    {
      name: "svg-storage",
      partialize: (state) => ({
        svgs: state.svgs,
        svgCache: state.svgCache,
        lastFetchTime: state.lastFetchTime,
        // _hasHydrated NÃO deve ser persistido - é apenas flag de runtime
      }),
      // Limpar apenas cache expirado na rehydratação, mas manter SVGs salvos
      onRehydrateStorage: () => (state) => {
        if (state) {
          const now = Date.now()
          const validCache: Record<string, { svg: Svg; timestamp: number }> = {}

          // Manter apenas cache válido (mas não remover SVGs da lista - eles são dados reais)
          Object.entries(state.svgCache).forEach(([id, cached]) => {
            const age = now - cached.timestamp
            if (age < state.cacheMaxAge) {
              validCache[id] = cached
            }
          })

          // NÃO limpar SVGs da lista - eles são dados reais salvos do usuário
          // Apenas limpar cache de SVGs individuais expirado
          state.svgCache = validCache
          // state.svgs permanece intacto - são dados reais, não cache

          // Marcar como reidratado
          state._hasHydrated = true
        }
      },
    }
  )
)
