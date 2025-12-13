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
import { AlertCircle, Search, X, ChevronDown, ChevronRight, Check, Lock, Unlock, Settings, Loader2, CheckCircle2 } from "lucide-react"
import { useMemo, useState, useEffect, useCallback, useRef } from "react"
import { ProfileConfigModal } from "./ProfileConfigModal"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { profileApi } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getSectionPreview } from "@/lib/config/section-previews"
import { getPluginTags, getAllTags, type PluginTag } from "@/lib/config/plugin-tags"

export function PluginConfiguration() {
  const { user } = useAuth()
  const { toast } = useToast()
  const {
    plugins,
    pluginsOrder,
    setPluginRequiredField,
    togglePlugin,
    setPluginSections,
    setSectionConfig,
    setPluginsHaveMissingEssentialConfigs,
    style,
  } = useWizardStore()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [category, setCategory] = useState<PluginCategory | "all" | PluginTag>("all")
  const [query, setQuery] = useState("")
  const [onlyEnabled, setOnlyEnabled] = useState(false)
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set())
  const [unlockedConfigs, setUnlockedConfigs] = useState<Set<string>>(new Set())
  const [unlockDialog, setUnlockDialog] = useState<{ plugin: string; key: string } | null>(null)
  const [savingConfigs, setSavingConfigs] = useState<Set<string>>(new Set())
  const [savedConfigs, setSavedConfigs] = useState<Set<string>>(new Set())
  const pluginRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const enabledPlugins = pluginsOrder.filter((name) => plugins[name]?.enabled)

  const scrollToPlugin = useCallback((pluginName: string) => {
    setExpandedPlugins((prev) => new Set(prev).add(pluginName))
    setTimeout(() => {
      pluginRefs.current[pluginName]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)
  }, [])

  // Use new hook for profile config
  const { profile, essentialConfigs, missingConfigs, loading: profileLoading } = useProfileConfig(enabledPlugins)
  
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

  // Filter plugins
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

      // Filter by search
      if (query) {
        const searchLower = query.toLowerCase()
        const pluginData = PLUGINS_DATA[plugin.name as keyof typeof PLUGINS_DATA]
        return (
          pluginData?.name.toLowerCase().includes(searchLower) ||
          pluginData?.description.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [allPlugins, plugins, category, query, onlyEnabled])

  const togglePluginExpanded = (pluginId: string) => {
    setExpandedPlugins((prev) => {
      const next = new Set(prev)
      if (next.has(pluginId)) {
        next.delete(pluginId)
      } else {
        next.add(pluginId)
      }
      return next
    })
  }

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

  const totalSections = enabledPlugins.reduce((sum, name) => {
    return sum + (plugins[name]?.sections?.length || 0)
  }, 0)

  const hasMissingEssential = Object.entries(plugins).some(([id, plugin]) => {
    if (!plugin.enabled) return false
    const metadata = PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]
    if (!metadata) return false
    return metadata.requiredFields.some((field) => {
      const value = (plugin as any)[field]
      if (typeof value === 'string') return !value.trim()
      return !value
    })
  })

  // Show loading state while profile config is loading
  if (profileLoading && enabledPlugins.length > 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading plugin configurations...</p>
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

      {/* Enabled plugins pills */}
      {enabledPluginsList.length > 0 && (
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-3">
          <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200 mb-2">
            Enabled plugins ({enabledPluginsList.length})
          </p>
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

      {/* Warning banner */}
      {hasMissingEssential && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm flex-1">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              Missing essential configuration
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Some enabled plugins require essential fields to be filled.
            </p>
          </div>
        </div>
      )}

      {/* Plugins list */}
      {filteredPlugins.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredPlugins.map((plugin) => {
            const state = plugins[plugin.name]
            if (!state) return null

            const isExpanded = expandedPlugins.has(plugin.name)
            const metadata = PLUGINS_METADATA[plugin.name as keyof typeof PLUGINS_METADATA]
            const pluginData = PLUGINS_DATA[plugin.name as keyof typeof PLUGINS_DATA]

            if (!metadata || !pluginData) return null

            const missingEssential =
              state.enabled &&
              metadata.requiredFields.some((field) => {
                const value = (state as any)[field]
                if (typeof value === 'string') return !value.trim()
                return !value
              })

            const activeSectionCount = state.sections?.length || 0

            return (
              <div
                key={plugin.name}
                ref={(el) => {
                  pluginRefs.current[plugin.name] = el
                }}
                className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      onClick={() => togglePluginExpanded(plugin.name)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {pluginData.name}
                          </span>
                          {state.enabled && (
                            <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                              enabled
                            </Badge>
                          )}
                          {missingEssential && (
                            <Badge variant="destructive" className="text-[10px] font-medium">
                              config required
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] font-medium">
                            {activeSectionCount}/{metadata.sections.length} sections
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pluginData.description}
                        </p>
                      </div>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={state.enabled}
                        onChange={() => togglePlugin(plugin.name)}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-purple-600"></div>
                    </label>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 pt-3 border-t border-border">
                      {/* Essential configs (from essentialConfigKeysMetadata) */}
                      {metadata.essentialConfigKeysMetadata && metadata.essentialConfigKeysMetadata.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground">
                            Required for data fetching
                          </p>
                          {metadata.essentialConfigKeysMetadata.map((configKeyMeta) => {
                            const configKey = configKeyMeta as { key: string; label: string; type: "text" | "password"; placeholder?: string; description?: string; helpUrl?: string }
                            const value = (state as any)[configKey.key] || ""
                            const configKeyId = `${plugin.name}.${configKey.key}`
                            const isUnlocked = unlockedConfigs.has(configKeyId)
                            const isLocked = essentialConfigs[plugin.name]?.[configKey.key] === true && !isUnlocked
                            const isSaving = savingConfigs.has(configKeyId)
                            const isSaved = savedConfigs.has(configKeyId)
                            const isConfigured = isLocked && !isUnlocked

                            return (
                              <div key={configKey.key} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs font-medium">
                                      {configKey.label}
                                    </Label>
                                    {isConfigured && (
                                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                                        OK
                                      </Badge>
                                    )}
                                  </div>
                                  {configKey.helpUrl && (
                                    <a
                                      href={configKey.helpUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline"
                                    >
                                      Help
                                    </a>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Input
                                      type={configKey.type}
                                      className={cn(
                                        "h-8 text-xs pr-8",
                                        isLocked && "bg-muted/50 text-muted-foreground italic cursor-not-allowed"
                                      )}
                                      placeholder={configKey.placeholder || `Enter ${configKey.key}...`}
                                      value={isLocked ? "**** locked" : value}
                                      disabled={isLocked || isSaving}
                                      onChange={(e) => handleEssentialConfigChange(plugin.name, configKey.key, e.target.value)}
                                    />
                                    {isLocked && (
                                      <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    )}
                                    {isSaving && (
                                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-spin" />
                                    )}
                                    {isSaved && !isSaving && (
                                      <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600" />
                                    )}
                                  </div>
                                  {isLocked && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnlockConfig(plugin.name, configKey.key)}
                                      className="h-8 text-xs"
                                    >
                                      <Unlock className="h-3 w-3 mr-1" />
                                      Unlock
                                    </Button>
                                  )}
                                </div>
                                {configKey.description && (
                                  <p className="text-xs text-muted-foreground">{configKey.description}</p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Required fields (fallback para plugins sem essentialConfigKeysMetadata) */}
                      {(!metadata.essentialConfigKeysMetadata || metadata.essentialConfigKeysMetadata.length === 0) && metadata.requiredFields.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground">
                            Required for data fetching
                          </p>
                          {metadata.requiredFields.map((field) => {
                            const value = (state as any)[field] || ""
                            return (
                              <div key={field} className="space-y-1">
                                <Label className="text-xs font-medium capitalize">
                                  {field.replace(/([A-Z])/g, " $1").trim()}
                                </Label>
                                <Input
                                  type={
                                    field.includes("token") ||
                                    field.includes("key") ||
                                    field.includes("Token")
                                      ? "password"
                                      : "text"
                                  }
                                  className="h-8 text-xs"
                                  placeholder={`Enter ${field}...`}
                                  value={value}
                                  onChange={(e) =>
                                    setPluginRequiredField(plugin.name, field, e.target.value)
                                  }
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Sections */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground">
                          Sections ({activeSectionCount}/{metadata.sections.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {metadata.sections.map((section) => {
                            const isSelected = state.sections?.includes(section.id) || false
                            const hasConfigs = section.configOptions && section.configOptions.length > 0
                            const sectionConfig = state.sectionConfigs?.[section.id] || {}

                            return (
                              <TooltipProvider key={section.id} delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="inline-flex items-center gap-1">
                                      <label
                                        className={cn(
                                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border relative group",
                                          isSelected
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                        )}
                                      >
                                        <input
                                          type="checkbox"
                                          className="sr-only"
                                          checked={isSelected}
                                          onChange={() => toggleSection(plugin.name, section.id)}
                                        />
                                        {isSelected && <Check className="h-3 w-3" />}
                                        <span>{section.name}</span>
                                        {hasConfigs && isSelected && (
                                          <span className="ml-1">
                                            <SectionConfigDialog
                                              plugin={plugin.name}
                                              section={section}
                                              sectionConfig={sectionConfig}
                                              onConfigChange={(config) => setSectionConfig(plugin.name, section.id, config)}
                                            />
                                          </span>
                                        )}
                                      </label>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs p-3">
                                    <div className="space-y-2">
                                      <p className="font-medium text-sm">{section.name}</p>
                                      {section.description && (
                                        <p className="text-xs text-muted-foreground">{section.description}</p>
                                      )}
                                      {(() => {
                                        const previewImage = getSectionPreview(plugin.name, section.id, style)
                                        if (previewImage) {
                                          return (
                                            <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                                              <img 
                                                src={previewImage} 
                                                alt={`${section.name} preview`}
                                                className="w-full h-auto"
                                                onError={(e) => {
                                                  // Hide image on error
                                                  e.currentTarget.style.display = 'none'
                                                }}
                                              />
                                            </div>
                                          )
                                        }
                                        return null
                                      })()}
                                      {hasConfigs && (
                                        <p className="text-xs text-primary mt-1 font-medium">
                                          ⚙️ Tem configurações disponíveis
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No plugins found matching your filters
          </p>
        </div>
      )}

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
    </div>
  )
}

