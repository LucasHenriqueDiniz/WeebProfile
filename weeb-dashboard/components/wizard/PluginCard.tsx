"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { getPluginIcon } from "@/lib/plugin-icons"
import { AlertCircle, ChevronDown, ChevronRight, Check, Lock, Unlock, Settings, Loader2, CheckCircle2, Music, HelpCircle, ExternalLink, Sparkles, Zap } from "lucide-react"
import React, { useCallback, useState, useEffect } from "react"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { cn } from "@/lib/utils"
import { getSectionPreview } from "@/lib/config/section-previews"
import { PluginStatusBadge } from "./ValidationIndicator"
import { PluginConfigStatus } from "./PluginConfigStatus"
import { SecretInput } from "./SecretInput"
import type { PluginConfig } from "@/stores/wizard-store"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { useTranslations } from "@/i18n/use-translations"

interface PluginCardProps {
  plugin: {
    name: string
    categoryId?: string
  }
  state: PluginConfig
  isExpanded: boolean
  expandedPlugins: Set<string>
  unlockedConfigs: Set<string>
  savingConfigs: Set<string>
  savedConfigs: Set<string>
  essentialConfigs: Record<string, Record<string, any>>
  secretsPresence?: Record<string, Record<string, { exists: boolean; updatedAt?: string }>>
  style: string
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  onToggleExpanded: (pluginName: string) => void
  onTogglePlugin: (pluginName: string) => void
  onToggleSection: (pluginName: string, sectionId: string) => void
  onEssentialConfigChange: (plugin: string, key: string, value: string) => void  // Apenas atualiza estado local
  onEssentialConfigSave: (plugin: string, key: string, value: string) => Promise<void>  // Salva no servidor
  onUnlockConfig: (plugin: string, key: string) => void
  onSetPluginRequiredField: (plugin: string, field: string, value: string) => void
  onSetSectionConfig: (plugin: string, sectionId: string, config: any) => void
  onSetPluginSections: (plugin: string, sections: string[]) => void
}

export const PluginCard = React.memo(function PluginCard({
  plugin,
  state,
  isExpanded,
  expandedPlugins,
  unlockedConfigs,
  savingConfigs,
  savedConfigs,
  essentialConfigs,
  secretsPresence,
  style,
  missingConfigs,
  onToggleExpanded,
  onTogglePlugin,
  onToggleSection,
  onEssentialConfigChange,
  onEssentialConfigSave,
  onUnlockConfig,
  onSetPluginRequiredField,
  onSetSectionConfig,
  onSetPluginSections,
}: PluginCardProps) {
  const metadata = PLUGINS_METADATA[plugin.name as keyof typeof PLUGINS_METADATA]
  const { tWithFallback } = usePluginI18n()
  const t = useTranslations('wizard.plugins')
  
  // Helper to get translated section name/description
  const getSectionName = useCallback((section: any) => {
    if (section.i18nKey?.name) {
      return tWithFallback(section.i18nKey.name.replace(/^plugins\./, ''), section.name)
    }
    return section.name
  }, [tWithFallback])
  
  const getSectionDescription = useCallback((section: any) => {
    if (!section.description) return undefined
    if (section.i18nKey?.description) {
      return tWithFallback(section.i18nKey.description.replace(/^plugins\./, ''), section.description)
    }
    return section.description
  }, [tWithFallback])
  
  // Local state for input values to ensure immediate UI updates
  const [localInputValues, setLocalInputValues] = React.useState<Record<string, string>>({})
  
  // Sync local state with global state when state changes (but don't override user input)
  // Use ref to track if user is actively typing
  const isTypingRef = React.useRef<Set<string>>(new Set())
  
  React.useEffect(() => {
    if (!metadata) return
    const newValues: Record<string, string> = {}
    // Sync essential configs
    if (metadata.essentialConfigKeysMetadata) {
      metadata.essentialConfigKeysMetadata.forEach((configKey: any) => {
        const value = (state as any)[configKey.key] || ""
        newValues[`essential.${configKey.key}`] = value
      })
    }
    // Sync required fields
    if (metadata.requiredFields) {
      metadata.requiredFields.forEach((field: string) => {
        const value = (state as any)[field] || ""
        newValues[`required.${field}`] = value
      })
    }
    setLocalInputValues(prev => {
      const updated = { ...prev }
      let changed = false
      Object.keys(newValues).forEach(key => {
        const currentLocal = prev[key]
        const newGlobal = newValues[key]
        // Only update if user is not actively typing this field
        if (!isTypingRef.current.has(key)) {
          if (currentLocal !== newGlobal) {
            updated[key] = newGlobal
            changed = true
          }
        }
      })
      return changed ? updated : prev
    })
  }, [state, metadata])
  const [showEssentialConfigs, setShowEssentialConfigs] = useState(false)

  if (!metadata) return null

  const activeSectionCount = state.sections?.length || 0
  const pluginMissingConfigs = missingConfigs.filter(m => m.plugin === plugin.name)
  
  // Use missingConfigs from canonical selector (already filtered by enabled && sections.length > 0)
  const hasMissingRequired = pluginMissingConfigs.length > 0 && state.enabled
  
  // Auto-expand essential configs if missing and enabled
  useEffect(() => {
    if (hasMissingRequired && state.enabled && !isExpanded) {
      setShowEssentialConfigs(true)
    }
  }, [hasMissingRequired, state.enabled, isExpanded])

  const handleToggleExpanded = useCallback(() => {
    onToggleExpanded(plugin.name)
  }, [plugin.name, onToggleExpanded])

  const handleTogglePlugin = useCallback(() => {
    onTogglePlugin(plugin.name)
    // Auto-expand when enabling
    if (!state.enabled) {
      setTimeout(() => onToggleExpanded(plugin.name), 100)
    }
  }, [plugin.name, onTogglePlugin, state.enabled, onToggleExpanded])

  const handleSectionToggle = useCallback((sectionId: string) => {
    // Se plugin não está ativado, ativar primeiro
    if (!state.enabled) {
      onTogglePlugin(plugin.name)
    }
    onToggleSection(plugin.name, sectionId)
  }, [plugin.name, state.enabled, onToggleSection, onTogglePlugin])

  const handleEssentialChange = useCallback((key: string, value: string) => {
    const inputKey = `essential.${key}`
    // Apenas atualizar estado local (sem save)
    setLocalInputValues(prev => ({
      ...prev,
      [inputKey]: value
    }))
    // Atualizar estado global também (para validação/display)
    onEssentialConfigChange(plugin.name, key, value)
  }, [plugin.name, onEssentialConfigChange])
  
  const handleEssentialSave = useCallback(async (key: string) => {
    const inputKey = `essential.${key}`
    const value = localInputValues[inputKey] ?? ((state as any)[key] || "")
    if (!value.trim()) {
      return
    }
    await onEssentialConfigSave(plugin.name, key, value)
  }, [plugin.name, onEssentialConfigSave, localInputValues, state])

  const handleUnlock = useCallback((key: string) => {
    onUnlockConfig(plugin.name, key)
  }, [plugin.name, onUnlockConfig])

  const handleRequiredFieldChange = useCallback((field: string, value: string) => {
    const inputKey = `required.${field}`
    // Mark as typing
    isTypingRef.current.add(inputKey)
    // Update local state immediately for responsive UI
    setLocalInputValues(prev => ({
      ...prev,
      [inputKey]: value
    }))
    // Clear typing flag after debounce
    setTimeout(() => {
      isTypingRef.current.delete(inputKey)
    }, 500)
    // Then update global state
    onSetPluginRequiredField(plugin.name, field, value)
  }, [plugin.name, onSetPluginRequiredField])

  const handleSectionConfigChange = useCallback((sectionId: string, config: any) => {
    onSetSectionConfig(plugin.name, sectionId, config)
  }, [plugin.name, onSetSectionConfig])

  const handleSelectAllSections = useCallback(() => {
    const allSectionIds = metadata.sections.map(s => s.id)
    const currentSections = state.sections || []
    const allSelected = allSectionIds.every(id => currentSections.includes(id))
    
    // Usar onSetPluginSections para atualizar todas de uma vez
    if (allSelected) {
      // Deselect all
      onSetPluginSections(plugin.name, [])
    } else {
      // Select all
      onSetPluginSections(plugin.name, allSectionIds)
    }
  }, [plugin.name, metadata.sections, state.sections, onSetPluginSections])

  const handleToggleEssentialConfigs = useCallback(() => {
    setShowEssentialConfigs(prev => !prev)
  }, [])

  // Check if plugin has essential configs
  const hasEssentialConfigs = metadata.essentialConfigKeysMetadata && metadata.essentialConfigKeysMetadata.length > 0
  
  // Build essentialConfigsList: combine essentialConfigKeysMetadata + requiredFields with metadata from sections
  const essentialConfigsList = hasEssentialConfigs 
    ? metadata.essentialConfigKeysMetadata 
    : metadata.requiredFields.map(field => {
        // Try to find metadata for this field in section configOptions
        let fieldMetadata: any = {
          key: field,
          label: field.replace(/([A-Z])/g, " $1").trim(),
          type: "text" as const,
        }
        
        // Search in all sections for configOptions that match this field
        for (const section of metadata.sections || []) {
          const configOption = section.configOptions?.find((opt: any) => opt.key === field)
          if (configOption) {
            fieldMetadata = {
              ...fieldMetadata,
              label: configOption.label || fieldMetadata.label,
              placeholder: (configOption as any).placeholder,
              description: (configOption as any).description,
              tooltip: (configOption as any).tooltip,
              helpUrl: (configOption as any).helpUrl,
              required: (configOption as any).required,
            }
            break
          }
        }
        
        return fieldMetadata
      })

  const PluginIcon = getPluginIcon(plugin.name)

  return (
    <div className={cn(
      "rounded-lg border bg-card overflow-hidden transition-all",
      state.enabled 
        ? "border-primary/30 shadow-sm shadow-primary/5" 
        : "border-border hover:border-primary/20",
      hasMissingRequired && state.enabled && "border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10"
    )}>
      <div className="p-4">
        {/* Header - Always Visible - Entire row is clickable */}
        <div 
          onClick={handleToggleExpanded}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Icon and Expand Button */}
          <div className="flex items-center gap-2 text-left flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            {PluginIcon ? (
              <PluginIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : null}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-semibold text-foreground">
                {(() => {
                  const meta = metadata as any
                  if (meta.i18nKey?.displayName) {
                    const i18nKey = meta.i18nKey.displayName.replace(/^plugins\./, '')
                    return tWithFallback(i18nKey, metadata.displayName)
                  }
                  return metadata.displayName
                })()}
              </span>
                {state.enabled && (
                  <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                    enabled
                  </Badge>
                )}
                {(() => {
                  const hasOAuth = metadata.essentialConfigKeysMetadata?.some(
                    (keyMeta: { type: string }) => keyMeta.type === "oauth"
                  )
                  // API Key tag should only show for password type (tokens/keys), not text (usernames)
                  const hasApiKey = metadata.essentialConfigKeysMetadata?.some(
                    (keyMeta: { type: string }) => keyMeta.type === "password"
                  )
                  
                  return (
                    <>
                      {hasOAuth && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-[10px] font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                OAuth
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Este plugin requer conexão OAuth</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {hasApiKey && !hasOAuth && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-[10px] font-medium bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                                API Key
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Este plugin requer API Key ou Token</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </>
                  )
                })()}
                {state.enabled && (
                  <PluginConfigStatus
                    pluginName={plugin.name}
                    pluginConfig={state}
                    missingConfigs={missingConfigs}
                    secretsPresence={secretsPresence?.[plugin.name]}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {(() => {
                  const meta = metadata as any
                  if (meta.i18nKey?.description) {
                    const i18nKey = meta.i18nKey.description.replace(/^plugins\./, '')
                    return tWithFallback(i18nKey, metadata.description)
                  }
                  return metadata.description
                })()}
              </p>
            </div>
          
          {/* Plugin Status Indicator - Based on having sections */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTogglePlugin()
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all border flex-shrink-0",
              state.enabled && activeSectionCount > 0
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : state.enabled
                ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:border-primary/30"
            )}
            aria-label={`${state.enabled ? 'Desativar' : 'Ativar'} ${metadata.displayName} plugin`}
          >
            {state.enabled && activeSectionCount > 0 ? (
              <>
                <Check className="h-3 w-3" />
                <span>Ativo ({activeSectionCount})</span>
              </>
            ) : state.enabled ? (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>{t('noSections')}</span>
              </>
            ) : (
              <span>{t('inactive')}</span>
            )}
          </button>
        </div>

        {/* Quick Actions Bar - Show when enabled but NOT expanded (to avoid duplication) */}
        {state.enabled && !isExpanded && (
          <div className="flex items-center justify-between gap-3 mb-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{activeSectionCount}/{metadata.sections.length} seções</span>
              {hasMissingRequired && (
                <span className="text-amber-600 dark:text-amber-500 font-medium">
                  • {pluginMissingConfigs.length} campo{pluginMissingConfigs.length > 1 ? 's' : ''} obrigatório{pluginMissingConfigs.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAllSections}
                className="h-7 text-xs px-2"
                aria-label={metadata.sections.every(s => state.sections?.includes(s.id)) ? t('deselectAllSections') : t('selectAllSections')}
              >
                {metadata.sections.every(s => state.sections?.includes(s.id)) ? t('deselectAll') : t('selectAll')}
              </Button>
            </div>
          </div>
        )}

        {/* Sections Preview - Show when enabled, even if not expanded */}
        {state.enabled && !isExpanded && metadata.sections.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {metadata.sections.slice(0, 4).map((section) => {
                const isSelected = state.sections?.includes(section.id) || false
                const previewImage = getSectionPreview(plugin.name, section.id, style as "default" | "terminal")
                
                return (
                  <TooltipProvider key={section.id} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSectionToggle(section.id)
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border relative group",
                            isSelected
                              ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-primary/20"
                          )}
                          aria-label={`${isSelected ? t('deselectSection') : t('selectSection')} ${getSectionName(section)}`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          <span>{getSectionName(section)}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs p-3">
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{getSectionName(section)}</p>
                          {getSectionDescription(section) && (
                            <p className="text-xs text-muted-foreground">{getSectionDescription(section)}</p>
                          )}
                          {previewImage && (
                            <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                              <img 
                                src={previewImage} 
                                alt={`${getSectionName(section)} ${t('preview')}`}
                                className="w-full h-auto max-h-32 object-contain"
                                onError={(e) => {
                                  // Fallback para placeholder SVG inline
                                  const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#f3f4f6"/><text x="300" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Preview não disponível</text></svg>`)}`
                                  e.currentTarget.src = placeholderSvg
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
              {metadata.sections.length > 4 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleExpanded()
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground border border-border hover:bg-muted hover:border-primary/20 transition-colors"
                  aria-label={`Ver mais ${metadata.sections.length - 4} seções`}
                >
                  +{metadata.sections.length - 4} mais
                </button>
              )}
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-3 space-y-4 pt-3 px-1 border-t border-border">
            {/* Essential configs - Full section when expanded */}
            {hasEssentialConfigs && (
              <div className={cn(
                "space-y-2 p-3 rounded-lg border transition-colors",
                pluginMissingConfigs.length > 0 
                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50" 
                  : "bg-muted/30 border-border"
              )}>
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-xs font-semibold flex items-center gap-2",
                    pluginMissingConfigs.length > 0 
                      ? "text-amber-900 dark:text-amber-200" 
                      : "text-foreground"
                  )}>
                    {pluginMissingConfigs.length > 0 && (
                      <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                    )}
                    {pluginMissingConfigs.length === 0 && (
                      <Zap className="h-3 w-3" />
                    )}
                    Configurações obrigatórias
                  </p>
                  {pluginMissingConfigs.length > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {pluginMissingConfigs.length} faltando
                    </Badge>
                  )}
                </div>
                {metadata.essentialConfigKeysMetadata.map((configKeyMeta) => {
                  const configKey = configKeyMeta as any
                  const configKeyStr = `${plugin.name}.${configKey.key}`
                  const isUnlocked = unlockedConfigs.has(configKeyStr)
                  // Get presence info from secretsPresence (source of truth)
                  const secretPresence = secretsPresence?.[plugin.name]?.[configKey.key]
                  const exists = secretPresence?.exists || false
                  // Get value from local state first (for immediate UI updates), fallback to global state
                  const localValue = localInputValues[`essential.${configKey.key}`]
                  const value = localValue !== undefined ? localValue : ((state as any)[configKey.key] || "")
                  const isSaving = savingConfigs.has(configKeyStr)
                  const isSaved = savedConfigs.has(configKeyStr)
                  const isMissing = pluginMissingConfigs.some(m => m.field === configKey.key)
                  
                  // Get translated label/description/placeholder
                  const configLabel = configKey.i18nKey?.label 
                    ? tWithFallback(configKey.i18nKey.label.replace(/^plugins\./, ''), configKey.label)
                    : configKey.label
                  const configDescription = configKey.description && configKey.i18nKey?.description
                    ? tWithFallback(configKey.i18nKey.description.replace(/^plugins\./, ''), configKey.description)
                    : configKey.description
                  const configPlaceholder = configKey.placeholder && configKey.i18nKey?.placeholder
                    ? tWithFallback(configKey.i18nKey.placeholder.replace(/^plugins\./, ''), configKey.placeholder)
                    : configKey.placeholder

                  if (configKey.type === "oauth") {
                    return (
                      <div key={configKey.key} className="space-y-1">
                        <Label className="text-xs font-medium">{configLabel}</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs justify-start"
                          onClick={() => {
                            const currentPath = window.location.pathname + window.location.search
                            window.location.href = `/api/auth/${configKey.oauthProvider || "spotify"}/authorize?returnTo=${encodeURIComponent(currentPath)}`
                          }}
                        >
                          <Music className="h-3 w-3 mr-2" />
                          Connect {configKey.oauthProvider || "OAuth"} Account
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </Button>
                        {configDescription && (
                          <p className="text-xs text-muted-foreground">{configDescription}</p>
                        )}
                      </div>
                    )
                  }

                  // Get presence info from secretsPresence (already calculated above)
                  const updatedAt = secretPresence?.updatedAt
                  
                  return (
                    <div key={configKey.key} className="space-y-1">
                      <SecretInput
                        plugin={plugin.name}
                        label={configLabel}
                        realValue={value}
                        exists={exists}
                        updatedAt={updatedAt}
                        onChange={(newValue) => handleEssentialChange(configKey.key, newValue)}
                        onSave={() => handleEssentialSave(configKey.key)}
                        onUnlock={() => handleUnlock(configKey.key)}
                        unlocked={isUnlocked}
                        saving={isSaving}
                        saved={isSaved}
                        isMissing={isMissing}
                        helpUrl={configKey.helpUrl}
                        placeholder={configPlaceholder}
                        type={configKey.type === "password" ? "password" : "text"}
                      />
                      {configDescription && (
                        <p className="text-xs text-muted-foreground">{configDescription}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">{configLabel} {t('requiredFields.required')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Required fields (non-sensitive) - Show when there are requiredFields but no essentialConfigs */}
            {!hasEssentialConfigs && metadata.requiredFields.length > 0 && (() => {
              const missingRequiredFields = pluginMissingConfigs.filter(m => 
                (metadata.requiredFields as string[]).includes(m.field)
              )
              const hasMissing = missingRequiredFields.length > 0
              
              return (
              <div key="required-fields" className={cn(
                "space-y-2 p-3 rounded-lg border transition-colors",
                hasMissing
                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50" 
                  : "bg-muted/30 border-border"
              )}>
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-xs font-semibold flex items-center gap-2",
                    hasMissing
                      ? "text-amber-900 dark:text-amber-200" 
                      : "text-foreground"
                  )}>
                    {hasMissing && (
                      <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                    )}
                    {!hasMissing && (
                      <Zap className="h-3 w-3" />
                    )}
                    {t('requiredFields.title')}
                  </p>
                  {hasMissing && (
                    <Badge variant="destructive" className="text-[10px]">
                      {missingRequiredFields.length} {t('missing')}
                    </Badge>
                  )}
                </div>
                {metadata.requiredFields.map((field) => {
                  // Get value from local state first (for immediate UI updates), fallback to global state
                  const localValue = localInputValues[`required.${field}`]
                  const value = localValue !== undefined ? localValue : ((state as any)[field] || "")
                  const isMissing = pluginMissingConfigs.some(m => m.field === field) || (!value || (typeof value === 'string' && !value.trim()))
                  
                  // Try to find metadata for this field in section configOptions
                  let fieldMetadata: any = {
                    key: field,
                    label: field === "username" ? "Duolingo Username" : field.replace(/([A-Z])/g, " $1").trim(),
                    type: "text" as const,
                  }
                  
                  // Search in all sections for configOptions that match this field
                  for (const section of metadata.sections || []) {
                    const configOption = section.configOptions?.find((opt: any) => opt.key === field)
                    if (configOption) {
                      fieldMetadata = {
                        ...fieldMetadata,
                        label: configOption.label || fieldMetadata.label,
                        placeholder: (configOption as any).placeholder,
                        description: (configOption as any).description,
                        tooltip: (configOption as any).tooltip,
                        helpUrl: (configOption as any).helpUrl,
                        required: (configOption as any).required,
                      }
                      break
                    }
                  }
                  
                  return (
                    <div key={field} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className={cn(
                          "text-xs font-medium",
                          isMissing && "text-destructive"
                        )}>
                          {fieldMetadata.label} {isMissing && <span className="text-destructive">*</span>}
                        </Label>
                        {fieldMetadata.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="text-xs">{fieldMetadata.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {fieldMetadata.helpUrl && (
                          <a
                            href={fieldMetadata.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Ajuda para ${fieldMetadata.label}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Input
                        type={
                          field.includes("token") ||
                          field.includes("key") ||
                          field.includes("Token")
                            ? "password"
                            : "text"
                        }
                        className={cn(
                          "h-8 text-xs",
                          isMissing && "border-destructive focus-visible:ring-destructive"
                        )}
                        placeholder={fieldMetadata.placeholder || `Enter ${field}...`}
                        value={value}
                        onChange={(e) => handleRequiredFieldChange(field, e.target.value)}
                        aria-label={fieldMetadata.label}
                        aria-required={isMissing}
                      />
                      {fieldMetadata.description && (
                        <p className="text-xs text-muted-foreground">{fieldMetadata.description}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">{fieldMetadata.label} {t('requiredFields.required')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
              )
            })()}

            {/* Sections - Enhanced with previews */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  {t('availableSections')} ({activeSectionCount}/{metadata.sections.length})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllSections}
                  className="h-7 text-xs"
                  aria-label={metadata.sections.every(s => state.sections?.includes(s.id)) ? t('deselectAllSections') : t('selectAllSections')}
                >
                  {metadata.sections.every(s => state.sections?.includes(s.id)) ? t('deselectAll') : t('selectAll')}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {metadata.sections.map((section) => {
                  const isSelected = state.sections?.includes(section.id) || false
                  const hasConfigs = section.configOptions && section.configOptions.length > 0
                  const sectionConfig = state.sectionConfigs?.[section.id] || {}
                  const previewImage = getSectionPreview(plugin.name, section.id, style as "default" | "terminal")

                  return (
                    <TooltipProvider key={section.id} delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <div
                              onClick={() => handleSectionToggle(section.id)}
                              className={cn(
                                "flex flex-col gap-3 p-4 rounded-lg border cursor-pointer transition-all group h-full min-h-[120px]",
                                isSelected
                                  ? "bg-primary/5 text-primary border-primary/30 shadow-sm"
                                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:border-primary/20"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isSelected}
                                    onChange={() => handleSectionToggle(section.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${isSelected ? t('deselectSection') : t('selectSection')} ${getSectionName(section)}`}
                                  />
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                  <span className="text-sm font-medium">{getSectionName(section)}</span>
                                </div>
                                {hasConfigs && isSelected && (
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <SectionConfigDialog
                                      plugin={plugin.name}
                                      section={section}
                                      sectionConfig={sectionConfig}
                                      onConfigChange={(config) => handleSectionConfigChange(section.id, config)}
                                    />
                                  </div>
                                )}
                              </div>
                              {previewImage && (
                                <div 
                                  className="rounded-md overflow-hidden border border-border bg-background"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSectionToggle(section.id)
                                  }}
                                >
                                  <img 
                                    src={previewImage} 
                                    alt={`${getSectionName(section)} ${t('preview')}`}
                                    className="w-full h-auto max-h-24 object-contain pointer-events-none"
                                    draggable={false}
                                    onError={(e) => {
                                      // Fallback para placeholder SVG inline
                                      const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#f3f4f6"/><text x="300" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Preview não disponível</text></svg>`)}`
                                      e.currentTarget.src = placeholderSvg
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-3">
                          <div className="space-y-2">
                            <p className="font-medium text-sm">{getSectionName(section)}</p>
                            {getSectionDescription(section) && (
                              <p className="text-xs text-muted-foreground">{getSectionDescription(section)}</p>
                            )}
                            {previewImage && (
                              <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                                <img 
                                  src={previewImage} 
                                  alt={`${getSectionName(section)} ${t('preview')}`}
                                  className="w-full h-auto"
                                  onError={(e) => {
                                    // Fallback para placeholder SVG inline
                                    const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#f3f4f6"/><text x="300" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Preview não disponível</text></svg>`)}`
                                    e.currentTarget.src = placeholderSvg
                                  }}
                                />
                              </div>
                            )}
                            {hasConfigs && (
                              <p className="text-xs text-primary mt-1 font-medium">
                                {t('hasConfigurations')}
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
}, (prevProps: PluginCardProps, nextProps: PluginCardProps): boolean => {
  // Custom comparison function for memo
  return (
    prevProps.state.enabled === nextProps.state.enabled &&
    prevProps.state.sections?.length === nextProps.state.sections?.length &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.state.sections?.join(',') === nextProps.state.sections?.join(',') &&
    JSON.stringify(prevProps.state.sectionConfigs) === JSON.stringify(nextProps.state.sectionConfigs) &&
    JSON.stringify(prevProps.essentialConfigs) === JSON.stringify(nextProps.essentialConfigs) &&
    prevProps.expandedPlugins.has(prevProps.plugin.name) === nextProps.expandedPlugins.has(nextProps.plugin.name) &&
    prevProps.unlockedConfigs.size === nextProps.unlockedConfigs.size &&
    prevProps.savingConfigs.size === nextProps.savingConfigs.size &&
    prevProps.savedConfigs.size === nextProps.savedConfigs.size &&
    prevProps.missingConfigs.length === nextProps.missingConfigs.length &&
    prevProps.style === nextProps.style
  )
})

