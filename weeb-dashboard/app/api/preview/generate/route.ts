import { NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/config/env"

/**
 * POST /api/preview/generate - Gerar preview de SVG usando core-v2
 * 
 * Esta rota chama um serviço Node.js separado que gera o SVG.
 * Isso evita completamente que o Turbopack analise o código do core-v2.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // DEBUG: Log da config recebida pela API route
    console.log("🔵 [API-ROUTE] Config recebida:", JSON.stringify(body, null, 2))
    console.log("🔵 [API-ROUTE] Custom Theme Colors:", body.customThemeColors)
    console.log("🔵 [API-ROUTE] Plugins Order:", body.pluginsOrder)
    
    // Validar configuração básica
    if (!body.style || !body.size) {
      return NextResponse.json(
        { error: "style and size are required" },
        { status: 400 }
      )
    }

    // URL do serviço SVG Generator
    // Em desenvolvimento: localhost:3001
    // Em produção: pode ser um serviço separado ou mesma instância
    const svgGeneratorUrl = env.svgGeneratorUrl

    // Chamar serviço separado para gerar SVG
    const response = await fetch(svgGeneratorUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json(
        {
          error: "Failed to generate preview",
          message: error.error || error.message || `HTTP ${response.status}`,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calling SVG generator service:", error)
    
    // Se o serviço não estiver rodando, dar mensagem clara
    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        {
          error: "SVG Generator service not available",
          message:
            "Make sure the SVG generator service is running: pnpm dev:svg-generator",
          details: error.message,
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      {
        error: "Failed to generate preview",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
