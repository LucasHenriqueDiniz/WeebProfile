import { measureHeight } from "../../infrastructure/browser/measure-height"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import type {
  HeightMeasurementOptions,
  HeightMeasurementResult,
  IHeightMeasurer,
  MeasurementStrategy,
} from "../interfaces/IHeightMeasurer"

/**
 * Estratégia de medição de altura usando Playwright
 * Implementação padrão para medição precisa de altura
 */
export class PlaywrightHeightMeasurementStrategy implements MeasurementStrategy {
  name = "playwright"
  description = "Uses Playwright browser automation for accurate height measurement"
  isAvailable = true
  priority = 1

  async measure(options: HeightMeasurementOptions): Promise<HeightMeasurementResult> {
    const startTime = Date.now()
    const logger = LoggerFactory.getLogger("PlaywrightHeightMeasurement")

    try {
      logger.debug("Starting Playwright height measurement", {
        width: options.width,
        timeoutMs: options.timeoutMs,
        size: options.size,
        style: options.style,
      })

      const height = await measureHeight({
        html: options.html,
        css: options.css,
        width: options.width,
        size: options.size,
        style: options.style,
        timeoutMs: options.timeoutMs || 5000,
      })

      const measurementTime = Date.now() - startTime
      logger.debug("Playwright height measurement completed", { height, measurementTime })

      return {
        height,
        measurementTime,
        strategy: this.name,
        metadata: {
          width: options.width,
          timeoutMs: options.timeoutMs,
          hasCss: !!options.css,
        },
      }
    } catch (error) {
      logger.error("Playwright height measurement failed", error instanceof Error ? error : new Error(String(error)))

      // Lança erro sem fallback - Playwright é obrigatório
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Playwright height measurement failed: ${errorMessage}`)
    }
  }
}

/**
 * Implementação do IHeightMeasurer com apenas Playwright
 */
export class HeightMeasurer implements IHeightMeasurer {
  private strategies: MeasurementStrategy[] = []
  private logger = LoggerFactory.getLogger("HeightMeasurer")

  constructor() {
    // Registra apenas estratégia Playwright
    this.strategies.push(new PlaywrightHeightMeasurementStrategy())

    // Remove automatic logging to avoid issues with concurrent execution
    // this.logger.info("HeightMeasurer initialized with Playwright-only strategy")
  }

  async measureHeight(options: HeightMeasurementOptions): Promise<HeightMeasurementResult> {
    this.logger.debug("Starting height measurement", {
      strategyCount: this.strategies.length,
      width: options.width,
    })

    // Usa apenas a estratégia Playwright
    const strategy = this.strategies[0]

    if (!strategy || !strategy.isAvailable) {
      throw new Error("Playwright is not available for height measurement")
    }

    try {
      this.logger.debug(`Using strategy: ${strategy.name}`)
      const result = await strategy.measure(options)

      this.logger.info(`Height measurement successful`, {
        strategy: strategy.name,
        height: result.height,
        measurementTime: result.measurementTime,
      })

      return result
    } catch (error) {
      this.logger.error(`Strategy failed: ${strategy.name}`, error instanceof Error ? error : undefined)
      throw error
    }
  }

  async validateHtml(html: string): Promise<import("../interfaces/IHeightMeasurer").HtmlValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    // Validações básicas
    if (!html || html.trim().length === 0) {
      errors.push("HTML is empty")
      return {
        isValid: false,
        errors,
        warnings,
        estimatedComplexity: "low",
      }
    }

    // Verifica por HTML malformado
    const openTags = (html.match(/<[^/][^>]*>/g) || []).length
    const closeTags = (html.match(/<\/[^>]*>/g) || []).length

    if (Math.abs(openTags - closeTags) > 2) {
      warnings.push("HTML may have mismatched tags")
    }

    // Estima complexidade
    const textLength = html.replace(/<[^>]*>/g, "").length
    const tagCount = (html.match(/<[^>]*>/g) || []).length
    const hasComplexElements = /<(svg|canvas|video|audio|iframe)/i.test(html)

    let complexity: "low" | "medium" | "high" = "low"
    if (textLength > 1000 || tagCount > 50 || hasComplexElements) {
      complexity = "high"
    } else if (textLength > 500 || tagCount > 20) {
      complexity = "medium"
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedComplexity: complexity,
    }
  }

  getAvailableStrategies(): MeasurementStrategy[] {
    return this.strategies.filter((strategy) => strategy.isAvailable)
  }

  /**
   * Adiciona uma estratégia customizada
   */
  addStrategy(strategy: MeasurementStrategy): void {
    this.logger.warn(`Adding custom strategy: ${strategy.name} - Playwright-only mode recommended`)
    this.strategies.push(strategy)
    this.strategies.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Remove uma estratégia pelo nome
   */
  removeStrategy(name: string): boolean {
    if (name === "playwright") {
      this.logger.error("Cannot remove Playwright strategy - it's required")
      return false
    }

    const index = this.strategies.findIndex((s) => s.name === name)
    if (index !== -1) {
      this.strategies.splice(index, 1)
      this.logger.debug(`Removed strategy: ${name}`)
      return true
    }
    return false
  }

  /**
   * Verifica se Playwright está disponível
   */
  isPlaywrightAvailable(): boolean {
    const strategy = this.strategies.find((s) => s.name === "playwright")
    return strategy?.isAvailable || false
  }
}
