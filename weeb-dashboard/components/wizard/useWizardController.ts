/**
 * Wizard Controller Hook
 * 
 * Extracts all business logic from Wizard component.
 * Returns computed values, handlers, and props for child components.
 */

import { useRouter } from "next/navigation"
import { useMemo, useState, useCallback, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWizardStore } from "@/stores/wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { useWizardUIState } from "@/hooks/useWizardUIState"
import { selectEnabledPluginNames, selectPluginsWithSections, selectTotalSections, selectMissingConfigs } from "@/stores/wizard-selectors"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ApiException, svgApi } from "@/lib/api"
import { debugWizard } from "@/lib/debug"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

interface UseWizardControllerProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function useWizardController({ isEditMode = false, editSvgId }: UseWizardControllerProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const hasResetRef = useRef(false)

  // UX 2: Use persisted UI state for activeTab
  const { activeTab, setActiveTab } = useWizardUIState()

  const {
    name,
    slug,
    plugins,
    pluginsOrder,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    hideTerminalCommand,
    customCss,
    customThemeColors,
    setBasicInfo,
    reset,
    resetForEdit,
  } = useWizardStore()

  // Reset store when entering edit mode to avoid loading persisted data
  // This must happen before any data loading
  useEffect(() => {
    if (isEditMode && !hasResetRef.current) {
      resetForEdit() // Use edit mode reset (no plugins enabled by default)
      hasResetRef.current = true
    }
  }, [isEditMode, resetForEdit])

  // Reset store when entering edit mode to avoid loading persisted data
  useEffect(() => {
    if (isEditMode) {
      reset()
    }
  }, [isEditMode, reset])

  // Computed values using canonical selectors
  const enabledPlugins = useMemo(() => {
    const enabled = selectEnabledPluginNames({ plugins, pluginsOrder })
    debugWizard('Enabled plugins:', enabled)
    return enabled
  }, [plugins, pluginsOrder])

  const totalSections = useMemo(() => {
    return selectTotalSections({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  const pluginsWithSections = useMemo(() => {
    return selectPluginsWithSections({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  // Get secrets presence from bootstrap store (no fetching here)
  const { missingSecrets: bootstrapMissingSecrets } = useWizardBootstrapStore()

  // Missing configs validation - use canonical selector that espelha backend criteria
  const missingConfigs = useMemo(() => {
    return selectMissingConfigs(
      { plugins, pluginsOrder },
      { missingSecrets: bootstrapMissingSecrets }
    )
  }, [plugins, pluginsOrder, bootstrapMissingSecrets])

  const hasMissingEssential = missingConfigs.length > 0

  // Handle finish/create
  const handleFinish = async () => {
    // Check if there are missing configs
    if (hasMissingEssential) {
      toast({
        title: "Configuração incompleta",
        description: "Por favor, preencha todos os campos obrigatórios dos plugins habilitados",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // 1. Build plugins_config (only plugin-specific configs: enabled, sections, username, requiredFields)
      const svgPluginsConfig: Record<string, any> = {}

      // Only include enabled plugins with sections in config
      pluginsOrder.forEach((pluginName) => {
        const plugin = plugins[pluginName]
        // Only include if enabled AND has sections
        if (plugin?.enabled && plugin.sections && plugin.sections.length > 0) {
          const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
          
          // Build plugin config with all non-sensitive fields
          const pluginConfig: Record<string, any> = {
            enabled: true,
            sections: plugin.sections,
          }

          // Add username if exists
          if (plugin.username) {
            pluginConfig.username = plugin.username
          }

          // Add other requiredFields (non-sensitive) if they exist
          if (metadata?.requiredFields) {
            metadata.requiredFields.forEach((field: string) => {
              const value = (plugin as any)[field]
              if (value && typeof value === 'string' && value.trim()) {
                pluginConfig[field] = value.trim()
              }
            })
          }

          // Add sectionConfigs if they exist - only include configs for active sections
          if (plugin.sectionConfigs && Object.keys(plugin.sectionConfigs).length > 0) {
            const activeSectionConfigs: Record<string, any> = {}
            // Only include sectionConfigs for sections that are actually enabled
            plugin.sections.forEach((sectionName) => {
              if (plugin.sectionConfigs[sectionName]) {
                activeSectionConfigs[sectionName] = plugin.sectionConfigs[sectionName]
              }
            })
            // Only add if there are active section configs
            if (Object.keys(activeSectionConfigs).length > 0) {
              pluginConfig.sectionConfigs = activeSectionConfigs
            }
          }

          svgPluginsConfig[pluginName] = pluginConfig
        }
      })

      // 2. Build ui_config (only global flags: hideTerminal*, customThemeColors)
      const uiConfig = setTerminalConfigs(
        {},
        {
          hideTerminalEmojis,
          hideTerminalHeader,
          hideTerminalCommand,
        }
      )

      // Add customThemeColors if theme is custom
      if (theme === "custom" && Object.keys(customThemeColors).length > 0) {
        uiConfig.customThemeColors = customThemeColors
      }

      // Validate that at least one enabled plugin has sections before creating
      if (pluginsWithSections.length === 0) {
        toast({
          title: "Configuração inválida",
          description: "Pelo menos um plugin deve estar habilitado com pelo menos uma seção",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Generate name and slug automatically based on enabled plugins
      const enabledPluginNames = enabledPlugins
      const autoName =
        enabledPluginNames.length > 0
          ? `${enabledPluginNames.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ")} Stats`
          : "My Profile Stats"
      const autoSlug = autoName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      // Update store with generated name/slug
      setBasicInfo(autoName, autoSlug, true)

      // Check if pluginsOrder is customized (different from alphabetical order)
      // Only consider enabled plugins in the order comparison
      const enabledPluginsOrdered = [...enabledPluginNames].sort()
      const currentOrderFiltered = pluginsOrder.filter((name) => enabledPluginNames.includes(name))
      const isOrderCustomized = JSON.stringify(enabledPluginsOrdered) !== JSON.stringify(currentOrderFiltered)

      // 3. Create/Update SVG (pluginsConfig has plugins only, uiConfig has global flags)
      const svgData: any = {
        name: autoName,
        style,
        size,
        theme,
        customCss: customCss || null,
        pluginsConfig: svgPluginsConfig,
        uiConfig: uiConfig,
      }

      // Only include pluginsOrder if customized (not alphabetical default)
      if (isOrderCustomized) {
        svgData.pluginsOrder = pluginsOrder.filter((name) => enabledPluginNames.includes(name)).join(",")
      }

      const data = isEditMode && editSvgId ? await svgApi.update(editSvgId, svgData) : await svgApi.create(svgData)

      const svgId = data.svg.id

      // 2. Generate SVG automatically after creating
      toast({
        title: "Gerando imagem...",
        description: "Aguarde enquanto geramos sua imagem SVG",
      })

      try {
        const generateData = await svgApi.generate(svgId)

        // Check if generation was successful
        if (generateData.success && generateData.svg?.storageUrl) {
          const svgUrl = generateData.svg.storageUrl

          // 3. Success - show URL and redirect
          toast({
            title: "Sucesso!",
            description: `Imagem SVG ${isEditMode ? "atualizada" : "criada"} e gerada com sucesso!`,
          })

          // Reset wizard store after successful creation (only in creation mode)
          if (!isEditMode) {
            reset()
          }

          // Redirect to view page with URL
          router.push(`/dashboard/${svgId}?url=${encodeURIComponent(svgUrl)}`)
        } else {
          // Reset wizard store after creating (only in creation mode)
          if (!isEditMode) {
            reset()
          }

          // If no URL yet, redirect anyway (page will do polling)
          toast({
            title: "Imagem criada",
            description: "A imagem está sendo gerada. Você será redirecionado...",
          })
          router.push(`/dashboard/${svgId}`)
        }
      } catch (generateError: any) {
        // Reset wizard store even with error (only in creation mode)
        if (!isEditMode) {
          reset()
        }

        // Check if it's a missing config error
        if (generateError?.code === "MISSING_REQUIRED_SECRETS" || generateError?.code === "MISSING_REQUIRED_CONFIG") {
          const missing = generateError?.missing || []
          const missingList = missing
            .map((m: any) => {
              const secrets = m.missingSecrets?.map((s: any) => s.label || s.key).join(", ") || ""
              const fields = m.missingFields?.map((f: any) => f.label || f.field).join(", ") || ""
              const parts = [secrets, fields].filter(Boolean)
              return `${m.pluginName}: ${parts.join(", ")}`
            })
            .join("; ")

          toast({
            title: "Configuração obrigatória faltando",
            description: `Configure os seguintes campos: ${missingList}`,
            variant: "destructive",
          })
          // Don't redirect - let user fix the config
          return
        }

        // If generation fails, still redirect (page will show error)
        console.error("Error generating SVG:", generateError)
        toast({
          title: "Imagem criada",
          description: "A imagem foi criada, mas houve um problema na geração. Verifique na página de detalhes.",
          variant: "default",
        })
        router.push(`/dashboard/${svgId}`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} SVG:`, error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : error instanceof Error
          ? error.message
          : `Erro ao ${isEditMode ? "atualizar" : "criar"} imagem`

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Stats for header
  const stats = useMemo(() => {
    if (enabledPlugins.length === 0) return undefined
    return {
      style,
      theme,
      plugins: enabledPlugins.length,
      sections: totalSections,
    }
  }, [enabledPlugins.length, style, theme, totalSections])

  // Footer props
  const footerProps = useMemo(
    () => ({
      onFinish: handleFinish,
      isSaving,
      hasMissingEssential,
      missingConfigs,
      canFinish: pluginsWithSections.length > 0,
    }),
    [handleFinish, isSaving, hasMissingEssential, missingConfigs, pluginsWithSections.length]
  )

  return {
    // State
    activeTab,
    setActiveTab,

    // Computed
    stats,
    enabledPlugins,
    totalSections,
    pluginsWithSections,
    missingConfigs,
    hasMissingEssential,

    // Handlers
    handleFinish,

    // Props for child components
    footerProps,
  }
}

