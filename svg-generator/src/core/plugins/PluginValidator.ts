import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import { PluginRegistry } from "./PluginRegistry"

/**
 * Validador avançado de plugins
 * Realiza validações complexas e regras de negócio
 */
export class PluginValidator {
  private logger = LoggerFactory.getLogger("PluginValidator")
  private registry = PluginRegistry.getInstance()

  /**
   * Valida configuração completa de plugins
   */
  async validatePluginsConfig(config: Record<string, Record<string, unknown>>): Promise<PluginValidationResult> {
    const startTime = Date.now()
    this.logger.debug("Starting plugins validation", { pluginCount: Object.keys(config).length })

    const result: PluginValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      pluginResults: {},
      validationTime: 0,
    }

    // 1. Validação básica de plugins
    await this.validateBasicPlugins(config, result)

    // 2. Validação de configurações essenciais
    await this.validateEssentialConfigs(config, result)

    // 3. Validação de dependências entre plugins
    await this.validatePluginDependencies(config, result)

    // 4. Validação de limites e quotas
    await this.validateLimitsAndQuotas(config, result)

    // 5. Validação de seções
    await this.validatePluginSections(config, result)

    result.validationTime = Date.now() - startTime
    result.isValid = result.errors.length === 0

    this.logger.info("Plugin validation completed", {
      isValid: result.isValid,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      validationTime: result.validationTime,
    })

    return result
  }

  /**
   * Validação básica de plugins
   */
  private async validateBasicPlugins(
    config: Record<string, Record<string, unknown>>,
    result: PluginValidationResult
  ): Promise<void> {
    for (const [pluginName, pluginConfig] of Object.entries(config)) {
      const pluginResult: PluginResult = {
        isValid: true,
        errors: [],
        warnings: [],
      }

      // Verifica se plugin existe
      if (!this.registry.isPluginAvailable(pluginName)) {
        pluginResult.isValid = false
        pluginResult.errors.push(`Plugin ${pluginName} is not available`)
        result.pluginResults[pluginName] = pluginResult
        continue
      }

      // Verifica se está habilitado
      if (!pluginConfig?.enabled) {
        pluginResult.warnings.push(`Plugin ${pluginName} is disabled`)
        result.pluginResults[pluginName] = pluginResult
        continue
      }

      // Valida configuração específica do plugin
      const validation = this.registry.validatePluginConfig(pluginName, pluginConfig)
      if (!validation.isValid) {
        pluginResult.isValid = false
        pluginResult.errors.push(...validation.errors)
      }
      pluginResult.warnings.push(...validation.warnings)

      result.pluginResults[pluginName] = pluginResult
    }
  }

  /**
   * Validação de configurações essenciais
   */
  private async validateEssentialConfigs(
    config: Record<string, Record<string, unknown>>,
    result: PluginValidationResult
  ): Promise<void> {
    const missingConfigs = this.registry.getPluginsMissingEssentialConfigs(config)

    for (const missing of missingConfigs) {
      const pluginResult = result.pluginResults[missing.pluginName] || {
        isValid: true,
        errors: [],
        warnings: [],
      }

      pluginResult.isValid = false
      pluginResult.errors.push(`Missing essential configs: ${missing.missingKeys.join(", ")}`)

      result.pluginResults[missing.pluginName] = pluginResult
    }
  }

  /**
   * Validação de dependências entre plugins
   */
  private async validatePluginDependencies(
    config: Record<string, Record<string, unknown>>,
    result: PluginValidationResult
  ): Promise<void> {
    const enabledPlugins = Object.entries(config)
      .filter(([, pluginConfig]) => pluginConfig?.enabled)
      .map(([pluginName]) => pluginName)

    // Regras de dependência
    const dependencyRules: DependencyRule[] = [
      {
        plugin: "github-project",
        requires: ["github"],
        message: "github-project requires github plugin to be enabled",
      },
      // Adicionar mais regras conforme necessário
    ]

    for (const rule of dependencyRules) {
      if (enabledPlugins.includes(rule.plugin) && !enabledPlugins.includes(rule.requires)) {
        const pluginResult = result.pluginResults[rule.plugin] || {
          isValid: true,
          errors: [],
          warnings: [],
        }

        pluginResult.isValid = false
        pluginResult.errors.push(rule.message)

        result.pluginResults[rule.plugin] = pluginResult
      }
    }
  }

  /**
   * Validação de limites e quotas
   */
  private async validateLimitsAndQuotas(
    config: Record<string, Record<string, unknown>>,
    result: PluginValidationResult
  ): Promise<void> {
    const enabledPlugins = Object.entries(config).filter(([, pluginConfig]) => pluginConfig?.enabled).length

    // Limites
    const limits = {
      maxEnabledPlugins: 10,
      maxSectionsPerPlugin: 20,
    }

    if (enabledPlugins > limits.maxEnabledPlugins) {
      result.errors.push(`Too many enabled plugins (${enabledPlugins}). Maximum allowed: ${limits.maxEnabledPlugins}`)
    }

    // Valida seções por plugin
    for (const [pluginName, pluginConfig] of Object.entries(config)) {
      if (!pluginConfig?.enabled) continue

      const sections = (pluginConfig.sections as string[]) || []
      if (sections.length > limits.maxSectionsPerPlugin) {
        const pluginResult = result.pluginResults[pluginName] || {
          isValid: true,
          errors: [],
          warnings: [],
        }

        pluginResult.warnings.push(
          `Too many sections for ${pluginName} (${sections.length}). Consider reducing sections.`
        )

        result.pluginResults[pluginName] = pluginResult
      }
    }
  }

  /**
   * Validação de seções dos plugins
   */
  private async validatePluginSections(
    config: Record<string, Record<string, unknown>>,
    result: PluginValidationResult
  ): Promise<void> {
    for (const [pluginName, pluginConfig] of Object.entries(config)) {
      if (!pluginConfig?.enabled) continue

      const sections = (pluginConfig.sections as string[]) || []
      const pluginInfo = this.registry.getPluginInfo(pluginName)

      if (!pluginInfo) continue

      // Valida seções conhecidas do plugin
      const knownSections = this.getKnownSections(pluginName)
      const unknownSections = sections.filter((section) => !knownSections.includes(section))

      if (unknownSections.length > 0) {
        const pluginResult = result.pluginResults[pluginName] || {
          isValid: true,
          errors: [],
          warnings: [],
        }

        pluginResult.warnings.push(`Unknown sections for ${pluginName}: ${unknownSections.join(", ")}`)

        result.pluginResults[pluginName] = pluginResult
      }

      // Valida seções obrigatórias
      const requiredSections = this.getRequiredSections(pluginName)
      const missingRequired = requiredSections.filter((section) => !sections.includes(section))

      if (missingRequired.length > 0) {
        const pluginResult = result.pluginResults[pluginName] || {
          isValid: true,
          errors: [],
          warnings: [],
        }

        pluginResult.errors.push(`Missing required sections for ${pluginName}: ${missingRequired.join(", ")}`)
        pluginResult.isValid = false

        result.pluginResults[pluginName] = pluginResult
      }
    }
  }

  /**
   * Obtém seções conhecidas de um plugin
   */
  private getKnownSections(pluginName: string): string[] {
    // Mapeamento de seções conhecidas por plugin
    const sectionMap: Record<string, string[]> = {
      github: ["overview", "stats", "repositories", "contributions", "activity"],
      lastfm: ["recent", "top", "artists", "albums"],
      myanimelist: ["profile", "anime", "manga", "stats"],
      steam: ["profile", "games", "stats"],
      duolingo: ["profile", "streak", "languages"],
      codewars: ["profile", "stats", "challenges"],
      codeforces: ["profile", "stats", "contests"],
      stackoverflow: ["profile", "stats", "reputation"],
    }

    return sectionMap[pluginName] || []
  }

  /**
   * Obtém seções obrigatórias de um plugin
   */
  private getRequiredSections(pluginName: string): string[] {
    // Mapeamento de seções obrigatórias por plugin
    const requiredSectionMap: Record<string, string[]> = {
      github: ["overview"],
      lastfm: ["recent"],
      myanimelist: ["profile"],
      steam: ["profile"],
    }

    return requiredSectionMap[pluginName] || []
  }

  /**
   * Gera relatório detalhado da validação
   */
  generateValidationReport(result: PluginValidationResult): string {
    const lines: string[] = []

    lines.push("=== Plugin Validation Report ===")
    lines.push(`Valid: ${result.isValid ? "✅" : "❌"}`)
    lines.push(`Total Errors: ${result.errors.length}`)
    lines.push(`Total Warnings: ${result.warnings.length}`)
    lines.push(`Validation Time: ${result.validationTime}ms`)
    lines.push("")

    // Erros globais
    if (result.errors.length > 0) {
      lines.push("Global Errors:")
      result.errors.forEach((error) => lines.push(`  ❌ ${error}`))
      lines.push("")
    }

    // Warnings globais
    if (result.warnings.length > 0) {
      lines.push("Global Warnings:")
      result.warnings.forEach((warning) => lines.push(`  ⚠️  ${warning}`))
      lines.push("")
    }

    // Resultados por plugin
    lines.push("Plugin Results:")
    for (const [pluginName, pluginResult] of Object.entries(result.pluginResults)) {
      const status = pluginResult.isValid ? "✅" : "❌"
      lines.push(`  ${status} ${pluginName}`)

      if (pluginResult.errors.length > 0) {
        pluginResult.errors.forEach((error) => lines.push(`    ❌ ${error}`))
      }

      if (pluginResult.warnings.length > 0) {
        pluginResult.warnings.forEach((warning) => lines.push(`    ⚠️  ${warning}`))
      }
    }

    return lines.join("\n")
  }
}

/**
 * Resultado da validação de plugins
 */
export interface PluginValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  pluginResults: Record<string, PluginResult>
  validationTime: number
}

/**
 * Resultado por plugin
 */
export interface PluginResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Regra de dependência
 */
interface DependencyRule {
  plugin: string
  requires: string
  message: string
}
