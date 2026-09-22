/**
 * Opções para medição de altura
 */
export interface HeightMeasurementOptions {
  html: string
  width: number
  css?: string
  timeoutMs?: number
  allowNetwork?: boolean
  size?: "half" | "full"
  style?: "default" | "terminal"
}

/**
 * Resultado da medição de altura
 */
export interface HeightMeasurementResult {
  height: number
  measurementTime: number
  strategy: string
  metadata?: Record<string, unknown>
}

/**
 * Interface para medição de altura de conteúdo HTML
 * Abstrai diferentes estratégias de medição (Playwright, DOM virtual, etc)
 */
export interface IHeightMeasurer {
  /**
   * Mede a altura do conteúdo HTML
   * @param options Opções de medição
   * @returns Resultado da medição
   */
  measureHeight(options: HeightMeasurementOptions): Promise<HeightMeasurementResult>

  /**
   * Valida se o HTML pode ser medido
   * @param html Conteúdo HTML
   * @returns Resultado da validação
   */
  validateHtml(html: string): Promise<HtmlValidationResult>

  /**
   * Obtém as estratégias disponíveis
   * @returns Lista de estratégias de medição
   */
  getAvailableStrategies(): MeasurementStrategy[]
}

/**
 * Resultado da validação de HTML
 */
export interface HtmlValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  estimatedComplexity: "low" | "medium" | "high"
}

/**
 * Estratégia de medição de altura
 */
export interface MeasurementStrategy {
  name: string
  description: string
  isAvailable: boolean
  priority: number
  measure(options: HeightMeasurementOptions): Promise<HeightMeasurementResult>
}

/**
 * Configuração do medidor de altura
 */
export interface HeightMeasurerConfig {
  defaultStrategy?: string
  fallbackStrategies?: string[]
  timeoutMs?: number
  retryAttempts?: number
  enableCache?: boolean
}
