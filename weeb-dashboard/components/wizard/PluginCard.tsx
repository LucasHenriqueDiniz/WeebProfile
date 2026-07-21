"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { getPluginIcon } from "@/lib/plugin-icons"
import { AlertCircle, Check, Music, HelpCircle, ExternalLink, Sparkles, Zap } from "lucide-react"
import React, { useCallback, useState } from "react"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { cn } from "@/lib/utils"
import { getSectionPreview } from "@/lib/config/section-previews"
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
  unlockedConfigs: Set<string>
  savingConfigs: Set<string>
  savedConfigs: Set<string>
  essentialConfigs: Record<string, Record<string, any>>
  secretsPresence?: Record<string, Record<string, { exists: boolean; updatedAt?: string }>>
  style: string
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  onTogglePlugin: (pluginName: string) => void
  onToggleSection: (pluginName: string, sectionId: string) => void
  onEssentialConfigChange: (plugin: string, key: string, value: string) => void // Apenas atualiza estado local
  onEssentialConfigSave: (plugin: string, key: string, value: string) => Promise<void> // Salva no servidor
  onUnlockConfig: (plugin: string, key: string) => void
  onSetPluginRequiredField: (plugin: string, field: string, value: string) => void
  onSetSectionConfig: (plugin: string, sectionId: string, config: any) => void
  onSetPluginSections: (plugin: string, sections: string[]) => void
}

// Painel de detalhe de UM plugin - nao e mais um item de accordion dentro de uma lista.
// Sempre mostra o conteudo completo (sem chevron/colapso): quem decide o que aparece aqui
// e o painel de lista ao lado, selecionando qual plugin fica "aberto" neste componente.
export const PluginCard = React.memo(
  function PluginCard({
    plugin,
    state,
    unlockedConfigs,
    savingConfigs,
    savedConfigs,
    essentialConfigs: _essentialConfigs,
    secretsPresence,
    style,
    missingConfigs,
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
    const t = useTranslations("wizard.plugins")

    const getSectionName = useCallback(
      (section: any) => {
        if (section.i18nKey?.name) {
          return tWithFallback(section.i18nKey.name.replace(/^plugins\./, ""), section.name)
        }
        return section.name
      },
      [tWithFallback]
    )

    const getSectionDescription = useCallback(
      (section: any) => {
        if (!section.description) return undefined
        if (section.i18nKey?.description) {
          return tWithFallback(section.i18nKey.description.replace(/^plugins\./, ""), section.description)
        }
        return section.description
      },
      [tWithFallback]
    )

    // Local state for input values to ensure immediate UI updates
    const [localInputValues, setLocalInputValues] = React.useState<Record<string, string>>({})
    const isTypingRef = React.useRef<Set<string>>(new Set())

    React.useEffect(() => {
      if (!metadata) return
      const newValues: Record<string, string> = {}
      if (metadata.essentialConfigKeysMetadata) {
        metadata.essentialConfigKeysMetadata.forEach((configKey: any) => {
          const value = (state as any)[configKey.key] || ""
          newValues[`essential.${configKey.key}`] = value
        })
      }
      if (metadata.requiredFields) {
        metadata.requiredFields.forEach((field: string) => {
          const value = (state as any)[field] || ""
          newValues[`required.${field}`] = value
        })
      }
      setLocalInputValues((prev) => {
        const updated = { ...prev }
        let changed = false
        Object.keys(newValues).forEach((key) => {
          const currentLocal = prev[key]
          const newGlobal = newValues[key]
          if (!isTypingRef.current.has(key)) {
            if (currentLocal !== newGlobal) {
              updated[key] = newGlobal
              changed = true
            }
          }
        })
        return changed ? updated : prev
      })
      // plugin.name reseta o estado local ao trocar de plugin selecionado
    }, [state, metadata, plugin.name])

    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
    const handleFieldBlur = useCallback((field: string) => {
      setTouchedFields((prev) => (prev.has(field) ? prev : new Set(prev).add(field)))
    }, [])

    const activeSectionCount = state.sections?.length || 0
    const pluginMissingConfigs = missingConfigs.filter((m) => m.plugin === plugin.name)

    const handleTogglePlugin = useCallback(() => {
      onTogglePlugin(plugin.name)
    }, [plugin.name, onTogglePlugin])

    const handleSectionToggle = useCallback(
      (sectionId: string) => {
        if (!state.enabled) {
          onTogglePlugin(plugin.name)
        }
        onToggleSection(plugin.name, sectionId)
      },
      [plugin.name, state.enabled, onToggleSection, onTogglePlugin]
    )

    const handleEssentialChange = useCallback(
      (key: string, value: string) => {
        const inputKey = `essential.${key}`
        setLocalInputValues((prev) => ({ ...prev, [inputKey]: value }))
        onEssentialConfigChange(plugin.name, key, value)
      },
      [plugin.name, onEssentialConfigChange]
    )

    const handleEssentialSave = useCallback(
      async (key: string) => {
        const inputKey = `essential.${key}`
        const value = localInputValues[inputKey] ?? ((state as any)[key] || "")
        if (!value.trim()) return
        await onEssentialConfigSave(plugin.name, key, value)
      },
      [plugin.name, onEssentialConfigSave, localInputValues, state]
    )

    const handleUnlock = useCallback(
      (key: string) => {
        onUnlockConfig(plugin.name, key)
      },
      [plugin.name, onUnlockConfig]
    )

    const handleRequiredFieldChange = useCallback(
      (field: string, value: string) => {
        const inputKey = `required.${field}`
        isTypingRef.current.add(inputKey)
        setLocalInputValues((prev) => ({ ...prev, [inputKey]: value }))
        setTimeout(() => {
          isTypingRef.current.delete(inputKey)
        }, 500)
        onSetPluginRequiredField(plugin.name, field, value)
      },
      [plugin.name, onSetPluginRequiredField]
    )

    const handleSectionConfigChange = useCallback(
      (sectionId: string, config: any) => {
        onSetSectionConfig(plugin.name, sectionId, config)
      },
      [plugin.name, onSetSectionConfig]
    )

    const handleSelectAllSections = useCallback(() => {
      const allSectionIds = metadata?.sections.map((s) => s.id) ?? []
      const currentSections = state.sections || []
      const allSelected = allSectionIds.every((id) => currentSections.includes(id))
      if (allSelected) {
        onSetPluginSections(plugin.name, [])
      } else {
        onSetPluginSections(plugin.name, allSectionIds)
      }
    }, [plugin.name, metadata?.sections, state.sections, onSetPluginSections])

    if (!metadata) return null

    const hasEssentialConfigs = metadata.essentialConfigKeysMetadata && metadata.essentialConfigKeysMetadata.length > 0

    const PluginIcon = getPluginIcon(plugin.name)
    const displayName = (() => {
      const meta = metadata as any
      if (meta.i18nKey?.displayName) {
        return tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), metadata.displayName)
      }
      return metadata.displayName
    })()
    const description = (() => {
      const meta = metadata as any
      if (meta.i18nKey?.description) {
        return tWithFallback(meta.i18nKey.description.replace(/^plugins\./, ""), metadata.description)
      }
      return metadata.description
    })()

    return (
      <div className="space-y-5">
        {/* Cabecalho do plugin selecionado */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {PluginIcon && <PluginIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-foreground">{displayName}</h2>
                {state.enabled && (
                  <PluginConfigStatus
                    pluginName={plugin.name}
                    pluginConfig={state}
                    missingConfigs={missingConfigs}
                    secretsPresence={secretsPresence?.[plugin.name]}
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>

          <button
            onClick={handleTogglePlugin}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
              state.enabled
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:border-primary/30"
            )}
            aria-label={`${state.enabled ? "Desativar" : "Ativar"} ${displayName} plugin`}
          >
            {state.enabled ? <Check className="h-3 w-3" /> : null}
            <span>{state.enabled ? t("active") : t("inactive")}</span>
          </button>
        </div>

        {/* Essential configs */}
        {hasEssentialConfigs && (
          <div
            className={cn(
              "space-y-2.5 p-3.5 rounded-lg border transition-colors",
              pluginMissingConfigs.length > 0
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                : "bg-muted/30 border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "text-xs font-semibold flex items-center gap-2",
                  pluginMissingConfigs.length > 0 ? "text-amber-900 dark:text-amber-200" : "text-foreground"
                )}
              >
                {pluginMissingConfigs.length > 0 ? (
                  <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                ) : (
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
              const secretPresence = secretsPresence?.[plugin.name]?.[configKey.key]
              const exists = secretPresence?.exists || false
              const localValue = localInputValues[`essential.${configKey.key}`]
              const value = localValue !== undefined ? localValue : (state as any)[configKey.key] || ""
              const isSaving = savingConfigs.has(configKeyStr)
              const isSaved = savedConfigs.has(configKeyStr)
              const isMissing = pluginMissingConfigs.some((m) => m.field === configKey.key)

              const configLabel = configKey.i18nKey?.label
                ? tWithFallback(configKey.i18nKey.label.replace(/^plugins\./, ""), configKey.label)
                : configKey.label
              const configDescription =
                configKey.description && configKey.i18nKey?.description
                  ? tWithFallback(configKey.i18nKey.description.replace(/^plugins\./, ""), configKey.description)
                  : configKey.description
              const configPlaceholder =
                configKey.placeholder && configKey.i18nKey?.placeholder
                  ? tWithFallback(configKey.i18nKey.placeholder.replace(/^plugins\./, ""), configKey.placeholder)
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
                    {configDescription && <p className="text-xs text-muted-foreground">{configDescription}</p>}
                  </div>
                )
              }

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
                  {configDescription && <p className="text-xs text-muted-foreground">{configDescription}</p>}
                  {isMissing && (
                    <p className="text-xs text-destructive font-medium">
                      {configLabel} {t("requiredFields.required")}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Required fields (non-sensitive) */}
        {!hasEssentialConfigs &&
          metadata.requiredFields.length > 0 &&
          (() => {
            const missingRequiredFields = pluginMissingConfigs.filter((m) =>
              (metadata.requiredFields as string[]).includes(m.field)
            )
            const hasMissing = missingRequiredFields.length > 0

            return (
              <div
                key="required-fields"
                className={cn(
                  "space-y-2.5 p-3.5 rounded-lg border transition-colors",
                  hasMissing
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                    : "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs font-semibold flex items-center gap-2",
                      hasMissing ? "text-amber-900 dark:text-amber-200" : "text-foreground"
                    )}
                  >
                    {hasMissing ? (
                      <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                    ) : (
                      <Zap className="h-3 w-3" />
                    )}
                    {t("requiredFields.title")}
                  </p>
                  {hasMissing && (
                    <Badge variant="destructive" className="text-[10px]">
                      {missingRequiredFields.length} {t("missing")}
                    </Badge>
                  )}
                </div>
                {metadata.requiredFields.map((field) => {
                  const localValue = localInputValues[`required.${field}`]
                  const value = localValue !== undefined ? localValue : (state as any)[field] || ""
                  const isEmpty = !value || (typeof value === "string" && !value.trim())
                  const isMissing =
                    touchedFields.has(field) && (pluginMissingConfigs.some((m) => m.field === field) || isEmpty)

                  // Label generico baseado no nome do plugin - antes havia um caso
                  // hardcoded ("username" -> "Duolingo Username") que rotulava
                  // incorretamente QUALQUER outro plugin com campo "username"
                  // (Codeforces, Codewars, etc.) como se fosse o Duolingo.
                  let fieldMetadata: any = {
                    key: field,
                    label: field === "username" ? `${metadata.displayName} Username` : field.replace(/([A-Z])/g, " $1").trim(),
                    type: "text" as const,
                  }

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
                        <Label className={cn("text-xs font-medium", isMissing && "text-destructive")}>
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
                            aria-label={`Ajuda para ${fieldMetadata.label}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Input
                        type={
                          field.includes("token") || field.includes("key") || field.includes("Token")
                            ? "password"
                            : "text"
                        }
                        className={cn("h-9 text-sm", isMissing && "border-destructive focus-visible:ring-destructive")}
                        placeholder={fieldMetadata.placeholder || `Enter ${field}...`}
                        value={value}
                        onChange={(e) => handleRequiredFieldChange(field, e.target.value)}
                        onBlur={() => handleFieldBlur(field)}
                        aria-label={fieldMetadata.label}
                        aria-required={isMissing}
                      />
                      {fieldMetadata.description && (
                        <p className="text-xs text-muted-foreground">{fieldMetadata.description}</p>
                      )}
                      {isMissing && (
                        <p className="text-xs text-destructive font-medium">
                          {fieldMetadata.label} {t("requiredFields.required")}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}

        {/* Sections */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              {t("availableSections")} ({activeSectionCount}/{metadata.sections.length})
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllSections}
              className="h-7 text-xs"
              aria-label={
                metadata.sections.every((s) => state.sections?.includes(s.id))
                  ? t("deselectAllSections")
                  : t("selectAllSections")
              }
            >
              {metadata.sections.every((s) => state.sections?.includes(s.id)) ? t("deselectAll") : t("selectAll")}
            </Button>
          </div>
          {/* Duas colunas quando ha espaco (painel central agora e largo o suficiente),
              uma coluna em telas menores - nao 4 mini-cards espremidos. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metadata.sections.map((section) => {
              const isSelected = section && (state.sections?.includes(section.id) || false)
              const hasConfigs = section.configOptions && section.configOptions.length > 0
              const sectionConfig = state.sectionConfigs?.[section.id] || {}
              const previewImage = getSectionPreview(plugin.name, section.id, style as "default" | "terminal")

              return (
                <div
                  key={section.id}
                  onClick={() => handleSectionToggle(section.id)}
                  className={cn(
                    "flex flex-col gap-2.5 p-3 rounded-lg border cursor-pointer transition-all group",
                    isSelected
                      ? "bg-primary/5 text-primary border-primary/30"
                      : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSectionToggle(section.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${isSelected ? t("deselectSection") : t("selectSection")} ${getSectionName(section)}`}
                      />
                      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                      <span className="text-sm font-medium truncate">{getSectionName(section)}</span>
                    </div>
                    {hasConfigs && isSelected && (
                      <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <SectionConfigDialog
                          plugin={plugin.name}
                          section={section}
                          sectionConfig={sectionConfig}
                          onConfigChange={(config) => handleSectionConfigChange(section.id, config)}
                        />
                      </div>
                    )}
                  </div>
                  {getSectionDescription(section) && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{getSectionDescription(section)}</p>
                  )}
                  {previewImage && (
                    <div
                      className="rounded-md overflow-hidden border border-border bg-background aspect-video"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSectionToggle(section.id)
                      }}
                    >
                      <img
                        src={previewImage}
                        alt={`${getSectionName(section)} ${t("preview")}`}
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                        onError={(e) => {
                          const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="300" fill="#f3f4f6"/><text x="300" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Preview não disponível</text></svg>`)}`
                          e.currentTarget.src = placeholderSvg
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
  (prevProps: PluginCardProps, nextProps: PluginCardProps): boolean => {
    return (
      prevProps.plugin.name === nextProps.plugin.name &&
      prevProps.state.enabled === nextProps.state.enabled &&
      prevProps.state.sections?.length === nextProps.state.sections?.length &&
      prevProps.state.sections?.join(",") === nextProps.state.sections?.join(",") &&
      JSON.stringify(prevProps.state.sectionConfigs) === JSON.stringify(nextProps.state.sectionConfigs) &&
      JSON.stringify(prevProps.essentialConfigs) === JSON.stringify(nextProps.essentialConfigs) &&
      prevProps.unlockedConfigs.size === nextProps.unlockedConfigs.size &&
      prevProps.savingConfigs.size === nextProps.savingConfigs.size &&
      prevProps.savedConfigs.size === nextProps.savedConfigs.size &&
      prevProps.missingConfigs.length === nextProps.missingConfigs.length &&
      prevProps.style === nextProps.style
    )
  }
)
