/**
 * Main SVG Generator - Refactored Architecture
 *
 * This is the new implementation using Clean Architecture principles.
 * The old implementation has been moved to legacy/svg-generator.ts
 *
 * Architecture:
 * - ISvgGenerator: Interface for generation contract
 * - SvgGeneratorService: Main orchestrator
 * - RenderService: Plugin rendering abstraction
 * - HeightMeasurer: Height measurement with strategies
 * - CssAggregatorService: CSS aggregation and validation
 */

import { LoggerFactory } from "../infrastructure/logging/LoggerFactory"
import type { SvgConfig, SvgGenerationResult } from "../shared/types"
import type { ISvgGenerator } from "./interfaces/ISvgGenerator"
import { CssAggregatorService } from "./services/CssAggregatorService"
import { RenderService } from "./services/RenderService"
import { SvgGeneratorService } from "./services/SvgGeneratorService"
import { HeightMeasurer } from "./strategies/HeightMeasurementStrategy"

/**
 * Factory para criar instâncias do SvgGenerator
 * Centraliza a configuração de dependências
 */
export class SvgGeneratorFactory {
  private static instance: SvgGeneratorFactory
  private generator: ISvgGenerator | null = null

  private constructor() {}

  static getInstance(): SvgGeneratorFactory {
    if (!SvgGeneratorFactory.instance) {
      SvgGeneratorFactory.instance = new SvgGeneratorFactory()
    }
    return SvgGeneratorFactory.instance
  }

  /**
   * Cria uma instância do SvgGenerator com todas as dependências
   */
  createGenerator(): ISvgGenerator {
    if (this.generator) {
      return this.generator
    }

    const logger = LoggerFactory.getLogger("SvgGeneratorFactory")
    logger.debug("Creating SvgGenerator with new architecture")

    // Cria serviços
    const renderer = new RenderService()
    const heightMeasurer = new HeightMeasurer()
    const cssAggregator = new CssAggregatorService()

    // Cria serviço principal
    this.generator = new SvgGeneratorService(renderer, heightMeasurer, cssAggregator)

    logger.info("SvgGenerator created successfully", {
      renderer: "RenderService",
      heightMeasurer: "HeightMeasurer",
      cssAggregator: "CssAggregatorService",
    })

    return this.generator
  }

  /**
   * Reseta a instância (útil para testes)
   */
  reset(): void {
    this.generator = null
  }
}

/**
 * Função principal para geração de SVG
 * Mantém compatibilidade com a API original
 *
 * @param config - Configuração do SVG
 * @returns Resultado da geração
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  const generator = SvgGeneratorFactory.getInstance().createGenerator()
  return generator.generateSvg(config)
}

/**
 * Exporta a classe principal para uso avançado
 */
export { SvgGeneratorService as SvgGenerator }

// Exporta serviços individuais para uso customizado
export { CssAggregatorService } from "./services/CssAggregatorService"
export { RenderService } from "./services/RenderService"
export { HeightMeasurer, PlaywrightHeightMeasurementStrategy } from "./strategies/HeightMeasurementStrategy"

// Exporta interfaces para implementações customizadas
export type {
  GenerationMetrics,
  ISvgGenerator,
  SvgGeneratorOptions,
  ValidationResult,
} from "./interfaces/ISvgGenerator"

export type {
  HtmlAndCss,
  IRenderer,
  PluginValidationResult,
  RenderOptions,
  RenderResult,
  RenderStrategy,
} from "./interfaces/IRenderer"

export type {
  HeightMeasurementOptions,
  HeightMeasurementResult,
  HeightMeasurerConfig,
  HtmlValidationResult,
  IHeightMeasurer,
  MeasurementStrategy,
} from "./interfaces/IHeightMeasurer"

export type {
  CssAggregationResult,
  CssOptimizationOptions,
  CssOptimizationStrategy,
  CssValidationResult,
  ICssAggregator,
} from "./interfaces/ICssAggregator"
