/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "source/helpers/logger"
import { Plugin, PluginDataMap, PluginDataResult, PluginName, PluginsConfig, PluginsRawConfig } from "../@types/plugins"
import MAIN_ENV_VARIABLES from "../ENV_VARIABLES"
import { availablePlugins, PluginRegistry } from "../plugins"

export class PluginManager {
  private static instance: PluginManager
  private plugins: Map<PluginName, Plugin<PluginName>>
  private activePlugins: Set<PluginName> = new Set()

  private constructor() {
    this.plugins = new Map(Object.entries(availablePlugins) as [PluginName, Plugin<PluginName>][])
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager()
    }
    return PluginManager.instance
  }

  getPlugin<TName extends PluginName>(name: TName): Plugin<TName> | undefined {
    return this.plugins.get(name) as Plugin<TName> | undefined
  }

  getAllPlugins(): Plugin<PluginName>[] {
    return Array.from(this.plugins.values())
  }

  getPlugins(): Map<PluginName, Plugin<PluginName>> {
    return this.plugins
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
      const data = await plugin.fetchData(config, dev)
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
        message: `Checking plugin ${name}: config = ${JSON.stringify(sanitizedConfig)}`,
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
    return Array.from(this.activePlugins).map((name) => [name, this.plugins.get(name)!])
  }

  isPluginActive(name: PluginName): boolean {
    return this.activePlugins.has(name)
  }

  activatePlugin(name: PluginName): void {
    this.activePlugins.add(name)
  }

  deactivatePlugin(name: PluginName): void {
    this.activePlugins.delete(name)
  }

  createEmptyDataMap(): PluginDataMap {
    return Array.from(this.plugins.keys()).reduce((acc, name) => {
      acc[name] = null
      return acc
    }, {} as PluginDataMap)
  }

  createDefaultConfig(): PluginsConfig {
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
