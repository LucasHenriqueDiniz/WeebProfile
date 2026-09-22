import { PluginManager } from "@weeb/weeb-plugins"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import { PluginError } from "../errors/AppError"

/**
 * Registry centralizado de plugins
 * Gerencia o carregamento e registro de plugins de forma centralizada
 */
export class PluginRegistry {
  private static instance: PluginRegistry
  private manager: PluginManager
  private logger = LoggerFactory.getLogger("PluginRegistry")
  private loadedPlugins = new Set<string>()
  private corePlugins = [
    "github",
    "lastfm",
    "myanimelist",
    "16personalities",
    "lyfta",
    "steam",
    "github-project",
    "duolingo",
    "codewars",
    "codeforces",
    "stackoverflow",
  ]

  private constructor() {
    this.manager = PluginManager.getInstance()
    this.loadCorePlugins()
  }

  static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry()
    }
    return PluginRegistry.instance
  }

  /**
   * Carrega plugins core automaticamente
   */
  private loadCorePlugins(): void {
    this.logger.debug("Loading core plugins...")

    // Inicializa plugins ativos baseado na configuração padrão
    const defaultConfig: Record<string, { enabled?: boolean }> = {}

    for (const pluginName of this.corePlugins) {
      defaultConfig[pluginName] = { enabled: false } // Desabilitado por padrão
    }

    try {
      this.manager.initializeActivePlugins(defaultConfig)
      this.logger.info(`Core plugins loaded: ${this.corePlugins.join(", ")}`)
    } catch (error) {
      this.logger.error("Failed to initialize core plugins", error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Obtém o PluginManager
   */
  getManager(): PluginManager {
    return this.manager
  }

  /**
   * Lista todos os plugins disponíveis
   */
  listAvailablePlugins(): string[] {
    return this.manager.getAll().map((plugin) => plugin.name)
  }

  /**
   * Lista plugins ativos
   */
  listActivePlugins(): string[] {
    return this.manager.getActivePlugins().map(([name]) => name)
  }

  /**
   * Verifica se um plugin está disponível
   */
  isPluginAvailable(pluginName: string): boolean {
    return this.manager.get(pluginName) !== undefined
  }

  /**
   * Verifica se um plugin está ativo
   */
  isPluginActive(pluginName: string): boolean {
    return this.listActivePlugins().includes(pluginName)
  }

  /**
   * Ativa plugins baseado na configuração
   */
  activatePlugins(pluginsConfig: Record<string, { enabled?: boolean }>): void {
    try {
      this.logger.debug("Activating plugins from config", {
        totalPlugins: Object.keys(pluginsConfig).length,
        enabledPlugins: Object.entries(pluginsConfig).filter(([, config]) => config.enabled).length,
      })

      this.manager.initializeActivePlugins(pluginsConfig)

      const activePlugins = this.listActivePlugins()
      this.logger.info(`Plugins activated: ${activePlugins.join(", ")}`)
    } catch (error) {
      this.logger.error("Failed to activate plugins", error instanceof Error ? error : new Error(String(error)))
      throw new PluginError(
        "PluginRegistry",
        "Failed to activate plugins",
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  /**
   * Obtém informações de um plugin específico
   */
  getPluginInfo(pluginName: string): PluginInfo | null {
    const plugin = this.manager.get(pluginName)
    if (!plugin) {
      return null
    }

    return {
      name: plugin.name,
      essentialConfigKeys: plugin.essentialConfigKeys,
      hasStyles: !!plugin.styles,
      hasValidation: !!plugin.validate,
      isActive: this.isPluginActive(pluginName),
    }
  }

  /**
   * Valida configuração de um plugin
   */
  validatePluginConfig(pluginName: string, config: Record<string, unknown>): ValidationResult {
    const plugin = this.manager.get(pluginName)
    if (!plugin) {
      return {
        isValid: false,
        errors: [`Plugin ${pluginName} not found`],
        warnings: [],
      }
    }

    if (!plugin.validate) {
      return {
        isValid: true,
        errors: [],
        warnings: [`Plugin ${pluginName} has no validation method`],
      }
    }

    try {
      const validation = plugin.validate(config as any)
      return {
        isValid: validation.valid,
        errors: validation.errors || [],
        warnings: [],
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
        warnings: [],
      }
    }
  }

  /**
   * Obtém chaves de configuração essencial de um plugin
   */
  getEssentialConfigKeys(pluginName: string): string[] {
    const plugin = this.manager.get(pluginName)
    return plugin?.essentialConfigKeys || []
  }

  /**
   * Verifica se um plugin tem todas as configurações essenciais
   */
  hasEssentialConfigs(pluginName: string, config: Record<string, unknown>): boolean {
    const essentialKeys = this.getEssentialConfigKeys(pluginName)
    return essentialKeys.every((key) => config[key] !== undefined && config[key] !== "")
  }

  /**
   * Lista plugins que faltam configurações essenciais
   */
  getPluginsMissingEssentialConfigs(pluginsConfig: Record<string, Record<string, unknown>>): MissingConfigResult[] {
    const results: MissingConfigResult[] = []

    for (const [pluginName, config] of Object.entries(pluginsConfig)) {
      if (!this.isPluginAvailable(pluginName)) {
        continue
      }

      const essentialKeys = this.getEssentialConfigKeys(pluginName)
      const missingKeys = essentialKeys.filter((key) => !config[key])

      if (missingKeys.length > 0) {
        results.push({
          pluginName,
          missingKeys,
          hasAllConfigs: false,
        })
      }
    }

    return results
  }

  /**
   * Reseta o registry (útil para testes)
   */
  reset(): void {
    this.logger.debug("Resetting plugin registry")
    this.loadedPlugins.clear()
    this.loadCorePlugins()
  }
}

/**
 * Informações de um plugin
 */
export interface PluginInfo {
  name: string
  essentialConfigKeys: string[]
  hasStyles: boolean
  hasValidation: boolean
  isActive: boolean
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Resultado de verificação de configurações essenciais
 */
export interface MissingConfigResult {
  pluginName: string
  missingKeys: string[]
  hasAllConfigs: boolean
}
