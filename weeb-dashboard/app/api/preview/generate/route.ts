import { NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/config/env"
import { generateSvgViaHttpService } from "@/lib/svg-generator-client"

/**
 * POST /api/preview/generate - Gerar preview de SVG usando core-v2
 * 
 * Esta rota chama um serviço Node.js separado que gera o SVG.
 * Isso evita completamente que o Turbopack analise o código do core-v2.
 * 
 * Usa retry automático com backoff exponencial para lidar com cold starts do Railway.
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

    // Usar o cliente com retry automático
    const result = await generateSvgViaHttpService(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calling SVG generator service:", error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check if it's a Vercel timeout error (cold start do Railway)
    const isVercelTimeout = 
      errorMessage.includes("Vercel Runtime Timeout") ||
      errorMessage.includes("Task timed out after") ||
      errorMessage.includes("Function execution exceeded")
    
    // Se o serviço não estiver rodando ou for timeout, dar mensagem clara
    if (isVercelTimeout || (error instanceof Error && (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ECONNRESET") ||
      error.message.includes("timeout")
    ))) {
      return NextResponse.json(
        {
          error: "Service starting up",
          code: isVercelTimeout ? "VERCEL_TIMEOUT" : "SERVICE_UNAVAILABLE",
          message:
            "O serviço de geração está acordando. Por favor, aguarde alguns segundos e tente novamente.",
          details: errorMessage,
          retryable: true,
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
