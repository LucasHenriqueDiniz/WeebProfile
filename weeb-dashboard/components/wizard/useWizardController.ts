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
import { useWizardUIState } from "@/hooks/useWizardUIState"
import { selectEnabledPluginNames, selectPluginsWithSections, selectTotalSections } from "@/stores/wizard-selectors"
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
  useEffect(() => {
    if (isEditMode) {
      reset()
    }
  }, [isEditMode, reset])

  // Computed values using canonical selectors
  const enabledPlugins = useMemo(() => {
    const enabled = selectEnabledPluginNames({ plugins, pluginsOrder })
    debugWizard("Enabled plugins:", enabled)
    return enabled
  }, [plugins, pluginsOrder])

  const totalSections = useMemo(() => {
    return selectTotalSections({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  const pluginsWithSections = useMemo(() => {
    return selectPluginsWithSections({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  // Missing configs validation
  const missingConfigs = useMemo(() => {
    const missing: Array<{ plugin: string; field: string; label: string }> = []

    enabledPlugins.forEach((pluginName) => {
      const plugin = plugins[pluginName]
      if (!plugin?.enabled) return

      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) return

      // Check requiredFields
      metadata.requiredFields.forEach((field) => {
        const value = (plugin as any)[field]
        const isEmpty = typeof value === "string" ? !value.trim() : !value
        if (isEmpty) {
          missing.push({
            plugin: pluginName,
            field,
            label: field.replace(/([A-Z])/g, " $1").trim(),
          })
        }
      })

      // Check essentialConfigKeysMetadata if exists
      if (metadata.essentialConfigKeysMetadata) {
        metadata.essentialConfigKeysMetadata.forEach((configKeyMeta: any) => {
          const configKey = configKeyMeta.key
          const value = (plugin as any)[configKey]
          const isEmpty = typeof value === "string" ? !value.trim() : !value
          if (isEmpty) {
            missing.push({
              plugin: pluginName,
              field: configKey,
              label: configKeyMeta.label || configKey.replace(/([A-Z])/g, " $1").trim(),
            })
          }
        })
      }
    })

    return missing
  }, [enabledPlugins, plugins])

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
      // Prepare pluginsConfig in the format expected by the API
      const pluginsConfig: Record<string, any> = {
        // Add customThemeColors only if theme is custom
        ...(theme === "custom" && Object.keys(customThemeColors).length > 0 ? { customThemeColors } : {}),
      }

      // Only include enabled plugins with sections in config (plugins without sections won't render anything)
      pluginsOrder.forEach((pluginName) => {
        const plugin = plugins[pluginName]
        // Only include if enabled AND has sections (for serialization)
        if (plugin?.enabled && plugin.sections && plugin.sections.length > 0) {
          pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}`] = true

          // Add requiredFields dynamically
          const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
          if (metadata?.requiredFields) {
            metadata.requiredFields.forEach((field: string) => {
              const value = (plugin as any)[field]
              if (value) {
                pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_${field.toUpperCase()}`] = value
              }
            })
          }

          pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_SECTIONS`] = plugin.sections.join(",")

          // Add other plugin-specific configs (not requiredFields)
          Object.keys(plugin).forEach((key) => {
            if (key !== "enabled" && key !== "sections" && key !== "sectionConfigs" && key !== "fields") {
              // Skip requiredFields that were already added
              const isRequiredField = metadata?.requiredFields?.includes(key)
              if (!isRequiredField) {
                const envKey = `PLUGIN_${pluginName.toUpperCase()}_${key.toUpperCase()}`
                pluginsConfig[envKey] = (plugin as any)[key]
              }
            }
          })
        }
      })

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

      // 1. Create/Update SVG
      // Merge terminal configs into pluginsConfig
      const finalPluginsConfig = setTerminalConfigs(pluginsConfig, {
        hideTerminalEmojis,
        hideTerminalHeader,
        hideTerminalCommand,
      })

      const svgData: any = {
        name: autoName,
        style,
        size,
        theme,
        customCss: customCss || null,
        customThemeColors: theme === "custom" ? customThemeColors : undefined,
        pluginsConfig: finalPluginsConfig,
        // Terminal configs are passed separately for API compatibility (will be merged on server)
        hideTerminalEmojis,
        hideTerminalHeader,
        hideTerminalCommand,
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
      } catch (generateError) {
        // Reset wizard store even with error (only in creation mode)
        if (!isEditMode) {
          reset()
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
