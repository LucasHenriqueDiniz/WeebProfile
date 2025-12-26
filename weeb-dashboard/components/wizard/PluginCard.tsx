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
import { PLUGINS_DATA } from "@/lib/plugins-data"
import { AlertCircle, ChevronDown, ChevronRight, Check, Lock, Unlock, Settings, Loader2, CheckCircle2, Music, HelpCircle, ExternalLink } from "lucide-react"
import React, { useCallback } from "react"
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
}: PluginCardProps) {
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

  const handleToggleExpanded = useCallback(() => {
    onToggleExpanded(plugin.name)
  }, [plugin.name, onToggleExpanded])

  const handleTogglePlugin = useCallback(() => {
    onTogglePlugin(plugin.name)
  }, [plugin.name, onTogglePlugin])

  const handleSectionToggle = useCallback((sectionId: string) => {
    onToggleSection(plugin.name, sectionId)
  }, [plugin.name, onToggleSection])

  const handleEssentialChange = useCallback((key: string, value: string) => {
    return onEssentialConfigChange(plugin.name, key, value)
  }, [plugin.name, onEssentialConfigChange])

  const handleUnlock = useCallback((key: string) => {
    onUnlockConfig(plugin.name, key)
  }, [plugin.name, onUnlockConfig])

  const handleRequiredFieldChange = useCallback((field: string, value: string) => {
    onSetPluginRequiredField(plugin.name, field, value)
  }, [plugin.name, onSetPluginRequiredField])

  const handleSectionConfigChange = useCallback((sectionId: string, config: any) => {
    onSetSectionConfig(plugin.name, sectionId, config)
  }, [plugin.name, onSetSectionConfig])

  const pluginMissingConfigs = missingConfigs.filter(m => m.plugin === plugin.name)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <button
            onClick={handleToggleExpanded}
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
                {/* UX 3: Improved validation badge */}
                {state.enabled && (
                  <PluginStatusBadge
                    isValid={!missingEssential && activeSectionCount > 0}
                    hasConfig={!missingEssential}
                    sectionsCount={activeSectionCount}
                    totalSections={metadata.sections.length}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pluginData.description}
              </p>
              {/* Inline validation errors */}
              {pluginMissingConfigs.length > 0 && state.enabled && (
                <div className="mt-1 space-y-0.5">
                  {pluginMissingConfigs.map((missing, idx) => (
                    <p key={idx} className="text-xs text-destructive">
                      {missing.label} é obrigatório
                    </p>
                  ))}
                </div>
              )}
            </div>
          </button>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={state.enabled}
              onChange={handleTogglePlugin}
            />
            <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-purple-600"></div>
          </label>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 pt-3 border-t border-border">
            {/* Essential configs */}
            {metadata.essentialConfigKeysMetadata && metadata.essentialConfigKeysMetadata.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Required for data fetching
                </p>
                {metadata.essentialConfigKeysMetadata.map((configKeyMeta) => {
                  const configKey = configKeyMeta as { key: string; label: string; type: "text" | "password" | "oauth"; placeholder?: string; description?: string; helpUrl?: string; tooltip?: string; oauthProvider?: string }
                  const configKeyStr = `${plugin.name}.${configKey.key}`
                  const isUnlocked = unlockedConfigs.has(configKeyStr)
                  const isLocked = essentialConfigs[plugin.name]?.[configKey.key] === true && !isUnlocked
                  const value = (state as any)[configKey.key] || ""
                  const isSaving = savingConfigs.has(configKeyStr)
                  const isSaved = savedConfigs.has(configKeyStr)

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
                      <Label className="text-xs font-medium">{configKey.label}</Label>
                      <div className="flex items-center gap-2">
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
                            onChange={(e) => handleEssentialChange(configKey.key, e.target.value)}
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
                          >
                            <Unlock className="h-3 w-3 mr-1" />
                            Unlock
                          </Button>
                        )}
                      </div>
                      {configKey.description && (
                        <p className="text-xs text-muted-foreground">{configKey.description}</p>
                      )}
                      {/* Validation error for this field */}
                      {pluginMissingConfigs.some(m => m.field === configKey.key) && (
                        <p className="text-xs text-destructive">{configKey.label} é obrigatório</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Required fields (fallback) */}
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
                        onChange={(e) => handleRequiredFieldChange(field, e.target.value)}
                      />
                      {/* Validation error for this field */}
                      {pluginMissingConfigs.some(m => m.field === field) && (
                        <p className="text-xs text-destructive">{field} é obrigatório</p>
                      )}
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
                                onChange={() => handleSectionToggle(section.id)}
                              />
                              {isSelected && <Check className="h-3 w-3" />}
                              <span>{section.name}</span>
                              {hasConfigs && isSelected && (
                                <span className="ml-1">
                                  <SectionConfigDialog
                                    plugin={plugin.name}
                                    section={section}
                                    sectionConfig={sectionConfig}
                                    onConfigChange={(config) => handleSectionConfigChange(section.id, config)}
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
                              const previewImage = getSectionPreview(plugin.name, section.id, style as "default" | "terminal")
                              if (previewImage) {
                                return (
                                  <div className="mt-2 rounded-md overflow-hidden border border-border bg-background">
                                    <img 
                                      src={previewImage} 
                                      alt={`${section.name} preview`}
                                      className="w-full h-auto"
                                      onError={(e) => {
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
}, (prevProps, nextProps) => {
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
    prevProps.missingConfigs.length === nextProps.missingConfigs.length
  )
})

