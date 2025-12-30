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
import type { PluginConfig } from "@/stores/wizard-store"

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
  style: string
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  onToggleExpanded: (pluginName: string) => void
  onTogglePlugin: (pluginName: string) => void
  onToggleSection: (pluginName: string, sectionId: string) => void
  onEssentialConfigChange: (plugin: string, key: string, value: string) => Promise<void>
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
  style,
  missingConfigs,
  onToggleExpanded,
  onTogglePlugin,
  onToggleSection,
  onEssentialConfigChange,
  onUnlockConfig,
  onSetPluginRequiredField,
  onSetSectionConfig,
  onSetPluginSections,
}: PluginCardProps) {
  const metadata = PLUGINS_METADATA[plugin.name as keyof typeof PLUGINS_METADATA]
  
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

  const missingEssential =
    state.enabled &&
    metadata.requiredFields.some((field) => {
      const value = (state as any)[field]
      if (typeof value === 'string') return !value.trim()
      return !value
    })

  const activeSectionCount = state.sections?.length || 0
  const pluginMissingConfigs = missingConfigs.filter(m => m.plugin === plugin.name)
  
  // Verificar também requiredFields ao determinar se está faltando configuração
  const hasMissingRequiredFields = state.enabled && metadata.requiredFields.some((field) => {
    const value = (state as any)[field]
    if (typeof value === 'string') return !value.trim()
    return !value
  })
  
  const hasMissingRequired = (pluginMissingConfigs.length > 0 || hasMissingRequiredFields) && state.enabled
  
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
    // Then update global state (debounced in parent)
    return onEssentialConfigChange(plugin.name, key, value)
  }, [plugin.name, onEssentialConfigChange])

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
                {metadata.displayName}
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
                  return hasOAuth ? (
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
                  ) : null
                })()}
                {state.enabled && (
                  <PluginStatusBadge
                    isValid={!missingEssential && activeSectionCount > 0}
                    hasConfig={!missingEssential}
                    sectionsCount={activeSectionCount}
                    totalSections={metadata.sections.length}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {metadata.description}
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
                <span>Sem seções</span>
              </>
            ) : (
              <span>Inativo</span>
            )}
          </button>
        </div>

        {/* Quick Actions Bar - Show when enabled */}
        {state.enabled && (
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
                aria-label={metadata.sections.every(s => state.sections?.includes(s.id)) ? "Desmarcar todas as seções" : "Selecionar todas as seções"}
              >
                {metadata.sections.every(s => state.sections?.includes(s.id)) ? "Desmarcar todas" : "Selecionar todas"}
              </Button>
            </div>
          </div>
        )}

        {/* Essential Configs Banner - Show when enabled and missing */}
        {state.enabled && hasMissingRequired && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-1">
                  Configuração obrigatória necessária
                </p>
                <button
                  onClick={handleToggleEssentialConfigs}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 font-medium underline"
                  aria-label={showEssentialConfigs ? "Ocultar campos obrigatórios" : "Mostrar campos obrigatórios"}
                >
                  {showEssentialConfigs ? "Ocultar" : "Mostrar"} campos obrigatórios
                </button>
              </div>
            </div>
            
            {showEssentialConfigs && (
              <div className="mt-3 space-y-2 pt-2 border-t border-amber-200 dark:border-amber-900/50">
                {essentialConfigsList.map((configKeyMeta) => {
                  const configKey = configKeyMeta as { key: string; label: string; type: "text" | "password" | "oauth"; placeholder?: string; description?: string; helpUrl?: string; tooltip?: string; oauthProvider?: string }
                  const configKeyStr = `${plugin.name}.${configKey.key}`
                  const isUnlocked = unlockedConfigs.has(configKeyStr)
                  
                  // Get value from local state first (for immediate UI updates), fallback to global state
                  const localValue = localInputValues[`essential.${configKey.key}`]
                  const value = localValue !== undefined ? localValue : ((state as any)[configKey.key] || "")
                  
                  // Check if locked: only lock if value exists AND is marked as configured in DB
                  // Don't lock if value is empty - user should be able to edit empty fields
                  const isConfiguredInDb = essentialConfigs[plugin.name]?.[configKey.key] === true
                  const isConfiguredInState = value && typeof value === 'string' && value.trim().length > 0
                  
                  // Lock only if:
                  // 1. For essentialConfigKeys: configured in DB AND not unlocked
                  // 2. For requiredFields: configured in state AND not unlocked
                  // BUT: Never lock if value is empty (user should be able to edit)
                  const isLocked = !value || value.trim().length === 0
                    ? false // Never lock empty fields
                    : hasEssentialConfigs 
                      ? (isConfiguredInDb && !isUnlocked)
                      : (isConfiguredInState && !isUnlocked)
                  
                  const isSaving = savingConfigs.has(configKeyStr)
                  const isSaved = savedConfigs.has(configKeyStr)
                  
                  // Check if missing: either in missingConfigs OR not configured in state (for requiredFields)
                  const isMissingInEssential = pluginMissingConfigs.some(m => m.field === configKey.key)
                  const isMissingInState = !hasEssentialConfigs && (!value || (typeof value === 'string' && !value.trim()))
                  const isMissing = isMissingInEssential || isMissingInState

                  if (configKey.type === "oauth") {
                    return (
                      <div key={configKey.key} className="space-y-1">
                        <Label className="text-xs font-medium">{configKey.label}</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs justify-start border-amber-300 dark:border-amber-800"
                          onClick={() => {
                            const currentPath = window.location.pathname + window.location.search
                            window.location.href = `/api/auth/${configKey.oauthProvider || "spotify"}/authorize?returnTo=${encodeURIComponent(currentPath)}`
                          }}
                        >
                          <Music className="h-3 w-3 mr-2" />
                          Connect {configKey.oauthProvider || "OAuth"} Account
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </Button>
                        {configKey.description && (
                          <p className="text-xs text-muted-foreground">{configKey.description}</p>
                        )}
                      </div>
                    )
                  }

                  return (
                    <div key={configKey.key} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className={cn(
                          "text-xs font-medium",
                          isMissing && "text-amber-900 dark:text-amber-200"
                        )}>
                          {configKey.label} {isMissing && <span className="text-destructive">*</span>}
                        </Label>
                        {configKey.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="text-xs">{configKey.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {configKey.helpUrl && (
                          <a
                            href={configKey.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Ajuda para ${configKey.label}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={configKey.type}
                            className={cn(
                              "h-8 text-xs pr-8",
                              isLocked && "bg-muted/50 text-muted-foreground italic cursor-not-allowed",
                              isMissing && "border-amber-400 dark:border-amber-700 focus-visible:ring-amber-500"
                            )}
                            placeholder={configKey.placeholder || `Enter ${configKey.key}...`}
                            value={isLocked ? "**** locked" : value}
                            disabled={isLocked || isSaving}
                            onChange={(e) => handleEssentialChange(configKey.key, e.target.value)}
                            aria-label={configKey.label}
                            aria-required={isMissing}
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
                            onClick={() => handleUnlock(configKey.key)}
                            className="h-8 text-xs"
                            aria-label={`Desbloquear ${configKey.label}`}
                          >
                            <Unlock className="h-3 w-3 mr-1" />
                            Unlock
                          </Button>
                        )}
                      </div>
                      {configKey.description && (
                        <p className="text-xs text-muted-foreground">{configKey.description}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">{configKey.label} é obrigatório</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
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
                          aria-label={`${isSelected ? 'Desmarcar' : 'Selecionar'} seção ${section.name}`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          <span>{section.name}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs p-3">
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{section.name}</p>
                          {section.description && (
                            <p className="text-xs text-muted-foreground">{section.description}</p>
                          )}
                          {previewImage && (
                            <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                              <img 
                                src={previewImage} 
                                alt={`${section.name} preview`}
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    Configurações obrigatórias
                  </p>
                  {pluginMissingConfigs.length > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {pluginMissingConfigs.length} faltando
                    </Badge>
                  )}
                </div>
                {metadata.essentialConfigKeysMetadata.map((configKeyMeta) => {
                  const configKey = configKeyMeta as { key: string; label: string; type: "text" | "password" | "oauth"; placeholder?: string; description?: string; helpUrl?: string; tooltip?: string; oauthProvider?: string }
                  const configKeyStr = `${plugin.name}.${configKey.key}`
                  const isUnlocked = unlockedConfigs.has(configKeyStr)
                  const isLocked = essentialConfigs[plugin.name]?.[configKey.key] === true && !isUnlocked
                  // Get value from local state first (for immediate UI updates), fallback to global state
                  const localValue = localInputValues[`essential.${configKey.key}`]
                  const value = localValue !== undefined ? localValue : ((state as any)[configKey.key] || "")
                  const isSaving = savingConfigs.has(configKeyStr)
                  const isSaved = savedConfigs.has(configKeyStr)
                  const isMissing = pluginMissingConfigs.some(m => m.field === configKey.key)

                  if (configKey.type === "oauth") {
                    return (
                      <div key={configKey.key} className="space-y-1">
                        <Label className="text-xs font-medium">{configKey.label}</Label>
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
                        {configKey.description && (
                          <p className="text-xs text-muted-foreground">{configKey.description}</p>
                        )}
                      </div>
                    )
                  }

                  return (
                    <div key={configKey.key} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className={cn(
                          "text-xs font-medium",
                          isMissing && "text-destructive"
                        )}>
                          {configKey.label}
                        </Label>
                        {configKey.helpUrl && (
                          <a
                            href={configKey.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Ajuda para ${configKey.label}`}
                          >
                            <HelpCircle className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={configKey.type}
                            className={cn(
                              "h-8 text-xs pr-8",
                              isLocked && "bg-muted/50 text-muted-foreground italic cursor-not-allowed",
                              isMissing && "border-destructive focus-visible:ring-destructive"
                            )}
                            placeholder={configKey.placeholder || `Enter ${configKey.key}...`}
                            value={isLocked ? "**** locked" : value}
                            disabled={isLocked || isSaving}
                            onChange={(e) => handleEssentialChange(configKey.key, e.target.value)}
                            aria-label={configKey.label}
                            aria-required={isMissing}
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
                            onClick={() => handleUnlock(configKey.key)}
                            className="h-8 text-xs"
                            aria-label={`Desbloquear ${configKey.label}`}
                          >
                            <Unlock className="h-3 w-3 mr-1" />
                            Unlock
                          </Button>
                        )}
                      </div>
                      {configKey.description && (
                        <p className="text-xs text-muted-foreground">{configKey.description}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">{configKey.label} é obrigatório</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Required fields (fallback) - This should not appear if essentialConfigsList is used */}
            {(!hasEssentialConfigs && essentialConfigsList.length === 0) && metadata.requiredFields.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Required for data fetching
                </p>
                {metadata.requiredFields.map((field) => {
                  // Get value from local state first (for immediate UI updates), fallback to global state
                  const localValue = localInputValues[`required.${field}`]
                  const value = localValue !== undefined ? localValue : ((state as any)[field] || "")
                  const isMissing = pluginMissingConfigs.some(m => m.field === field) || (!value || (typeof value === 'string' && !value.trim()))
                  
                  // Try to find metadata for this field in section configOptions
                  let fieldMetadata: any = {}
                  for (const section of metadata.sections || []) {
                    const configOption = section.configOptions?.find((opt: any) => opt.key === field)
                    if (configOption) {
                      fieldMetadata = configOption
                      break
                    }
                  }
                  
                  return (
                    <div key={field} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className={cn(
                          "text-xs font-medium capitalize",
                          isMissing && "text-destructive"
                        )}>
                          {fieldMetadata.label || field.replace(/([A-Z])/g, " $1").trim()} {isMissing && <span className="text-destructive">*</span>}
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
                            aria-label={`Ajuda para ${fieldMetadata.label || field}`}
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
                        aria-label={fieldMetadata.label || field}
                        aria-required={isMissing}
                      />
                      {fieldMetadata.description && (
                        <p className="text-xs text-muted-foreground">{fieldMetadata.description}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">{fieldMetadata.label || field} é obrigatório</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Sections - Enhanced with previews */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Seções disponíveis ({activeSectionCount}/{metadata.sections.length})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllSections}
                  className="h-7 text-xs"
                  aria-label={metadata.sections.every(s => state.sections?.includes(s.id)) ? "Desmarcar todas as seções" : "Selecionar todas as seções"}
                >
                  {metadata.sections.every(s => state.sections?.includes(s.id)) ? "Desmarcar todas" : "Selecionar todas"}
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
                                    aria-label={`${isSelected ? 'Desmarcar' : 'Selecionar'} seção ${section.name}`}
                                  />
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                  <span className="text-sm font-medium">{section.name}</span>
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
                                    alt={`${section.name} preview`}
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
                            <p className="font-medium text-sm">{section.name}</p>
                            {section.description && (
                              <p className="text-xs text-muted-foreground">{section.description}</p>
                            )}
                            {previewImage && (
                              <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                                <img 
                                  src={previewImage} 
                                  alt={`${section.name} preview`}
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
}, (prevProps: PluginCardProps, nextProps: PluginCardProps): boolean => {
  // Custom comparison function for memo
  return (
    prevProps.state.enabled === nextProps.state.enabled &&
    prevProps.state.sections?.length === nextProps.state.sections?.length &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.state.sections?.join(',') === nextProps.state.sections?.join(',') &&
    JSON.stringify(prevProps.essentialConfigs) === JSON.stringify(nextProps.essentialConfigs) &&
    prevProps.expandedPlugins.has(prevProps.plugin.name) === nextProps.expandedPlugins.has(nextProps.plugin.name) &&
    prevProps.unlockedConfigs.size === nextProps.unlockedConfigs.size &&
    prevProps.savingConfigs.size === nextProps.savingConfigs.size &&
    prevProps.savedConfigs.size === nextProps.savedConfigs.size &&
    prevProps.missingConfigs.length === nextProps.missingConfigs.length &&
    prevProps.style === nextProps.style
  )
})

