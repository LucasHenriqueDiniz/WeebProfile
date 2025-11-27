/**
 * Gerador principal de SVG
 * 
 * Coordena a geração completa do SVG:
 * 1. Calcula dimensões usando cálculo manual (sem Puppeteer)
 * 2. Carrega CSS
 * 3. Renderiza componentes React
 * 4. Retorna SVG final
 * 
 * IMPORTANTE: Este módulo é server-only e usa renderToString do react-dom/server
 * que só funciona no ambiente Node.js. Nunca deve ser importado no cliente.
 */

import { renderToString } from 'react-dom/server'
import type { SvgConfig, SvgGenerationResult } from '../types/index.js'
import { calculateEstimatedHeight, calculateSvgWidth } from './height-calculator.js'
import { loadCss } from './css-loader.js'
import { renderPlugins } from '../renderer/react-renderer.js'
import { createSvgContainer } from '../renderer/template-renderer.js'

/**
 * Gera SVG a partir da configuração
 * 
 * @param config - Configuração do SVG
 * @returns SVG string e dimensões
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  // 1. Calcular dimensões usando cálculo manual (sem Puppeteer)
  const height = await calculateEstimatedHeight(config)
  const width = calculateSvgWidth(config.size)

  // 2. Carregar CSS
  const cssDefs = await loadCss(config)

  // 3. Renderizar plugins
  const { element: pluginsContent, pluginsData, pluginsErrors } = await renderPlugins(config)

  // 4. Criar container SVG
  const svgElement = createSvgContainer({
    width,
    height,
    size: config.size,
    style: config.style,
    cssDefs,
    children: pluginsContent,
    terminalTheme: config.terminalTheme,
    defaultTheme: config.defaultTheme,
    hideTerminalHeader: config.hideTerminalHeader,
    hideTerminalEmojis: config.hideTerminalEmojis,
  })

  // 5. Renderizar para string
  const svg = renderToString(svgElement)

  const result: any = {
    svg,
    height,
    width,
  }

  // Adicionar debug info internamente (será usado pelo servidor)
  result._debug = {
    pluginsData,
    pluginsErrors: Object.fromEntries(
      Object.entries(pluginsErrors).map(([key, error]) => [
        key,
        error.message || String(error),
      ])
    ),
  }

  return result
}
