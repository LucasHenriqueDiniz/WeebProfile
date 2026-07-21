"use client"

/**
 * Shared state for the plugin workspace (list + detail panels).
 *
 * Previously this all lived inside PluginConfiguration.tsx, which rendered the list AND
 * the expanded plugin config as one accordion in a single column. Now that the list and
 * the selected plugin's detail live in two separate panels side by side, both need to
 * read/write the same state (selection, search, unlock/save flow, missing-config
 * validation) - so it's lifted into one hook called once, with the results passed down
 * as props instead of each panel holding its own (and desyncing) copy.
 */

import { useMemo, useState, useEffect, useCallback, useRef, useDeferredValue } from "react"
import { useShallow } from "zustand/react/shallow"
import { useAuth } from "@/hooks/useAuth"
import { useProfileConfig } from "@/hooks/useProfileConfig"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { PLUGINS_METADATA, getPluginsGroupedByCategory, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { useWizardStore } from "@/stores/wizard-store"
import { selectEnabledPluginNames, selectMissingConfigs } from "@/stores/wizard-selectors"
import { profileApi } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"
import { getPluginTags, type PluginTag } from "@/lib/config/plugin-tags"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useWizardUIState } from "@/hooks/useWizardUIState"

export function usePluginWorkspace() {
  const { toast } = useToast()
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

  const uiState = useWizardUIState()
  const { category, query, onlyEnabled, selectedPlugin, setCategory, setQuery, setOnlyEnabled, setSelectedPlugin } =
    uiState

  const deferredQuery = useDeferredValue(query)
  const debouncedQuery = useDebouncedValue(deferredQuery, 150)

  const [unlockedConfigs, setUnlockedConfigs] = useState<Set<string>>(new Set())
  const [unlockDialog, setUnlockDialog] = useState<{ plugin: string; key: string } | null>(null)
  const [savingConfigs, setSavingConfigs] = useState<Set<string>>(new Set())
  const [savedConfigs, setSavedConfigs] = useState<Set<string>>(new Set())

  const enabledPlugins = useMemo(() => {
    return selectEnabledPluginNames({ plugins, pluginsOrder })
  }, [plugins, pluginsOrder])

  const { profile, essentialConfigs } = useProfileConfig(enabledPlugins)

  const { secretsPresence, missingSecrets, refreshSecretsPresence, updateSecretsPresenceOptimistic } =
    useWizardBootstrapStore()

  const missingConfigs = useMemo(() => {
    return selectMissingConfigs({ plugins, pluginsOrder }, { missingSecrets })
  }, [plugins, pluginsOrder, missingSecrets])

  useEffect(() => {
    setPluginsHaveMissingEssentialConfigs(missingConfigs.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigs.length])

  useEffect(() => {
    const handleOpenProfileConfig = () => setShowProfileModal(true)
    window.addEventListener("openProfileConfig", handleOpenProfileConfig)
    return () => window.removeEventListener("openProfileConfig", handleOpenProfileConfig)
  }, [])

  const groupedPlugins = useMemo(() => getPluginsGroupedByCategory(), [])

  const allPlugins = useMemo(() => {
    return Object.entries(groupedPlugins).flatMap(([catId, categoryPlugins]) =>
      categoryPlugins.map((plugin) => ({
        ...plugin,
        categoryId: catId as PluginCategory,
      }))
    )
  }, [groupedPlugins])

  // Lista sempre mostra todos os plugins que batem com busca/filtro - selecionar um
  // plugin so destaca e abre o detalhe, nao filtra mais a propria lista.
  const filteredPlugins = useMemo(() => {
    return allPlugins.filter((plugin) => {
      const state = plugins[plugin.name]
      if (!state) return false

      if (onlyEnabled && !state.enabled) return false

      if (category !== "all") {
        if (["coding", "music", "anime", "gaming"].includes(category)) {
          if (plugin.categoryId !== category) return false
        } else {
          const pluginTags = getPluginTags(plugin.name)
          if (!pluginTags.includes(category as PluginTag)) return false
        }
      }

      if (debouncedQuery) {
        const searchLower = debouncedQuery.toLowerCase()
        const metadata = PLUGINS_METADATA[plugin.name as keyof typeof PLUGINS_METADATA]
        return (
          metadata?.displayName.toLowerCase().includes(searchLower) ||
          metadata?.description.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [allPlugins, plugins, category, debouncedQuery, onlyEnabled])

  const selectedPluginEntry = useMemo(() => {
    if (!selectedPlugin) return null
    return allPlugins.find((p) => p.name === selectedPlugin) ?? null
  }, [allPlugins, selectedPlugin])

  const toggleSection = useCallback(
    (pluginName: string, sectionId: string) => {
      const currentSections = plugins[pluginName]?.sections || []
      const newSections = currentSections.includes(sectionId)
        ? currentSections.filter((id) => id !== sectionId)
        : [...currentSections, sectionId]
      setPluginSections(pluginName, newSections)
    },
    [plugins, setPluginSections]
  )

  const handleUnlockConfig = useCallback((plugin: string, key: string) => {
    setUnlockDialog({ plugin, key })
  }, [])

  const confirmUnlock = useCallback(() => {
    if (!unlockDialog) return
    const { plugin, key } = unlockDialog
    setUnlockedConfigs((prev) => new Set(prev).add(`${plugin}.${key}`))
    setUnlockDialog(null)
  }, [unlockDialog])

  const handleEssentialConfigChange = useCallback(
    (plugin: string, key: string, value: string) => {
      setPluginRequiredField(plugin, key, value)
    },
    [setPluginRequiredField]
  )

  const handleEssentialConfigSave = useCallback(
    async (plugin: string, key: string, value: string) => {
      const configKey = `${plugin}.${key}`
      const isUnlocked = unlockedConfigs.has(configKey)
      const exists = secretsPresence?.[plugin]?.[key]?.exists || false
      const canSave = !exists || isUnlocked
      if (!canSave) {
        toast({
          title: "Campo bloqueado",
          description: "Clique em 'Editar' para desbloquear o campo antes de salvar",
          variant: "destructive",
        })
        return
      }

      if (!value.trim()) {
        toast({ title: "Valor vazio", description: "Digite um valor antes de salvar", variant: "destructive" })
        return
      }

      setSavingConfigs((prev) => new Set(prev).add(configKey))
      updateSecretsPresenceOptimistic(plugin, key)

      try {
        await profileApi.updateEssentialConfig(plugin, key, value)
        setSavedConfigs((prev) => new Set(prev).add(configKey))
        toast({ title: "Configuração salva", description: `${key} foi atualizado com sucesso` })
        setTimeout(() => {
          setSavedConfigs((prev) => {
            const next = new Set(prev)
            next.delete(configKey)
            return next
          })
        }, 2000)
      } catch (error) {
        console.error("Error saving essential config:", error)
        await refreshSecretsPresence()
        toast({ title: "Erro ao salvar", description: "Não foi possível salvar a configuração", variant: "destructive" })
      } finally {
        setSavingConfigs((prev) => {
          const next = new Set(prev)
          next.delete(configKey)
          return next
        })
      }
    },
    [unlockedConfigs, secretsPresence, updateSecretsPresenceOptimistic, refreshSecretsPresence, toast]
  )

  const hasMissingEssential = missingConfigs.length > 0

  return {
    // Data
    plugins,
    style,
    allPlugins,
    filteredPlugins,
    enabledPlugins,
    selectedPlugin,
    selectedPluginEntry,
    missingConfigs,
    hasMissingEssential,
    essentialConfigs,
    secretsPresence,
    profile,

    // Filters
    category,
    query,
    onlyEnabled,
    setCategory,
    setQuery,
    setOnlyEnabled,
    setSelectedPlugin,

    // Unlock/save flow
    unlockedConfigs,
    unlockDialog,
    setUnlockDialog,
    savingConfigs,
    savedConfigs,
    confirmUnlock,
    handleUnlockConfig,
    handleEssentialConfigChange,
    handleEssentialConfigSave,

    // Plugin/section actions
    togglePlugin,
    toggleSection,
    setPluginRequiredField,
    setSectionConfig,
    setPluginSections,

    // Profile modal
    showProfileModal,
    setShowProfileModal,
    refreshSecretsPresence,
  }
}

export type PluginWorkspace = ReturnType<typeof usePluginWorkspace>
