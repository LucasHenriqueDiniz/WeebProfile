import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PLUGINS_METADATA, getPluginMetadata } from "@weeb/weeb-plugins/plugins/metadata"
import { applyPluginDefaults } from "@/lib/config/plugin-defaults"

export interface PluginConfig {
  enabled: boolean
  username?: string
  sections: string[]
  sectionConfigs: Record<string, Record<string, unknown>> // sectionId -> { optionKey: value }
  fields: Record<string, unknown> // Extra plugin-level fields if needed
}

export interface WizardState {
  // Basic info (auto-generated, não é mais um step)
  name: string
  slug: string
  useProfileConfig: boolean

  // Step 1: Style
  style: "default" | "terminal"
  size: "half" | "full"
  theme: string // Unified theme field (replaces terminalTheme and defaultTheme)
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  customCss: string
  customThemeColors: Record<string, string> // Custom theme colors (only used when theme === 'custom')

  // Step 2: Plugins
  plugins: Record<string, PluginConfig> // Fully dynamic
  pluginsOrder: string[]

  // Step 3: Preview
  previewUrl: string | null

  // Essential configs validation
  pluginsHaveMissingEssentialConfigs: boolean

  // Step 4: Preview
  currentStep: number
  isValid: {
    step1: boolean
    step2: boolean
    step3: boolean
    step4: boolean
  }

  // Actions
  setStep: (step: number) => void
  setBasicInfo: (name: string, slug: string, useProfileConfig?: boolean) => void
  setPluginConfig: (plugin: string, config: Partial<PluginConfig>) => void
  togglePlugin: (plugin: string) => void
  setPluginSections: (plugin: string, sections: string[]) => void
  setPluginRequiredField: (plugin: string, field: string, value: string) => void
  setSectionConfig: (plugin: string, sectionId: string, config: Record<string, unknown>) => void
  setPluginsHaveMissingEssentialConfigs: (value: boolean) => void
  setStyle: (style: "default" | "terminal") => void
  setSize: (size: "half" | "full") => void
  setTheme: (theme: string) => void
  setCustomCss: (css: string) => void
  setHideTerminalEmojis: (hide: boolean) => void
  setHideTerminalHeader: (hide: boolean) => void
  setCustomThemeColor: (variable: string, color: string) => void
  resetCustomThemeColors: () => void
  setPreviewUrl: (url: string | null) => void
  reorderPlugins: (newOrder: string[]) => void
  reset: () => void
  validateStep: (step: number) => boolean
}

/**
 * Gera plugins inicial dinamicamente de PLUGINS_METADATA
 * Usa defaults da metadata de cada plugin
 * GitHub é ativado por padrão com profile + activity
 */
function generateInitialPlugins(userDefaults?: Record<string, any>): Record<string, PluginConfig> {
  const plugins: Record<string, PluginConfig> = {}
  Object.keys(PLUGINS_METADATA).forEach((pluginName) => {
    if (pluginName === 'github') {
      // GitHub ativado por padrão com profile + activity
      plugins[pluginName] = applyPluginDefaults(pluginName, {
        enabled: true,
        sections: ['profile', 'activity'],
      }, userDefaults)
    } else {
      plugins[pluginName] = applyPluginDefaults(pluginName, {}, userDefaults)
    }
  })
  return plugins
}

/**
 * Generates initial pluginsOrder dynamically from PLUGINS_METADATA
 */
function generateInitialPluginsOrder(): string[] {
  return Object.keys(PLUGINS_METADATA)
}

const initialState = {
  name: "",
  slug: "",
  useProfileConfig: false,
  plugins: generateInitialPlugins(),
  pluginsOrder: generateInitialPluginsOrder(),
  style: "default" as const,
  size: "half" as const,
  theme: "default",
  hideTerminalEmojis: false,
  hideTerminalHeader: false,
  customCss: "",
  customThemeColors: {},
  previewUrl: null,
  pluginsHaveMissingEssentialConfigs: false,
          currentStep: 1,
  isValid: {
    step1: true, // Style sempre válido
    step2: false,
    step3: false,
    step4: false,
  },
}

/**
 * Migrates old plugin config format to new format with sectionConfigs
 */
function migratePluginConfig(pluginConfig: any): PluginConfig {
  // If already in new format, return as is
  if (pluginConfig.sectionConfigs !== undefined && pluginConfig.fields !== undefined) {
    return pluginConfig as PluginConfig
  }

  // Migrate from old format (flat structure) to new format
  const sectionConfigs: Record<string, Record<string, unknown>> = {}
  const fields: Record<string, unknown> = {}

  // Extract section-specific configs (keys that include sectionId)
  const sectionIds = pluginConfig.sections || []
  const allKeys = Object.keys(pluginConfig)

  for (const key of allKeys) {
    // Skip standard fields
    if (['enabled', 'username', 'sections'].includes(key)) {
      continue
    }

    // Try to match key to a section
    let matched = false
    for (const sectionId of sectionIds) {
      if (key.includes(sectionId) || key.startsWith(sectionId.split("_")[0])) {
        if (!sectionConfigs[sectionId]) {
          sectionConfigs[sectionId] = {}
        }
        sectionConfigs[sectionId][key] = pluginConfig[key]
        matched = true
        break
      }
    }

    // If not matched to a section, put in fields
    if (!matched) {
      fields[key] = pluginConfig[key]
    }
  }

  return {
    enabled: pluginConfig.enabled ?? false,
    username: pluginConfig.username,
    sections: pluginConfig.sections || [],
    sectionConfigs,
    fields,
  }
}

/**
 * Ensures all plugins from metadata are initialized in the state
 * This is important when loading from localStorage - new plugins may not exist
 * Also migrates old plugin config format to new format
 */
function ensureAllPlugins(plugins: Record<string, any>): Record<string, PluginConfig> {
  const allPlugins: Record<string, PluginConfig> = {}
  
  // Migrate existing plugins
  Object.keys(plugins).forEach((pluginName) => {
    allPlugins[pluginName] = migratePluginConfig(plugins[pluginName])
  })
  
  // Add any missing plugins from metadata
  Object.keys(PLUGINS_METADATA).forEach((pluginName) => {
    if (!allPlugins[pluginName]) {
      allPlugins[pluginName] = applyPluginDefaults(pluginName, {})
    }
  })
  
  return allPlugins
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,
      // Ensure all plugins are initialized on store creation
      plugins: ensureAllPlugins(initialState.plugins),

      setStep: (step) => {
        const isValid = get().validateStep(step - 1)
        if (isValid || step === 1) {
          set({ currentStep: step })
        }
      },

      setBasicInfo: (name, slug, useProfileConfig = false) => {
        const isValid = name.length > 0 && slug.length > 0 && /^[a-z0-9-_]+$/.test(slug)
        set({
          name,
          slug,
          useProfileConfig,
          isValid: {
            ...get().isValid,
            step1: isValid,
          },
        })
      },

      setPluginConfig: (plugin, config) => {
        const currentConfig = get().plugins[plugin] || {}
        // Apply defaults before merging with provided config
        const defaults = applyPluginDefaults(plugin, {}, undefined)
        
        set({
          plugins: {
            ...get().plugins,
            [plugin]: {
              ...defaults,
              ...currentConfig,
              ...config,
            },
          },
        })
        get().validateStep(2)
      },

      togglePlugin: (plugin) => {
        const state = get()
        let current = state.plugins[plugin]
        
        // If plugin doesn't exist, initialize it
        if (!current) {
          current = applyPluginDefaults(plugin, {})
          state.setPluginConfig(plugin, current)
        }
        
        get().setPluginConfig(plugin, { enabled: !current.enabled })
      },

      setPluginSections: (plugin, sections) => {
        get().setPluginConfig(plugin, { sections })
        get().validateStep(2) // Step 2 é Plugins agora
      },

      setPluginRequiredField: (plugin, field, value) => {
        get().setPluginConfig(plugin, { [field]: value })
        get().validateStep(2) // Step 2 é Plugins agora
      },

      setSectionConfig: (plugin, sectionId, config) => {
        const current = get().plugins[plugin] || applyPluginDefaults(plugin, {})
        const currentSection = current.sectionConfigs?.[sectionId] || {}
        
        get().setPluginConfig(plugin, {
          sectionConfigs: {
            ...(current.sectionConfigs || {}),
            [sectionId]: { ...currentSection, ...config },
          },
        })
      },

      setStyle: (style) => {
        set({ style })
      },

      setSize: (size) => {
        set({ size })
      },

      setTheme: (theme: string) => {
        set({ theme })
      },

      setCustomCss: (css) => {
        set({ customCss: css })
      },

      setHideTerminalEmojis: (hide) => {
        set({ hideTerminalEmojis: hide })
      },

      setHideTerminalHeader: (hide) => {
        set({ hideTerminalHeader: hide })
      },

      setCustomThemeColor: (variable, color) => {
        set((state) => ({
          customThemeColors: {
            ...state.customThemeColors,
            [variable]: color,
          },
        }))
      },
      resetCustomThemeColors: () => {
        set({ customThemeColors: {} })
      },

      setPreviewUrl: (url) => {
        set({ previewUrl: url })
      },

      reorderPlugins: (newOrder) => {
        set({ pluginsOrder: newOrder })
      },

      setPluginsHaveMissingEssentialConfigs: (value) => {
        const current = get().pluginsHaveMissingEssentialConfigs
        if (current !== value) {
          set({ pluginsHaveMissingEssentialConfigs: value })
          // Validate step asynchronously to avoid infinite loops
          setTimeout(() => {
            get().validateStep(2) // Step 2 é Plugins agora
          }, 0)
        }
      },

      reset: () => {
        set({
          ...initialState,
          plugins: generateInitialPlugins(),
          pluginsOrder: generateInitialPluginsOrder(),
        })
      },

      validateStep: (step) => {
        const state = get()
        let isValid = false

        switch (step) {
          case 1:
            // Step 1: Style - sempre válido, opções têm defaults
            isValid = true
            break
          case 2: {
            // Step 2: Plugins
            const entries = Object.entries(state.plugins).filter(([, p]) => p.enabled) as [string, PluginConfig][]
            if (entries.length === 0) {
              isValid = false
              break
            }

            isValid = entries.every(([name, cfg]) => {
              const meta = getPluginMetadata(name)
              if (!meta) return true

              // precisa pelo menos 1 seção
              if (cfg.sections.length === 0) return false

              // requiredFields (ex: "username", "personality_url", etc)
              const requiredOk = meta.requiredFields.every((field) => {
                const value = cfg[field as keyof PluginConfig]
                if (typeof value === 'string') return !!value.trim()
                return !!value
              })

              return requiredOk
            }) && !state.pluginsHaveMissingEssentialConfigs
            break
          }
          case 3:
            // Step 3: Preview - válido se step1 e step2 válidos
            isValid = state.isValid.step1 && state.isValid.step2
            break
        }

        // Atualizar isValid baseado no step
        const newIsValid = { ...state.isValid }
        if (step === 1) newIsValid.step1 = isValid
        if (step === 2) newIsValid.step2 = isValid
        if (step === 3) newIsValid.step3 = isValid
        set({ isValid: newIsValid })

        return isValid
      },
    }),
    {
      name: "wizard-storage",
      partialize: (state) => ({
        name: state.name,
        slug: state.slug,
        plugins: state.plugins,
        pluginsOrder: state.pluginsOrder,
        style: state.style,
        size: state.size,
        theme: state.theme,
        hideTerminalEmojis: state.hideTerminalEmojis,
        hideTerminalHeader: state.hideTerminalHeader,
        customCss: state.customCss,
        customThemeColors: state.customThemeColors,
        previewUrl: state.previewUrl,
      }),
      // Prevent excessive synchronization that can cause refresh
      skipHydration: false,
      // Use custom storage to avoid synchronization issues
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name)
            return str ? JSON.parse(str) : null
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch {
            // Ignore storage errors
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name)
          } catch {
            // Ignore storage errors
          }
        },
      },
      onRehydrateStorage: () => (state) => {
        // Ensure all plugins from metadata are initialized after rehydration
        // This handles cases where new plugins were added but localStorage doesn't have them
        if (state) {
          const allPlugins = ensureAllPlugins(state.plugins)
          const allPluginsOrder = generateInitialPluginsOrder()
          
          // Only update if plugins are missing
          const hasMissingPlugins = Object.keys(PLUGINS_METADATA).some(
            pluginName => !state.plugins[pluginName]
          )
          
          if (hasMissingPlugins) {
            state.plugins = allPlugins
            // Merge pluginsOrder to include new plugins while preserving order
            const existingOrder = state.pluginsOrder || []
            const newPlugins = allPluginsOrder.filter(p => !existingOrder.includes(p))
            state.pluginsOrder = [...existingOrder, ...newPlugins]
          }
        }
      },
    }
  )
)

