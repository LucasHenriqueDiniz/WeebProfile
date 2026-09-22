import type { SvgConfig, SvgGenerationResult } from "../../shared/types"

/**
 * Interface principal para geração de SVG
 * Define o contrato para qualquer implementação de gerador SVG
 */
export interface ISvgGenerator {
  /**
   * Gera um SVG completo a partir da configuração
   * @param config Configuração do SVG
   * @returns Resultado da geração com SVG e dimensões
   */
  generateSvg(config: SvgConfig): Promise<SvgGenerationResult>

  /**
   * Valida a configuração antes da geração
   * @param config Configuração a ser validada
   * @returns Resultado da validação
   */
  validateConfig(config: SvgConfig): Promise<ValidationResult>

  /**
   * Obtém métricas de performance da última geração
   * @returns Métricas de performance
   */
  getMetrics(): GenerationMetrics
}

/**
 * Resultado da validação de configuração
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Métricas de performance da geração
 */
export interface GenerationMetrics {
  totalTime: number
  renderTime: number
  heightMeasurementTime: number
  cssLoadTime: number
  svgCreationTime: number
  pluginCount: number
  errorsCount: number
  warningsCount: number
}

/**
 * Opções para geração de SVG
 */
export interface SvgGeneratorOptions {
  enableMetrics?: boolean
  enableDebug?: boolean
  timeoutMs?: number
  retryAttempts?: number
}
