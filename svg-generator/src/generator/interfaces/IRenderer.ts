import React from "react"
import type { SvgConfig } from "../../shared/types"

/**
 * Resultado da renderização de plugins
 */
export interface RenderResult {
  element: React.ReactElement
  pluginsData: Record<string, unknown>
  pluginsErrors: Record<string, Error>
  renderTime: number
}

/**
 * Interface para renderização de componentes
 * Abstrai a renderização React para permitir diferentes estratégias
 */
export interface IRenderer {
  /**
   * Renderiza os plugins ativos
   * @param config Configuração do SVG
   * @returns Resultado da renderização com elemento e dados
   */
  renderPlugins(config: SvgConfig): Promise<RenderResult>

  /**
   * Converte elemento React para HTML
   * @param element Elemento React
   * @param config Configuração do SVG
   * @param width Largura do container
   * @returns HTML e CSS gerados
   */
  reactToHtml(element: React.ReactElement, config: SvgConfig, width: number): Promise<HtmlAndCss>

  /**
   * Valida se um plugin pode ser renderizado
   * @param pluginName Nome do plugin
   * @param config Configuração do plugin
   * @returns Resultado da validação
   */
  validatePlugin(pluginName: string, config: Record<string, unknown>): Promise<PluginValidationResult>
}

/**
 * Resultado da conversão React para HTML
 */
export interface HtmlAndCss {
  html: string
  css: string
}

/**
 * Resultado da validação de plugin
 */
export interface PluginValidationResult {
  canRender: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Estratégia de renderização
 */
export interface RenderStrategy {
  name: string
  description: string
  render(element: React.ReactElement, options?: RenderOptions): Promise<string>
}

/**
 * Opções de renderização
 */
export interface RenderOptions {
  width?: number
  height?: number
  includeCss?: boolean
  minify?: boolean
  timeoutMs?: number
}
