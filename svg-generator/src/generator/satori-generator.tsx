/**
 * SVG Generator using Satori
 * 
 * Satori é uma biblioteca que converte JSX para SVG com layout engine próprio.
 * Suporta altura dinâmica (height: undefined) e calcula automaticamente.
 * 
 * Limitações do Satori:
 * - Não suporta hooks (useState, useEffect, etc.)
 * - Não suporta <style> tags (precisa estilos inline)
 * - Não suporta Tailwind classes (precisa converter para inline styles)
 * 
 * Estratégia:
 * 1. Renderizar componentes React normalmente (com hooks se necessário)
 * 2. Extrair o HTML renderizado
 * 3. Converter para JSX compatível com Satori (sem hooks, estilos inline)
 * 4. Usar Satori com height: undefined para calcular altura dinamicamente
 */

// This file is not currently used - satori may not be installed
// @ts-expect-error - satori may not be installed, this file is not currently used
import satori from 'satori'
import type { SvgConfig, SvgGenerationResult } from '../types/index'
import { calculateSvgWidth } from './height-calculator'
import { renderPlugins } from '../renderer/react-renderer'
import { loadCss } from './css-loader'
import React from 'react'

/**
 * Carrega font Poppins do Google Fonts
 */
async function loadPoppinsFont(): Promise<ArrayBuffer> {
  try {
    // Poppins Regular (400)
    const response = await fetch('https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2')
    if (!response.ok) {
      throw new Error(`Failed to load Poppins font: ${response.statusText}`)
    }
    return await response.arrayBuffer()
  } catch (error) {
    console.error('[Satori] Failed to load Poppins font:', error)
    throw error
  }
}

/**
 * Cria um container JSX compatível com Satori
 * 
 * Satori não suporta:
 * - <style> tags
 * - foreignObject
 * - className (precisa style inline)
 * 
 * Então criamos um container simples com estilos inline.
 */
function createSatoriContainer(
  width: number,
  children: React.ReactElement,
  style: 'default' | 'terminal',
  size: 'half' | 'full'
): React.ReactElement {
  // Estilos base inline (substituindo Tailwind classes)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: `${width}px`,
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
  }

  return (
    <div style={containerStyle}>
      {children}
    </div>
  )
}

/**
 * Gera SVG usando Satori com altura dinâmica
 * 
 * @param config - Configuração do SVG
 * @returns SVG string e dimensões
 */
export async function generateSvgWithSatori(config: SvgConfig): Promise<SvgGenerationResult> {
  const width = calculateSvgWidth(config.size)

  console.log('[Satori Generator] 🚀 Starting SVG generation with Satori...')
  console.log('[Satori Generator] 📐 Width:', width)

  // 1. Carregar font Poppins
  console.log('[Satori Generator] 📝 Loading Poppins font...')
  const poppinsFont = await loadPoppinsFont()
  console.log('[Satori Generator] ✅ Font loaded')

  // 2. Renderizar plugins (React normal)
  console.log('[Satori Generator] 🎨 Rendering plugins...')
  const { element: pluginsContent, pluginsData, pluginsErrors } = await renderPlugins(config)
  console.log('[Satori Generator] ✅ Plugins rendered')

  // 3. Criar container JSX compatível com Satori
  const container = createSatoriContainer(
    width,
    pluginsContent,
    config.style || 'default',
    config.size || 'half'
  )

  // 4. Gerar SVG com Satori (altura dinâmica)
  console.log('[Satori Generator] 🎯 Generating SVG with dynamic height...')
  const svg = await satori(container, {
    width,
    height: undefined, // Altura dinâmica - Satori calcula automaticamente
    fonts: [
      {
        name: 'Poppins',
        data: poppinsFont,
        weight: 400,
        style: 'normal',
      },
    ],
  })

  // 5. Extrair altura do SVG gerado
  const heightMatch = svg.match(/height="(\d+)"/)
  const height = heightMatch ? Number(heightMatch[1]) : 800 // Fallback se não encontrar

  console.log(`[Satori Generator] ✅ SVG generated: ${width}x${height}px`)

  // 6. Retornar resultado
  const result: any = {
    svg,
    width,
    height,
  }

  // Adicionar debug info se necessário
  if (config.dev) {
    result._debug = {
      pluginsData,
      pluginsErrors: Object.fromEntries(
        Object.entries(pluginsErrors).map(([key, error]) => [
          key,
          error.message || String(error)
        ])
      ),
      measurementMethod: 'satori-dynamic',
    }
  }

  return result
}

