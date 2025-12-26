/**
 * Gerador principal de SVG
 *
 * Coordena a geração completa do SVG:
 * 1. Renderiza componentes React
 * 2. Mede altura renderizada com Playwright
 * 3. Carrega CSS
 * 4. Cria container SVG com altura medida
 * 5. Retorna SVG final
 *
 * IMPORTANTE: Este módulo é server-only e usa renderToString do react-dom/server
 * e Playwright para medição de altura. Nunca deve ser importado no cliente.
 */

import { renderToString } from "react-dom/server"
import type { SvgConfig, SvgGenerationResult } from "../types/index.js"
import { calculateSvgWidth } from "./height-calculator.js"
import { loadCss } from "./css-loader.js"
import { renderPlugins } from "../renderer/react-renderer.js"
import { createSvgContainer } from "../renderer/template-renderer.js"
import { measureHeight } from "../layout/measure-height.js"
import { reactToHtml } from "../layout/react-to-html.js"

/**
 * Gera SVG a partir da configuração
 *
 * @param config - Configuração do SVG
 * @returns SVG string e dimensões
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  const width = calculateSvgWidth(config.size)

  // 1. Renderizar plugins (fazer uma vez só)
  const { element: pluginsContent, pluginsData, pluginsErrors } = await renderPlugins(config)

  // 2. Calcular altura com Playwright (sempre usado)
  console.log('[SVG Generator] 📏 Measuring height with Playwright...')
  
  // Converter React para HTML
  const { html } = await reactToHtml(pluginsContent, config, width)
  
  // Medir altura com Playwright
  const height = await measureHeight({
    html,
    width,
    timeoutMs: 5000,
  })
  
  console.log(`[SVG Generator] ✅ Height measured: ${height}px`)

  // 3. Carregar CSS
  const cssDefs = await loadCss(config)

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
      Object.entries(pluginsErrors).map(([key, error]) => [key, error.message || String(error)])
    ),
  }

  return result
}
