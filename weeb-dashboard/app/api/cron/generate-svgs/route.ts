/**
 * CRON Job - Gerar SVGs pendentes
 *
 * Esta rota é chamada periodicamente (via Vercel Cron ou GitHub Actions)
 * para gerar SVGs que precisam ser atualizados.
 *
 * Configurar no vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/generate-svgs",
 *     "schedule": "0 * * * *" // A cada hora
 *   }]
 * }
 */

import { db } from "@/lib/db"
import { svgs } from "@/lib/db/schema"
import { eq, or, lte, isNull } from "drizzle-orm"
import { NextResponse } from "next/server"
import { convertSvgToPluginsConfig, generateDataHash, saveSvgToStorage } from "@/lib/svg-generator"
import { generateSvgViaHttpService } from "@/lib/svg-generator-client"
import { env } from "@/lib/config/env"
import { getTerminalConfigs } from "@/lib/config/svg-config-helpers"

/**
 * GET /api/cron/generate-svgs - Executar cron job
 *
 * Busca SVGs que precisam ser gerados/atualizados e processa em lote.
 */

export async function GET(request: Request) {
  // Verificar se é uma requisição autorizada (Vercel Cron ou secret)
  const authHeader = request.headers.get("authorization")
  const cronSecret = env.cronSecret

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()

    // Buscar SVGs que precisam ser gerados:
    // 1. Status "pending" (primeira geração)
    // 2. Status "failed" (tentativa anterior falhou)
    // 3. forceRegenerate = true (regeneração forçada)
    // 4. lastGeneratedAt is null (nunca gerado)
    // 5. lastGeneratedAt < 24h ago (atualização periódica)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        or(
          eq(svgs.status, "pending"),
          eq(svgs.status, "failed"),
          eq(svgs.forceRegenerate, true),
          isNull(svgs.lastGeneratedAt),
          lte(svgs.lastGeneratedAt, twentyFourHoursAgo)
        )
      )
      .limit(50) // Processar no máximo 50 por execução

    if (svgsToGenerate.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No SVGs to generate",
        processed: 0,
      })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Processar cada SVG
    for (const svg of svgsToGenerate) {
      try {
        console.log(`🔄 [CRON] Starting generation for SVG ${svg.id} (${svg.name})`)

        // Atualizar status para "generating"
        await db
          .update(svgs)
          .set({
            status: "generating",
          })
          .where(eq(svgs.id, svg.id))

        // Converter configuração do Supabase para formato do svg-generator
        const { plugins: pluginsConfig, pluginsOrder: pluginsOrderFromConvert } = await convertSvgToPluginsConfig(svg)

        // Preparar request para o svg-generator HTTP service
        // O svg-generator vai buscar essential configs do Supabase usando userId
        const uiConfig = (svg as any).uiConfig || {}
        const terminalConfigs = getTerminalConfigs(uiConfig)
        const requestConfig = {
          style: svg.style || "default",
          size: svg.size || "half",
          plugins: pluginsConfig,
          pluginsOrder: pluginsOrderFromConvert || svg.pluginsOrder?.split(",") || [],
          customCss: svg.customCss || undefined,
          theme: svg.theme || undefined,
          hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
          hideTerminalHeader: terminalConfigs.hideTerminalHeader,
          hideTerminalCommand: terminalConfigs.hideTerminalCommand,
          customThemeColors: uiConfig.customThemeColors || undefined,
          userId: svg.userId, // Passar userId para svg-generator buscar essential configs
          mock: false, // Sempre usar dados reais
        }

        // Gerar SVG via HTTP service (svg-generator busca essential configs)
        console.log(`📤 [CRON] Calling svg-generator service for SVG ${svg.id}...`)
        const result = await generateSvgViaHttpService(requestConfig)
        console.log(`✅ [CRON] SVG ${svg.id} generated successfully, size: ${result.width}x${result.height}`)
        const svgContent = result.svg

        // Salvar no Supabase Storage
        const { path, url } = await saveSvgToStorage(svg.id, svgContent)

        // Calcular hash dos dados
        const dataHash = generateDataHash(svg)

        // Calcular próxima regeneração (24 horas a partir de agora)
        const nextRegenerationAt = new Date(now)
        nextRegenerationAt.setHours(nextRegenerationAt.getHours() + 24)

        // Atualizar SVG com resultado
        await db
          .update(svgs)
          .set({
            status: "completed",
            storagePath: path,
            storageUrl: url,
            dataHash,
            lastGeneratedAt: now,
            nextRegenerationAt,
            forceRegenerate: false,
            failCount: 0, // Reset fail count on success
            lastError: null, // Clear error on success
          })
          .where(eq(svgs.id, svg.id))

        results.success++
      } catch (error) {
        // Extrair mensagem de erro detalhada
        let errorMessage = "Unknown error"
        let errorCode: string | undefined
        let errorDetails: any = undefined

        if (error instanceof Error) {
          errorMessage = error.message
          errorCode = (error as any).code
          errorDetails = (error as any).details || (error as any).missing
        } else if (typeof error === "string") {
          errorMessage = error
        }

        // Construir mensagem de erro completa
        let fullErrorMessage = errorMessage
        if (errorCode) {
          fullErrorMessage = `[${errorCode}] ${errorMessage}`
        }
        if (errorDetails) {
          fullErrorMessage += ` | Details: ${JSON.stringify(errorDetails)}`
        }

        // Atualizar status para "failed" com detalhes do erro
        const [updatedSvg] = await db.select().from(svgs).where(eq(svgs.id, svg.id)).limit(1)

        await db
          .update(svgs)
          .set({
            status: "failed",
            lastError: fullErrorMessage,
            failCount: (updatedSvg?.failCount || 0) + 1,
          })
          .where(eq(svgs.id, svg.id))

        results.failed++
        results.errors.push(`${svg.id}: ${fullErrorMessage}`)
        console.error(`❌ [CRON] Error generating SVG ${svg.id}:`, {
          error: errorMessage,
          code: errorCode,
          details: errorDetails,
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: svgsToGenerate.length,
      results,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
