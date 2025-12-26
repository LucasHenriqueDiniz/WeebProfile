/**
 * Hook para gerenciar estado UI do wizard com persistência no localStorage
 * Persiste: expandedPlugins, activeTab, category, query, onlyEnabled
 */

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "wizard-ui-state"

interface WizardUIState {
  expandedPlugins: Set<string>
  activeTab: "plugins" | "style"
  category: string
  query: string
  onlyEnabled: boolean
}

const defaultState: WizardUIState = {
  expandedPlugins: new Set(),
  activeTab: "plugins",
  category: "all",
  query: "",
  onlyEnabled: false,
}

function loadFromStorage(): Partial<WizardUIState> {
  if (typeof window === "undefined") return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    
    const parsed = JSON.parse(stored)
    return {
      expandedPlugins: parsed.expandedPlugins ? new Set(parsed.expandedPlugins) : new Set(),
      activeTab: parsed.activeTab || "plugins",
      category: parsed.category || "all",
      query: parsed.query || "",
      onlyEnabled: parsed.onlyEnabled || false,
    }
  } catch {
    return {}
  }
}

function saveToStorage(state: Partial<WizardUIState>) {
  if (typeof window === "undefined") return
  
  try {
    const toSave = {
      expandedPlugins: state.expandedPlugins ? Array.from(state.expandedPlugins) : [],
      activeTab: state.activeTab,
      category: state.category,
      query: state.query,
      onlyEnabled: state.onlyEnabled,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // Ignore storage errors
  }
}

export function useWizardUIState() {
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(() => {
    const saved = loadFromStorage()
    return saved.expandedPlugins || new Set()
  })

  const [activeTab, setActiveTab] = useState<"plugins" | "style">(() => {
    const saved = loadFromStorage()
    return saved.activeTab || "plugins"
  })

  const [category, setCategory] = useState<string>(() => {
    const saved = loadFromStorage()
    return saved.category || "all"
  })

  const [query, setQuery] = useState<string>(() => {
    const saved = loadFromStorage()
    return saved.query || ""
  })

  const [onlyEnabled, setOnlyEnabled] = useState<boolean>(() => {
    const saved = loadFromStorage()
    return saved.onlyEnabled || false
  })

  // Persist expandedPlugins
  useEffect(() => {
    saveToStorage({ expandedPlugins })
  }, [expandedPlugins])

  // Persist activeTab
  useEffect(() => {
    saveToStorage({ activeTab })
  }, [activeTab])

  // Debounced persistence for search/category filters (don't spam localStorage)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage({ category, query, onlyEnabled })
    }, 500)
    return () => clearTimeout(timer)
  }, [category, query, onlyEnabled])

  const toggleExpanded = useCallback((pluginName: string) => {
    setExpandedPlugins((prev) => {
      const next = new Set(prev)
      if (next.has(pluginName)) {
        next.delete(pluginName)
      } else {
        next.add(pluginName)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    // This will be called with all plugin names from parent
    // For now, just provide the function
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedPlugins(new Set())
  }, [])

  return {
    // State
    expandedPlugins,
    activeTab,
    category,
    query,
    onlyEnabled,
    
    // Setters
    setExpandedPlugins,
    setActiveTab,
    setCategory,
    setQuery,
    setOnlyEnabled,
    
    // Helpers
    toggleExpanded,
    expandAll,
    collapseAll,
  }
}

