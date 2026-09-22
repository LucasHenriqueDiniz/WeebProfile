import React from "react"
import { renderToString } from "react-dom/server"
import { ConfigManager } from "../../core/config/ConfigManager"
import { ValidationError } from "../../core/errors/AppError"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import type { SvgConfig, SvgGenerationResult } from "../../shared/types"
import type { ICssAggregator } from "../interfaces/ICssAggregator"
import type { IHeightMeasurer } from "../interfaces/IHeightMeasurer"
import type { IRenderer } from "../interfaces/IRenderer"
import type { GenerationMetrics, ISvgGenerator, ValidationResult } from "../interfaces/ISvgGenerator"

/**
 * Serviço principal de geração de SVG
 * Implementa ISvgGenerator e orquestra todo o processo
 */
export class SvgGeneratorService implements ISvgGenerator {
  private logger = LoggerFactory.getLogger("SvgGeneratorService")
  private metrics: GenerationMetrics = {
    totalTime: 0,
    renderTime: 0,
    heightMeasurementTime: 0,
    cssLoadTime: 0,
    svgCreationTime: 0,
    pluginCount: 0,
    errorsCount: 0,
    warningsCount: 0,
  }

  constructor(
    private renderer: IRenderer,
    private heightMeasurer: IHeightMeasurer,
    private cssAggregator: ICssAggregator,
    private configManager: ConfigManager = ConfigManager.getInstance()
  ) {}

  /**
   * Gera um SVG completo a partir da configuração
   */
  async generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
    const startTime = Date.now()
    this.logger.info("Starting SVG generation", {
      pluginCount: Object.keys(config.plugins || {}).length,
      size: config.size,
      style: config.style,
    })

    try {
      // 1. Valida configuração
      const validation = await this.validateConfig(config)
      if (!validation.isValid) {
        throw new ValidationError(`Invalid configuration: ${validation.errors.join(", ")}`, {
          errors: validation.errors,
        })
      }

      // 2. Renderiza plugins
      this.logger.debug("Rendering plugins...")
      const renderStartTime = Date.now()
      const { element, pluginsData, pluginsErrors } = await this.renderer.renderPlugins(config)
      this.metrics.renderTime = Date.now() - renderStartTime
      this.metrics.pluginCount = Object.keys(pluginsData).length
      this.metrics.errorsCount = Object.keys(pluginsErrors).length

      // 3. Converte para HTML
      const width = config.size === "half" ? 415 : 830
      const { html, css } = await this.renderer.reactToHtml(element, config, width)

      // 4. Mede altura
      this.logger.debug("Measuring height...")
      const heightStartTime = Date.now()
      const playwrightConfig = this.configManager.getPlaywrightConfig()
      const heightResult = await this.heightMeasurer.measureHeight({
        html,
        css,
        width,
        size: config.size,
        style: config.style,
        timeoutMs: playwrightConfig.timeout,
      })
      this.metrics.heightMeasurementTime = Date.now() - heightStartTime

      // 5. Carrega CSS dos plugins
      this.logger.debug("Loading CSS...")
      const cssStartTime = Date.now()
      const { cssDefs } = await this.cssAggregator.loadCss(config)
      this.metrics.cssLoadTime = Date.now() - cssStartTime

      // 6. Cria container SVG
      this.logger.debug("Creating SVG container...")
      const svgStartTime = Date.now()
      const svgElement = await this.createSvgContainer({
        width,
        height: heightResult.height,
        config,
        cssDefs,
        children: element,
      })
      this.metrics.svgCreationTime = Date.now() - svgStartTime

      // 7. Renderiza para string
      const svg = renderToString(svgElement)

      // 8. Calcula métricas finais
      this.metrics.totalTime = Date.now() - startTime
      this.metrics.warningsCount = validation.warnings.length

      const result: SvgGenerationResult = {
        svg,
        height: heightResult.height,
        width,
      debug: {
        config: this.sanitizeConfig(config),
        pluginsData,
        pluginsErrors: Object.fromEntries(
          Object.entries(pluginsErrors).map(([key, error]) => [key, error.message || String(error)])
        ),
        metrics: this.metrics,
        heightMeasurementStrategy: heightResult.strategy,
      },
      }

      this.logger.info("SVG generation completed", {
        totalTime: this.metrics.totalTime,
        height: heightResult.height,
        width,
        successCount: this.metrics.pluginCount,
        errorCount: this.metrics.errorsCount,
      })

      return result
    } catch (error) {
      this.logger.error("SVG generation failed", error instanceof Error ? error : new Error(String(error)))
      throw error
    }
  }

  /**
   * Valida a configuração antes da geração
   */
  async validateConfig(config: SvgConfig): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Validações básicas
      if (!config.style || !config.size) {
        errors.push("Style and size are required")
      }

      if (!["default", "terminal"].includes(config.style)) {
        errors.push("Style must be 'default' or 'terminal'")
      }

      if (!["half", "full"].includes(config.size)) {
        errors.push("Size must be 'half' or 'full'")
      }

      // Valida plugins
      if (!config.plugins || Object.keys(config.plugins).length === 0) {
        warnings.push("No plugins configured")
      } else {
        let enabledPlugins = 0
        for (const [pluginName, pluginConfig] of Object.entries(config.plugins)) {
          if (pluginConfig?.enabled) {
            enabledPlugins++
            // Valida plugin individualmente
            const validation = await this.renderer.validatePlugin(pluginName, pluginConfig)
            if (!validation.canRender) {
              errors.push(...validation.errors.map((err) => `${pluginName}: ${err}`))
            }
            warnings.push(...validation.warnings.map((warn) => `${pluginName}: ${warn}`))
          }
        }

        if (enabledPlugins === 0) {
          errors.push("At least one plugin must be enabled")
        }
      }

      // Valida configurações do ConfigManager
      try {
        const configManager = ConfigManager.getInstance()
        const serverConfig = configManager.getServerConfig()
        const playwrightConfig = configManager.getPlaywrightConfig()

        if (config.size === "half" && serverConfig.port < 3000) {
          warnings.push("Half size may not display correctly on low port numbers")
        }

        if (playwrightConfig.timeout < 1000) {
          warnings.push("Playwright timeout is very low, may cause measurement failures")
        }
      } catch (configError) {
        warnings.push(
          `Configuration validation warning: ${configError instanceof Error ? configError.message : String(configError)}`
        )
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      }
    } catch (error) {
      this.logger.error("Configuration validation failed", error instanceof Error ? error : new Error(String(error)))
      errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`)
      return { isValid: false, errors, warnings }
    }
  }

  /**
   * Obtém métricas de performance da última geração
   */
  getMetrics(): GenerationMetrics {
    return { ...this.metrics }
  }

  /**
   * Cria o container SVG com os plugins
   */
  private async createSvgContainer(params: {
    width: number
    height: number
    config: SvgConfig
    cssDefs: string
    children: React.ReactElement
  }): Promise<React.ReactElement> {
    try {
      // Importa dinamicamente para evitar issues no client
      const { createSvgContainer } = await import("../../renderer/template-renderer")

      return createSvgContainer({
        width: params.width,
        height: params.height,
        size: params.config.size,
        style: params.config.style,
        cssDefs: params.cssDefs,
        children: params.children,
        terminalTheme: params.config.terminalTheme,
        defaultTheme: params.config.defaultTheme,
        hideTerminalHeader: params.config.hideTerminalHeader,
        hideTerminalEmojis: params.config.hideTerminalEmojis,
      })
    } catch (error) {
      this.logger.error("Failed to create SVG container", error instanceof Error ? error : new Error(String(error)))
      return React.createElement(
        "div",
        {
          className: "svg-container-fallback",
          style: { width: params.width, height: params.height, border: "1px solid red" },
        },
        "SVG Container Error"
      )
    }
  }

  /**
   * Sanitiza configuração removendo dados sensíveis
   */
  private sanitizeConfig(config: SvgConfig): SvgConfig {
    return {
      ...config,
      essentialConfigs: undefined, // Remove dados sensíveis
    }
  }

  /**
   * Reseta métricas
   */
  resetMetrics(): void {
    this.metrics = {
      totalTime: 0,
      renderTime: 0,
      heightMeasurementTime: 0,
      cssLoadTime: 0,
      svgCreationTime: 0,
      pluginCount: 0,
      errorsCount: 0,
      warningsCount: 0,
    }
  }
}
