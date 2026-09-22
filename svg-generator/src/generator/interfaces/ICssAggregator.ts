import type { SvgConfig } from "../../shared/types"

/**
 * Resultado da agregação de CSS
 */
export interface CssAggregationResult {
  cssDefs: string
  loadTime: number
  pluginCount: number
  warnings: string[]
}

/**
 * Interface para agregação de CSS dos plugins
 * Centraliza o carregamento e processamento de estilos
 */
export interface ICssAggregator {
  /**
   * Carrega e agrega CSS de todos os plugins ativos
   * @param config Configuração do SVG
   * @returns CSS agregado e metadados
   */
  loadCss(config: SvgConfig): Promise<CssAggregationResult>

  /**
   * Carrega CSS de um plugin específico
   * @param pluginName Nome do plugin
   * @param config Configuração do plugin
   * @returns CSS do plugin
   */
  loadPluginCss(pluginName: string, config: Record<string, unknown>): Promise<string>

  /**
   * Valida CSS antes da inclusão
   * @param css Conteúdo CSS
   * @param pluginName Nome do plugin (para contexto)
   * @returns Resultado da validação
   */
  validateCss(css: string, pluginName?: string): Promise<CssValidationResult>

  /**
   * Limpa cache de CSS
   * @param pluginName Nome do plugin (opcional, se não informado limpa tudo)
   */
  clearCache(pluginName?: string): void
}

/**
 * Resultado da validação de CSS
 */
export interface CssValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  size: number
  hasExternalResources: boolean
}

/**
 * Estratégia de otimização de CSS
 */
export interface CssOptimizationStrategy {
  name: string
  description: string
  optimize(css: string, options?: CssOptimizationOptions): Promise<string>
}

/**
 * Opções de otimização de CSS
 */
export interface CssOptimizationOptions {
  minify?: boolean
  removeUnused?: boolean
  inlineCritical?: boolean
  preserveComments?: boolean
}
