/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "source/helpers/logger"
import { Plugin, PluginDataMap, PluginDataResult, PluginName, PluginsConfig, PluginsRawConfig } from "../@types/plugins"
import MAIN_ENV_VARIABLES from "../ENV_VARIABLES"
import { availablePlugins, PluginRegistry } from "../plugins"

export function getDefaultValue(type: string): string | string[] | boolean | number | undefined {
  switch (type) {
    case "string":
      return " "
    case "stringArray":
      return []
    case "boolean":
      return false
    case "number":
      return 0
  }
}

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<PluginName, Plugin<PluginName>>
  private activePlugins: Set<PluginName> = new Set()

  private constructor() {
    this.plugins = new Map(Object.entries(availablePlugins) as [PluginName, Plugin<PluginName>][])
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      logger({
        message: "Creating new PluginManager instance",
        level: "debug",
        __filename,
      })
      PluginManager.instance = new PluginManager()
    }
    return PluginManager.instance
  }

  getPlugin<TName extends PluginName>(name: TName): Plugin<TName> | undefined {
    if (!this.plugins.has(name)) {
      logger({
        message: `Plugin ${name} not found`,
        level: "error",
        __filename,
      })
      return undefined
    }
    return this.plugins.get(name) as Plugin<TName> | undefined
  }

  getAllPlugins(): Plugin<PluginName>[] {
    logger({
      message: "Getting all plugins",
      level: "debug",
      __filename,
    })
    return Array.from(this.plugins.values())
  }

  getPlugins(): Map<PluginName, Plugin<PluginName>> {
    logger({
      message: "Getting all plugins",
      level: "debug",
      __filename,
    })
    return this.plugins
  }

  hasPlugin(name: string): boolean {
    logger({
      message: `Checking if plugin ${name} exists`,
      level: "debug",
      __filename,
    })
    return this.plugins.has(name as PluginName)
  }

  async fetchPluginData<TName extends PluginName>(
    name: TName,
    config: PluginRegistry[TName]["config"],
    dev = false
  ): Promise<PluginDataResult<TName>> {
    const plugin = this.getPlugin(name)
    if (!plugin) {
      logger({
        message: `Plugin ${name} not found`,
        level: "error",
        __filename,
      })
      return { name, data: null }
    }

    try {
      logger({
        message: `Fetching data for ${name}`,
        level: "debug",
        __filename,
      })
      const data = await plugin.fetchData(config, dev)
      logger({
        message: `Fetched data for ${name}: ${JSON.stringify(data).slice(0, 200)}...`,
        level: "debug",
        __filename,
      })
      return { name, data }
    } catch (error) {
      logger({
        message: `Error fetching data for ${name}: ${error}`,
        level: "error",
        __filename,
      })
      return { name, data: null }
    }
  }

  initializeActivePlugins(env: Record<string, any>): void {
    this.activePlugins.clear()

    Array.from(this.plugins.keys()).forEach((name) => {
      // Verifica se o plugin está configurado e ativo
      const config = env[name]
      const isPluginActive = config && config.plugin_enabled === true

      // Sanitize config before logging
      const sanitizedConfig = { ...config }
      if (sanitizedConfig) {
        const sensitiveKeys = ["gh_token", "api_key", "api_secret", "token"]
        sensitiveKeys.forEach((key) => {
          if (sanitizedConfig[key]) {
            sanitizedConfig[key] = "***********"
          }
        })
      }

      logger({
        message: `Checking plugin ${name}: config = ${JSON.stringify(sanitizedConfig).slice(0, 200)}...`,
        level: "debug",
        __filename,
      })

      if (isPluginActive) {
        this.activePlugins.add(name)
        logger({
          message: `Activated plugin: ${name}`,
          level: "info",
          __filename,
        })
      }
    })

    // Log total active plugins
    logger({
      message: `Total active plugins: ${this.activePlugins.size}`,
      level: "info",
      __filename,
    })
  }

  getActivePlugins(): Array<[PluginName, Plugin<PluginName>]> {
    logger({
      message: "Getting active plugins",
      level: "debug",
      __filename,
    })
    return Array.from(this.activePlugins).map((name) => [name, this.plugins.get(name)!])
  }

  isPluginActive(name: PluginName): boolean {
    logger({
      message: `Checking if plugin ${name} is active`,
      level: "debug",
      __filename,
    })
    return this.activePlugins.has(name)
  }

  activatePlugin(name: PluginName): void {
    logger({
      message: `Activating plugin ${name}`,
      level: "debug",
      __filename,
    })
    this.activePlugins.add(name)
  }

  deactivatePlugin(name: PluginName): void {
    logger({
      message: `Deactivating plugin ${name}`,
      level: "debug",
      __filename,
    })
    this.activePlugins.delete(name)
  }

  createEmptyDataMap(): PluginDataMap {
    logger({
      message: "Creating empty data map",
      level: "debug",
      __filename,
    })
    return Array.from(this.plugins.keys()).reduce((acc, name) => {
      acc[name] = null
      return acc
    }, {} as PluginDataMap)
  }

  createSinglePluginConfig<TName extends PluginName>(
    pluginName: TName,
    enabled?: boolean,
    sections?: string[]
  ): PluginRegistry[TName]["config"] {
    logger({
      message: `Creating config for plugin ${pluginName}`,
      level: "debug",
      __filename,
    })
    const plugin = this.getPlugin(pluginName)
    if (!plugin) {
      logger({
        message: `Plugin ${pluginName} not found`,
        level: "error",
        __filename,
      })
      return {} as PluginRegistry[TName]["config"]
    }

    const pluginConfig = Object.entries(plugin.envVariables).reduce(
      (acc, [key, value]) => {
        if (key === "plugin_enabled") {
          acc[key] = enabled ?? false
        } else if (key === "sections") {
          acc[key] = sections ?? []
        } else {
          acc[key] = value.defaultValue ?? getDefaultValue(value.type)
        }
        return acc
      },
      {} as Record<string, any>
    )

    return pluginConfig as PluginRegistry[TName]["config"]
  }

  createDefaultConfig(): PluginsConfig {
    logger({
      message: "Creating default config",
      level: "debug",
      __filename,
    })
    // Cria o config base com valores padrão do MAIN_ENV_VARIABLES
    const baseConfig: PluginsRawConfig = {
      gist_id: "",
      gh_token: "",
      filename: (MAIN_ENV_VARIABLES.filename?.defaultValue as string) || "WeeboProfile.svg",
      storage_method: (MAIN_ENV_VARIABLES.storage_method?.defaultValue as string) || "gist",
      size: (MAIN_ENV_VARIABLES.size?.defaultValue as string) || "half",
      style: (MAIN_ENV_VARIABLES.style?.defaultValue as string) || "default",
      custom_css: "",
      plugins_order: (MAIN_ENV_VARIABLES.plugins_order?.defaultValue as string[]) || [],
      custom_path: "",
      hide_terminal_emojis: (MAIN_ENV_VARIABLES.hide_terminal_emojis?.defaultValue as boolean) || false,
      hide_terminal_header: (MAIN_ENV_VARIABLES.hide_terminal_header?.defaultValue as boolean) || false,
      terminal_theme: (MAIN_ENV_VARIABLES.terminal_theme?.defaultValue as string) || "default",
      default_theme: (MAIN_ENV_VARIABLES.default_theme?.defaultValue as string) || "default",
    }

    // Adiciona as configurações padrão de cada plugin
    const pluginConfigs = Array.from(this.plugins.entries()).reduce(
      (acc, [name, plugin]) => {
        acc[name] = {
          plugin_enabled: false,
          sections: [],
          ...Object.entries(plugin.envVariables).reduce(
            (vars, [key, value]) => {
              if (value.defaultValue !== undefined) {
                vars[key] = value.defaultValue
              }
              return vars
            },
            {} as Record<string, any>
          ),
        }
        return acc
      },
      {} as Record<string, any>
    )

    return {
      ...baseConfig,
      ...pluginConfigs,
    }
  }
}
