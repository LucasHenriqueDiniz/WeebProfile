import { PluginManager } from "@weeb/weeb-plugins"
import { getSharedCSS } from "@weeb/weeb-plugins/styles/server"
import { PluginError } from "../../core/errors/AppError"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import type { SvgConfig } from "../../shared/types"
import type { CssAggregationResult, CssValidationResult, ICssAggregator } from "../interfaces/ICssAggregator"

/**
 * Serviço de agregação de CSS dos plugins
 * Implementa ICssAggregator para centralizar carregamento de estilos
 */
export class CssAggregatorService implements ICssAggregator {
  private logger = LoggerFactory.getLogger("CssAggregatorService")
  private cssCache = new Map<string, string>()

  /**
   * Carrega e agrega CSS de todos os plugins ativos
   */
  async loadCss(config: SvgConfig): Promise<CssAggregationResult> {
    const startTime = Date.now()
    this.logger.debug("Starting CSS aggregation", { pluginCount: Object.keys(config.plugins || {}).length })

    try {
      const _pluginManager = PluginManager.getInstance()
      const cssDefs: string[] = []
      const warnings: string[] = []
      let pluginCount = 0

      // Processa cada plugin ativo
      for (const [pluginName, pluginConfig] of Object.entries(config.plugins || {})) {
        if (!pluginConfig?.enabled) {
          continue
        }

        try {
          this.logger.debug(`Loading CSS for plugin: ${pluginName}`)

          // Verifica cache primeiro
          const cacheKey = `${pluginName}-${JSON.stringify(pluginConfig)}`
          let css = this.cssCache.get(cacheKey)

          if (!css) {
            css = await this.loadPluginCss(pluginName, pluginConfig)
            this.cssCache.set(cacheKey, css)
          }

          if (css) {
            cssDefs.push(css)
            pluginCount++
            this.logger.debug(`CSS loaded for plugin: ${pluginName}`)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          warnings.push(`Failed to load CSS for plugin ${pluginName}: ${errorMessage}`)
          this.logger.warn(`Failed to load CSS for plugin: ${pluginName}`, { error })
        }
      }

      // Carrega CSS compartilhado (Tailwind utilities, etc.)
      const sharedCss = getSharedCSS()
      this.logger.debug("Shared CSS loaded", { size: sharedCss.length })

      // Combina CSS: shared + plugins
      const allCssDefs = [sharedCss, ...cssDefs].filter(Boolean)
      const combinedCss = allCssDefs.join("\n\n")

      const loadTime = Date.now() - startTime
      this.logger.info("CSS aggregation completed", {
        loadTime,
        pluginCount,
        sharedCssSize: sharedCss.length,
        totalSize: combinedCss.length,
        warningCount: warnings.length,
      })

      return {
        cssDefs: combinedCss,
        loadTime,
        pluginCount,
        warnings,
      }
    } catch (error) {
      this.logger.error("CSS aggregation failed", error instanceof Error ? error : new Error(String(error)))
      throw new PluginError(
        "CssAggregatorService",
        "Failed to aggregate CSS",
        error instanceof Error ? error : new Error(String(error))
      )
    }
  }

  /**
   * Carrega CSS de um plugin específico
   */
  async loadPluginCss(pluginName: string, _config: Record<string, unknown>): Promise<string> {
    try {
      const pluginManager = PluginManager.getInstance()
      const plugin = pluginManager.get(pluginName)

      if (!plugin) {
        throw new Error(`Plugin not found: ${pluginName}`)
      }

      // Obtém CSS do plugin (se disponível)
      if (plugin.styles) {
        // Valida CSS antes de retornar
        const validation = await this.validateCss(plugin.styles, pluginName)
        if (!validation.isValid) {
          this.logger.warn(`CSS validation failed for plugin: ${pluginName}`, { errors: validation.errors })
        }

        return plugin.styles
      }

      this.logger.debug(`No CSS found for plugin: ${pluginName}`)
      return ""
    } catch (error) {
      this.logger.error(
        `Failed to load CSS for plugin: ${pluginName}`,
        error instanceof Error ? error : new Error(String(error))
      )
      throw error
    }
  }

  /**
   * Valida CSS antes da inclusão
   */
  async validateCss(css: string, pluginName?: string): Promise<CssValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Validações básicas
      if (!css || css.trim().length === 0) {
        errors.push("CSS is empty")
        return {
          isValid: false,
          errors,
          warnings,
          size: 0,
          hasExternalResources: false,
        }
      }

      // Verifica por CSS inválido ou perigoso
      const dangerousPatterns = [/javascript:/i, /<script/i, /@import/i, /expression\s*\(/i]

      for (const pattern of dangerousPatterns) {
        if (pattern.test(css)) {
          errors.push(`CSS contains potentially dangerous content: ${pattern.source}`)
        }
      }

      // Verifica por recursos externos
      const externalResourcePatterns = [/url\s*\(\s*['"]?https?:\/\//i, /@import\s+url\s*\(\s*['"]?https?:\/\//i]

      let hasExternalResources = false
      for (const pattern of externalResourcePatterns) {
        if (pattern.test(css)) {
          hasExternalResources = true
          warnings.push("CSS contains external resources which may not load in SVG context")
        }
      }

      // Verifica tamanho do CSS
      const size = css.length
      if (size > 100000) {
        // 100KB
        warnings.push(`CSS is large (${size} bytes), consider optimization`)
      }

      // Valida sintaxe CSS básica
      try {
        // Tenta criar um elemento style para validar sintaxe
        if (typeof document !== "undefined") {
          const styleElement = document.createElement("style")
          styleElement.textContent = css
          // Limpa
          styleElement.textContent = ""
        }
      } catch (syntaxError) {
        errors.push(`CSS syntax error: ${syntaxError instanceof Error ? syntaxError.message : String(syntaxError)}`)
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        size,
        hasExternalResources,
      }
    } catch (error) {
      this.logger.error(
        `CSS validation failed for plugin: ${pluginName}`,
        error instanceof Error ? error : new Error(String(error))
      )
      errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`)
      return {
        isValid: false,
        errors,
        warnings,
        size: css.length,
        hasExternalResources: false,
      }
    }
  }

  /**
   * Limpa cache de CSS
   */
  clearCache(pluginName?: string): void {
    if (pluginName) {
      // Limpa cache de um plugin específico
      const keysToDelete: string[] = []
      for (const key of this.cssCache.keys()) {
        if (key.startsWith(`${pluginName}-`)) {
          keysToDelete.push(key)
        }
      }

      keysToDelete.forEach((key) => this.cssCache.delete(key))
      this.logger.debug(`CSS cache cleared for plugin: ${pluginName}`, { deletedKeys: keysToDelete.length })
    } else {
      // Limpa todo o cache
      const cacheSize = this.cssCache.size
      this.cssCache.clear()
      this.logger.debug("CSS cache cleared completely", { previousSize: cacheSize })
    }
  }
}
