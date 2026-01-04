/**
 * Debug Store (Zustand)
 * 
 * Global state management for the debug tool
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StyleSnapshot } from '../lib/iframe/iframeProtocol'

interface SnapshotCacheEntry {
  react: StyleSnapshot
  svg: StyleSnapshot
  timestamp: number
}

interface SnapshotCache {
  renderVersion: number
  snapshots: Map<string, SnapshotCacheEntry>
}

interface UiPreferences {
  syncSelectionEnabled: boolean
  showHighlights: boolean
  diffMode: boolean
  selectedTab: string
  previewBackground: 'light' | 'dark'
}

interface DebugStore {
  // Selection state
  selectedDebugId: string | null
  hoveredDebugId: string | null
  
  // UI preferences (persisted)
  uiPreferences: UiPreferences
  
  // Configuration
  plugin: string
  section: string
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  dev: boolean
  sectionConfig: Record<string, any>
  
  // Outputs
  lastOutputs: {
    html: string
    css: string
    svg: string
  } | null
  
  // Snapshot cache
  snapshotCache: SnapshotCache
  
  // Actions
  setSelectedDebugId: (id: string | null) => void
  setHoveredDebugId: (id: string | null) => void
  setSyncSelectionEnabled: (enabled: boolean) => void
  setShowHighlights: (show: boolean) => void
  setDiffMode: (enabled: boolean) => void
  setSelectedTab: (tab: string) => void
  setPreviewBackground: (bg: 'light' | 'dark') => void
  setConfig: (config: { plugin: string; section: string; style: 'default' | 'terminal'; size: 'half' | 'full'; dev: boolean }) => void
  setSectionConfig: (config: Record<string, any>) => void
  setLastOutputs: (outputs: { html: string; css: string; svg: string }) => void
  setSnapshot: (debugId: string, react: StyleSnapshot, svg: StyleSnapshot) => void
  getSnapshot: (debugId: string) => SnapshotCacheEntry | null
  clearCache: () => void
  incrementRenderVersion: () => void
}

const defaultUiPreferences: UiPreferences = {
  syncSelectionEnabled: true,
  showHighlights: true,
  diffMode: false,
  selectedTab: 'element',
  previewBackground: 'dark',
}

export const useDebugStore = create<DebugStore>()(
  persist(
    (set, get) => ({
      selectedDebugId: null,
      hoveredDebugId: null,
      
      uiPreferences: defaultUiPreferences,
      
      plugin: 'myanimelist',
      section: 'statistics',
      style: 'default',
      size: 'half',
      dev: true,
      sectionConfig: {},
      
      lastOutputs: null,
      
      snapshotCache: {
        renderVersion: 0,
        snapshots: new Map(),
      },
      
      setSelectedDebugId: (id) => set({ selectedDebugId: id }),
      setHoveredDebugId: (id) => set({ hoveredDebugId: id }),
      
      setSyncSelectionEnabled: (enabled) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, syncSelectionEnabled: enabled },
        })),
      
      setShowHighlights: (show) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, showHighlights: show },
        })),
      
      setDiffMode: (enabled) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, diffMode: enabled },
        })),
      
      setSelectedTab: (tab) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, selectedTab: tab },
        })),
      
      setPreviewBackground: (bg) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, previewBackground: bg },
        })),
      
      setConfig: (config) => {
        set(config)
        // Reset section config when plugin/section changes
        if (config.plugin !== get().plugin || config.section !== get().section) {
          set({ sectionConfig: {} })
        }
      },
      setSectionConfig: (config) => set({ sectionConfig: config }),
      
      setLastOutputs: (outputs) => set({ lastOutputs: outputs }),
      
      setSnapshot: (debugId, react, svg) =>
        set((state) => {
          const cache = state.snapshotCache
          const snapshots = new Map(cache.snapshots)
          snapshots.set(debugId, {
            react,
            svg,
            timestamp: Date.now(),
          })
          return {
            snapshotCache: {
              ...cache,
              snapshots,
            },
          }
        }),
      
      getSnapshot: (debugId) => {
        const state = get()
        const entry = state.snapshotCache.snapshots.get(debugId)
        if (!entry) return null
        // Check if cache is from current render version
        if (entry.timestamp < state.snapshotCache.renderVersion * 1000) {
          // Cache is stale, remove it
          const snapshots = new Map(state.snapshotCache.snapshots)
          snapshots.delete(debugId)
          set({
            snapshotCache: {
              ...state.snapshotCache,
              snapshots,
            },
          })
          return null
        }
        return entry
      },
      
      clearCache: () =>
        set({
          snapshotCache: {
            renderVersion: 0,
            snapshots: new Map(),
          },
        }),
      
      incrementRenderVersion: () =>
        set((state) => ({
          snapshotCache: {
            ...state.snapshotCache,
            renderVersion: state.snapshotCache.renderVersion + 1,
          },
        })),
    }),
    {
      name: 'weeb-debug-store',
      partialize: (state) => ({
        uiPreferences: state.uiPreferences,
        plugin: state.plugin,
        section: state.section,
        style: state.style,
        size: state.size,
        dev: state.dev,
        sectionConfig: state.sectionConfig,
      }),
    }
  )
)

