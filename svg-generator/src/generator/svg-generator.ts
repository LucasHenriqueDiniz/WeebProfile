/**
 * Gerador principal de SVG
 *
 * Coordena a geração completa do SVG:
 * 1. Calcula dimensões usando cálculo manual
 * 2. Carrega CSS
 * 3. Renderiza componentes React
 * 4. Retorna SVG final
 *
 * IMPORTANTE: Este módulo é server-only e usa renderToString do react-dom/server
 * que só funciona no ambiente Node.js. Nunca deve ser importado no cliente.
 */

import { renderToString } from "react-dom/server"
import type { SvgConfig, SvgGenerationResult } from "../types/index.js"
import { calculateEstimatedHeight, calculateSvgWidth } from "./height-calculator.js"
import { measureActualHeight } from "./height-measurer.js"
import { loadCss } from "./css-loader.js"
import { renderPlugins } from "../renderer/react-renderer.js"
import { createSvgContainer } from "../renderer/template-renderer.js"

/**
 * Gera SVG a partir da configuração
 *
 * @param config - Configuração do SVG
 * @returns SVG string e dimensões
 */
export async function generateSvg(config: SvgConfig): Promise<SvgGenerationResult> {
  // 1. Calcular dimensões
  // Se useRealMeasurement=true, primeiro gera com altura estimada, depois mede real
  // Se false ou não definido, usa apenas cálculo estimado (rápido)
  let height = await calculateEstimatedHeight(config)
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

  // 6. Se useRealMeasurement=true, mede altura real e re-gera se necessário
  if (config.useRealMeasurement === true) {
    try {
      const actualHeight = await measureActualHeight(svg, config)
      
      // Se diferença for significativa (>50px), re-gera com altura correta
      if (Math.abs(actualHeight - height) > 50) {
        console.log(`[SVG Generator] 📏 Height difference detected (${height}px → ${actualHeight}px), regenerating...`)
        
        // Re-criar container com altura correta
        const correctedSvgElement = createSvgContainer({
          width,
          height: actualHeight,
          size: config.size,
          style: config.style,
          cssDefs,
          children: pluginsContent,
          terminalTheme: config.terminalTheme,
          defaultTheme: config.defaultTheme,
          hideTerminalHeader: config.hideTerminalHeader,
          hideTerminalEmojis: config.hideTerminalEmojis,
        })
        
        // Re-renderizar
        const correctedSvg = renderToString(correctedSvgElement)
        height = actualHeight
        
        const result: any = {
          svg: correctedSvg,
          height,
          width,
        }

        result._debug = {
          pluginsData,
          pluginsErrors: Object.fromEntries(
            Object.entries(pluginsErrors).map(([key, error]) => [key, error.message || String(error)])
          ),
          measurementMethod: 'real',
          estimatedHeight: height,
          actualHeight: actualHeight,
        }

        return result
      } else {
        console.log(`[SVG Generator] ✅ Height is accurate (${height}px ≈ ${actualHeight}px)`)
      }
    } catch (error) {
      console.warn('[SVG Generator] ⚠️ Real measurement failed, using estimated height:', error)
    }
  }

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
    measurementMethod: config.useRealMeasurement ? 'real' : 'estimated',
  }

  return result
}
