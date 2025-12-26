"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"
import { useProfileConfig } from "@/hooks/useProfileConfig"
import { PLUGINS_METADATA, getPluginsGroupedByCategory, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { PLUGINS_DATA } from "@/lib/plugins-data"
import { useWizardStore } from "@/stores/wizard-store"
import { selectEnabledPluginNames } from "@/stores/wizard-selectors"
import { AlertCircle, Search, X, ChevronDown, ChevronRight, Check, Lock, Unlock, Settings, Loader2, CheckCircle2, Music, HelpCircle, ExternalLink } from "lucide-react"
import { useMemo, useState, useEffect, useCallback, useRef, useDeferredValue } from "react"
import { useShallow } from "zustand/react/shallow"
import { ProfileConfigModal } from "./ProfileConfigModal"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { profileApi } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getSectionPreview } from "@/lib/config/section-previews"
import { getPluginTags, getAllTags, type PluginTag } from "@/lib/config/plugin-tags"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useWizardUIState } from "@/hooks/useWizardUIState"
import { EmptyState } from "./EmptyState"
import { PluginCard } from "./PluginCard"

export function PluginConfiguration() {
  const { user } = useAuth()
  const { toast } = useToast()
  // Use useShallow to prevent unnecessary re-renders
  const { plugins, pluginsOrder, style } = useWizardStore(
    useShallow((state) => ({
      plugins: state.plugins,
      pluginsOrder: state.pluginsOrder,
      style: state.style,
    }))
  )
  const setPluginRequiredField = useWizardStore((state) => state.setPluginRequiredField)
  const togglePlugin = useWizardStore((state) => state.togglePlugin)
  const setPluginSections = useWizardStore((state) => state.setPluginSections)
  const setSectionConfig = useWizardStore((state) => state.setSectionConfig)
  const setPluginsHaveMissingEssentialConfigs = useWizardStore((state) => state.setPluginsHaveMissingEssentialConfigs)

  const [showProfileModal, setShowProfileModal] = useState(false)
  
  // UX 2: Use persisted UI state hook
  const uiState = useWizardUIState()
  const { category, query, onlyEnabled, expandedPlugins, toggleExpanded, setCategory, setQuery, setOnlyEnabled } = uiState
  
  // Phase 1.1: useDeferredValue for smooth search
  const deferredQuery = useDeferredValue(query)
  // Phase 1.2: Debounce for additional optimization
  const debouncedQuery = useDebouncedValue(deferredQuery, 150)
  
  const [unlockedConfigs, setUnlockedConfigs] = useState<Set<string>>(new Set())
  const [unlockDialog, setUnlockDialog] = useState<{ plugin: string; key: string } | null>(null)
  const [savingConfigs, setSavingConfigs] = useState<Set<string>>(new Set())
  const [savedConfigs, setSavedConfigs] = useState<Set<string>>(new Set())
  const pluginRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Use canonical selector for enabled plugins
  const enabledPlugins = useMemo(() => {
    return selectEnabledPluginNames({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  const scrollToPlugin = useCallback((pluginName: string) => {
    toggleExpanded(pluginName)
    setTimeout(() => {
      pluginRefs.current[pluginName]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)
  }, [toggleExpanded])

  // Use new hook for profile config
  const { profile, essentialConfigs, missingConfigs: rawMissingConfigs, loading: profileLoading } = useProfileConfig(enabledPlugins)
  
  // Transform missingConfigs to the format expected by PluginCard
  const missingConfigs = useMemo(() => {
    return rawMissingConfigs.flatMap(({ pluginName, missingKeys }) =>
      missingKeys.map((key) => ({
        plugin: pluginName,
        field: key.key,
        label: key.label || key.key,
      }))
    )
  }, [rawMissingConfigs])
  
  // Update store with missing configs status
  useEffect(() => {
    setPluginsHaveMissingEssentialConfigs(missingConfigs.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigs.length])

  // Listen for custom event to open profile config modal
  useEffect(() => {
    const handleOpenProfileConfig = () => {
      setShowProfileModal(true)
    }
    window.addEventListener("openProfileConfig", handleOpenProfileConfig)
    return () => {
      window.removeEventListener("openProfileConfig", handleOpenProfileConfig)
    }
  }, [])

  // Apply username from profile when it loads (only once)
  useEffect(() => {
    if (!enabledPlugins.includes('github')) return
    
    const currentUsername = plugins.github?.username
    const profileUsername = profile?.username
    
    // Only update if username is different and not already set
    if (profileUsername && currentUsername !== profileUsername) {
      setPluginRequiredField('github', 'username', profileUsername)
    } else if (!currentUsername && !profileUsername && user?.user_metadata) {
      const usernameFromAuth =
        user.user_metadata.user_name ||
        user.user_metadata.preferred_username ||
        user.user_metadata.login
      
      if (usernameFromAuth) {
        setPluginRequiredField('github', 'username', usernameFromAuth)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.username, enabledPlugins.join(",")])

  // Group plugins by category
  const groupedPlugins = useMemo(() => getPluginsGroupedByCategory(), [])

  // Flatten all plugins with category id
  const allPlugins = useMemo(() => {
    return Object.entries(groupedPlugins).flatMap(([catId, categoryPlugins]) =>
      categoryPlugins.map((plugin) => ({
        ...plugin,
        categoryId: catId as PluginCategory,
      }))
    )
  }, [groupedPlugins])

  // Filter plugins - Phase 1.1 & 1.2: Use deferred and debounced query
  const filteredPlugins = useMemo(() => {
    return allPlugins.filter((plugin) => {
      const state = plugins[plugin.name]
      if (!state) return false

      // Filter by enabled
      if (onlyEnabled && !state.enabled) return false

      // Filter by category or tags
      if (category !== "all") {
        // Se for uma categoria oficial, usar categoryId
        if (["coding", "music", "anime", "gaming"].includes(category)) {
          if (plugin.categoryId !== category) {
            return false
          }
        } 
        // Se for uma tag, verificar tags do plugin
        else {
          const pluginTags = getPluginTags(plugin.name)
          if (!pluginTags.includes(category as PluginTag)) {
            return false
          }
        }
      }

      // Filter by search - use debounced query
      if (debouncedQuery) {
        const searchLower = debouncedQuery.toLowerCase()
        const pluginData = PLUGINS_DATA[plugin.name as keyof typeof PLUGINS_DATA]
        return (
          pluginData?.name.toLowerCase().includes(searchLower) ||
          pluginData?.description.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [allPlugins, plugins, category, debouncedQuery, onlyEnabled])

  const togglePluginExpanded = useCallback((pluginId: string) => {
    toggleExpanded(pluginId)
  }, [toggleExpanded])

  const toggleSection = (pluginName: string, sectionId: string) => {
    const currentSections = plugins[pluginName]?.sections || []
    const newSections = currentSections.includes(sectionId)
      ? currentSections.filter((id) => id !== sectionId)
      : [...currentSections, sectionId]
    setPluginSections(pluginName, newSections)
  }

  const handleUnlockConfig = (plugin: string, key: string) => {
    setUnlockDialog({ plugin, key })
  }

  const confirmUnlock = () => {
    if (!unlockDialog) return
    const { plugin, key } = unlockDialog
    setUnlockedConfigs((prev) => new Set(prev).add(`${plugin}.${key}`))
    setUnlockDialog(null)
  }

  const handleEssentialConfigChange = async (plugin: string, key: string, value: string) => {
    const configKey = `${plugin}.${key}`
    const isUnlocked = unlockedConfigs.has(configKey)
    const isLocked = essentialConfigs[plugin]?.[key] === true && !isUnlocked

    // Se está locked e não foi desbloqueado, não permitir edição
    if (isLocked) {
      handleUnlockConfig(plugin, key)
      return
    }

    // Atualizar localmente
    setPluginRequiredField(plugin, key, value)

    // Se foi desbloqueado, salvar via API
    if (isUnlocked && value.trim()) {
      setSavingConfigs((prev) => new Set(prev).add(configKey))
      try {
        await profileApi.updateEssentialConfig(plugin, key, value)
        setSavedConfigs((prev) => new Set(prev).add(configKey))
        toast({
          title: "Configuração salva",
          description: `${key} foi atualizado com sucesso`,
        })
        // Remover indicador de salvo após 2 segundos
        setTimeout(() => {
          setSavedConfigs((prev) => {
            const next = new Set(prev)
            next.delete(configKey)
            return next
          })
        }, 2000)
      } catch (error) {
        console.error("Error saving essential config:", error)
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a configuração",
          variant: "destructive",
        })
      } finally {
        setSavingConfigs((prev) => {
          const next = new Set(prev)
          next.delete(configKey)
          return next
        })
      }
    }
  }

  // Preview stats
  const enabledPluginsList = enabledPlugins.map((id) => {
    const pluginData = PLUGINS_DATA[id as keyof typeof PLUGINS_DATA]
    return { id, name: pluginData?.name ?? id }
  })

  // Calculate total sections for progress indicator
  const totalSections = useMemo(() => {
    return enabledPlugins.reduce((sum, name) => {
      return sum + (plugins[name]?.sections?.length || 0)
    }, 0)
  }, [enabledPlugins, plugins])

  // Use missingConfigs to determine hasMissingEssential
  const hasMissingEssential = missingConfigs.length > 0

  // Phase 1.4: Improved loading state with skeleton
  if (profileLoading && enabledPlugins.length > 0) {
    return (
      <div className="space-y-3">
        {/* Search bar skeleton */}
        <div className="space-y-3">
          <div className="relative h-10 bg-muted/50 rounded-md animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-muted/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Plugin cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-5 w-9 bg-muted/50 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search and filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search plugins..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category chips + only enabled */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {(() => {
              const allTags = getAllTags()
              const categoryLabels: Record<string, string> = {
                all: "All",
                coding: "Coding",
                music: "Music",
                anime: "Anime",
                gaming: "Gaming",
                health: "Health",
                productivity: "Productivity",
                social: "Social",
                entertainment: "Entertainment",
              }
              const categories: Array<PluginCategory | "all" | PluginTag> = ["all", "coding", "music", "anime", "gaming", ...allTags]
              
              return categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all capitalize",
                    category === cat
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))
            })()}
          </div>

          <div className="ml-auto">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={onlyEnabled}
                onChange={(e) => setOnlyEnabled(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">Only enabled</span>
            </label>
          </div>
        </div>
      </div>

      {/* UX 4: Progress indicator and enabled plugins summary */}
      <div className="space-y-3">
        {enabledPluginsList.length > 0 && (
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
                Enabled plugins ({enabledPluginsList.length})
              </p>
              {/* UX 5: Quick actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allPluginNames = filteredPlugins.map(p => p.name)
                    allPluginNames.forEach(name => {
                      if (!expandedPlugins.has(name)) toggleExpanded(name)
                    })
                  }}
                  className="text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 font-medium"
                >
                  Expand all
                </button>
                <span className="text-emerald-700 dark:text-emerald-300">•</span>
                <button
                  onClick={() => {
                    expandedPlugins.forEach(name => toggleExpanded(name))
                  }}
                  className="text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 font-medium"
                >
                  Collapse all
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 mb-1">
                <span>Progress: {totalSections} sections configured</span>
                <span>{enabledPluginsList.length} plugins enabled</span>
              </div>
              <div className="h-2 bg-emerald-200 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                  style={{
                    width: `${Math.min((totalSections / Math.max(enabledPluginsList.length * 3, 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {enabledPluginsList.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => scrollToPlugin(id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* UX 3: Improved warning banner with action */}
      {missingConfigs.length > 0 && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm flex-1 min-w-0">
              <p className="font-medium text-amber-900 dark:text-amber-200">
                Configuração incompleta
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                {missingConfigs.length === 1 
                  ? "1 campo obrigatório precisa ser preenchido" 
                  : `${missingConfigs.length} campos obrigatórios precisam ser preenchidos`}
              </p>
              {/* UX 5: Quick action to expand plugins with missing configs */}
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set(missingConfigs.map(m => m.plugin))).slice(0, 5).map((pluginName) => (
                  <button
                    key={pluginName}
                    onClick={() => scrollToPlugin(pluginName)}
                    className="text-xs px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors capitalize"
                  >
                    Ir para {pluginName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plugins list - Phase 2.2: Virtualization for performance */}
      {filteredPlugins.length > 0 ? (
        <VirtualizedPluginList
          plugins={filteredPlugins}
          expandedPlugins={expandedPlugins}
          unlockedConfigs={unlockedConfigs}
          savingConfigs={savingConfigs}
          savedConfigs={savedConfigs}
          essentialConfigs={essentialConfigs}
          missingConfigs={missingConfigs}
          style={style}
          pluginsState={plugins}
          pluginRefs={pluginRefs}
          onToggleExpanded={togglePluginExpanded}
          onTogglePlugin={togglePlugin}
          onToggleSection={toggleSection}
          onEssentialConfigChange={handleEssentialConfigChange}
          onUnlockConfig={handleUnlockConfig}
          onSetPluginRequiredField={setPluginRequiredField}
          onSetSectionConfig={setSectionConfig}
        />
      ) : (
        /* Phase 1.3: Empty state with helpful message */
        <EmptyState query={query} category={category} onlyEnabled={onlyEnabled} onClearFilters={() => {
          setQuery("")
          setCategory("all")
          setOnlyEnabled(false)
        }} />
      )}

      <PluginConfigurationFooter
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        enabledPlugins={enabledPlugins}
        unlockDialog={unlockDialog}
        setUnlockDialog={setUnlockDialog}
        confirmUnlock={confirmUnlock}
      />
    </div>
  )
}

// Phase 2.2: Virtualized plugin list component
function VirtualizedPluginList({
  plugins,
  expandedPlugins,
  unlockedConfigs,
  savingConfigs,
  savedConfigs,
  essentialConfigs,
  missingConfigs,
  style,
  pluginsState,
  pluginRefs,
  onToggleExpanded,
  onTogglePlugin,
  onToggleSection,
  onEssentialConfigChange,
  onUnlockConfig,
  onSetPluginRequiredField,
  onSetSectionConfig,
}: {
  plugins: Array<{ name: string; categoryId?: string }>
  expandedPlugins: Set<string>
  unlockedConfigs: Set<string>
  savingConfigs: Set<string>
  savedConfigs: Set<string>
  essentialConfigs: Record<string, Record<string, any>>
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  style: string
  pluginsState: Record<string, any>
  pluginRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  onToggleExpanded: (name: string) => void
  onTogglePlugin: (name: string) => void
  onToggleSection: (name: string, sectionId: string) => void
  onEssentialConfigChange: (plugin: string, key: string, value: string) => Promise<void>
  onUnlockConfig: (plugin: string, key: string) => void
  onSetPluginRequiredField: (plugin: string, field: string, value: string) => void
  onSetSectionConfig: (plugin: string, sectionId: string, config: any) => void
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Only virtualize if we have many plugins (performance optimization)
  const shouldVirtualize = plugins.length > 10

  const virtualizer = useVirtualizer({
    count: plugins.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated card height
    overscan: 5,
    enabled: shouldVirtualize,
  })

  if (!shouldVirtualize) {
    // Render normally for small lists using memoized PluginCard
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {plugins.map((plugin) => {
          const state = pluginsState[plugin.name]
          if (!state) return null

          const isExpanded = expandedPlugins.has(plugin.name)

          return (
            <div
              key={plugin.name}
              ref={(el) => {
                pluginRefs.current[plugin.name] = el
              }}
            >
              <PluginCard
                plugin={plugin}
                state={state}
                isExpanded={isExpanded}
                expandedPlugins={expandedPlugins}
                unlockedConfigs={unlockedConfigs}
                savingConfigs={savingConfigs}
                savedConfigs={savedConfigs}
                essentialConfigs={essentialConfigs}
                missingConfigs={missingConfigs}
                style={style}
                onToggleExpanded={onToggleExpanded}
                onTogglePlugin={onTogglePlugin}
                onToggleSection={onToggleSection}
                onEssentialConfigChange={onEssentialConfigChange}
                onUnlockConfig={onUnlockConfig}
                onSetPluginRequiredField={onSetPluginRequiredField}
                onSetSectionConfig={onSetSectionConfig}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // Virtualized rendering for large lists
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem: any) => {
          const plugin = plugins[virtualItem.index]
          const state = pluginsState[plugin.name]
          if (!state) return null

          const isExpanded = expandedPlugins.has(plugin.name)

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              ref={(el) => {
                pluginRefs.current[plugin.name] = el
              }}
            >
              <PluginCard
                plugin={plugin}
                state={state}
                isExpanded={isExpanded}
                expandedPlugins={expandedPlugins}
                unlockedConfigs={unlockedConfigs}
                savingConfigs={savingConfigs}
                savedConfigs={savedConfigs}
                essentialConfigs={essentialConfigs}
                missingConfigs={missingConfigs}
                style={style}
                onToggleExpanded={onToggleExpanded}
                onTogglePlugin={onTogglePlugin}
                onToggleSection={onToggleSection}
                onEssentialConfigChange={onEssentialConfigChange}
                onUnlockConfig={onUnlockConfig}
                onSetPluginRequiredField={onSetPluginRequiredField}
                onSetSectionConfig={onSetSectionConfig}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PluginConfigurationFooter({
  showProfileModal,
  setShowProfileModal,
  enabledPlugins,
  unlockDialog,
  setUnlockDialog,
  confirmUnlock,
}: {
  showProfileModal: boolean
  setShowProfileModal: (open: boolean) => void
  enabledPlugins: string[]
  unlockDialog: { plugin: string; key: string } | null
  setUnlockDialog: (dialog: { plugin: string; key: string } | null) => void
  confirmUnlock: () => void
}) {
  return (
    <>
      <ProfileConfigModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        enabledPlugins={enabledPlugins}
        onSave={async () => {
          // Reload will happen automatically via useProfileConfig hook
        }}
      />

      {/* Unlock Config Dialog */}
      <Dialog open={!!unlockDialog} onOpenChange={(open) => !open && setUnlockDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desbloquear Configuração</DialogTitle>
            <DialogDescription>
              Esta configuração já possui um valor salvo. Ao desbloquear, você poderá alterá-la, mas o valor atual será substituído. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlockDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnlock}>
              Desbloquear e Alterar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

