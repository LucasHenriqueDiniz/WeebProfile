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
import { eq, or, lte, isNull, and, sql, lt } from "drizzle-orm"
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

    // PRIMEIRO: Limpar SVGs presos em "generating" há mais de 30 minutos
    const STUCK_TIMEOUT_MINUTES = 30
    const stuckTimeout = new Date(now.getTime() - STUCK_TIMEOUT_MINUTES * 60 * 1000)
    
    const stuckSvgs = await db
      .select({ id: svgs.id, updatedAt: svgs.updatedAt })
      .from(svgs)
      .where(
        and(
          eq(svgs.status, "generating"),
          lt(svgs.updatedAt, stuckTimeout)
        )
      )
    
    if (stuckSvgs.length > 0) {
      console.log(`⚠️  [CRON] Encontrados ${stuckSvgs.length} SVG(s) presos em "generating". Resetando...`)
      
      for (const stuckSvg of stuckSvgs) {
        const minutesStuck = stuckSvg.updatedAt
          ? Math.ceil((now.getTime() - new Date(stuckSvg.updatedAt).getTime()) / (1000 * 60))
          : 0
        
        await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Geração interrompida (preso em generating há ${minutesStuck} minutos)`,
          })
          .where(eq(svgs.id, stuckSvg.id))
        
        console.log(`   ✅ SVG ${stuckSvg.id} resetado (preso há ${minutesStuck} minutos)`)
      }
    }

    // Buscar SVGs que precisam ser gerados:
    // 1. Status "pending" (primeira geração) - não pausados
    // 2. Status "failed" (tentativa anterior falhou) - não pausados
    // 3. forceRegenerate = true (regeneração forçada) - não pausados
    // 4. next_regeneration_at <= now() (regeneração agendada) - status completed/error/pending, não pausados
    // 5. Legacy: next_regeneration_at IS NULL AND (lastGeneratedAt IS NULL OR lastGeneratedAt < 24h ago) - não pausados
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        and(
          eq(svgs.isPaused, false), // Não processar SVGs pausados
          or(
            // Casos prioritários (não dependem de next_regeneration_at)
            eq(svgs.status, "pending"),
            eq(svgs.status, "failed"),
            eq(svgs.forceRegenerate, true),
            // Regeneração agendada (alinhado com debug endpoint)
            // Nota: debug endpoint usa 'error', mas o dashboard usa 'failed' - incluímos ambos para compatibilidade
            and(
              or(
                eq(svgs.status, "completed"),
                eq(svgs.status, "failed"), // Status usado pelo dashboard
                eq(svgs.status, "error"), // Status usado pelo debug endpoint (compatibilidade)
                eq(svgs.status, "pending")
              ),
              sql`${svgs.nextRegenerationAt} IS NOT NULL`, // next_regeneration_at IS NOT NULL
              lte(svgs.nextRegenerationAt, now) // next_regeneration_at <= now()
            ),
            // Legacy: SVGs antigos sem next_regeneration_at
            and(
              isNull(svgs.nextRegenerationAt),
              or(isNull(svgs.lastGeneratedAt), lte(svgs.lastGeneratedAt, twentyFourHoursAgo))
            )
          )
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
