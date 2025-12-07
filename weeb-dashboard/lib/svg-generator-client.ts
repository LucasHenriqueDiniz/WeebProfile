/**
 * Cliente para o svg-generator HTTP service
 * 
 * Este arquivo faz requisições HTTP para o serviço svg-generator,
 * que é responsável por buscar essential configs e gerar SVGs.
 */

interface GenerateSvgRequest {
  style: string
  size: string
  plugins?: Record<string, any>
  pluginsOrder?: string[]
  customCss?: string
  theme?: string // Generic theme (mapped by server based on style)
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customThemeColors?: Record<string, string>
  userId?: string // userId para buscar essential configs no Supabase
  mock?: boolean
  debug?: boolean
}

interface GenerateSvgResponse {
  success: boolean
  svg: string
  width: number
  height: number
  debug?: {
    config: any
    pluginsData: any
    pluginsErrors: any
  }
}

import { env } from "./config/env"

/**
 * Gera SVG usando o svg-generator HTTP service
 * 
 * @param config - Configuração do SVG
 * @returns Resultado da geração
 */

export async function generateSvgViaHttpService(
  config: GenerateSvgRequest
): Promise<GenerateSvgResponse> {
  const svgGeneratorUrl = env.svgGeneratorUrl

  console.log(`📤 [CLIENT] Sending request to ${svgGeneratorUrl}`)
  console.log(`📤 [CLIENT] Request config:`, JSON.stringify(config, null, 2))

  const response = await fetch(svgGeneratorUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    console.error(`📤 [CLIENT] Error response:`, error)
    throw new Error(error.error || error.message || `HTTP ${response.status}`)
  }

  const result = await response.json()
  console.log(`📤 [CLIENT] Success response received, SVG size: ${result.width}x${result.height}`)
  return result
}

