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
import { eq, or, lte } from "drizzle-orm"
import { NextResponse } from "next/server"
import { convertSvgToPluginsConfig, generateDataHash, saveSvgToStorage } from "@/lib/svg-generator"
import { generateSvgViaHttpService } from "@/lib/svg-generator-client"

/**
 * GET /api/cron/generate-svgs - Executar cron job
 * 
 * Busca SVGs que precisam ser gerados/atualizados e processa em lote.
 */
export async function GET(request: Request) {
  // Verificar se é uma requisição autorizada (Vercel Cron ou secret)
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    
    // Buscar SVGs que precisam ser gerados:
    // 1. Status "pending" (primeira geração)
    // 2. Status "failed" (tentativa anterior falhou)
    // 3. forceRegenerate = true (regeneração forçada)
    // 4. nextGenerationAt <= now (hora de atualizar)
    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        or(
          eq(svgs.status, "pending"),
          eq(svgs.status, "failed"),
          eq(svgs.forceRegenerate, true),
          lte(svgs.nextGenerationAt, now)
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
        // Atualizar status para "generating"
        await db
          .update(svgs)
          .set({
            status: "generating",
            updatedAt: new Date(),
          })
          .where(eq(svgs.id, svg.id))

        // Converter configuração do Supabase para formato do svg-generator
        const pluginsConfig = convertSvgToPluginsConfig(svg)

        // Preparar request para o svg-generator HTTP service
        // O svg-generator vai buscar essential configs do Supabase usando userId
        const requestConfig = {
          style: svg.style || 'default',
          size: svg.size || 'half',
          plugins: pluginsConfig,
          pluginsOrder: svg.pluginsOrder?.split(',') || [],
          customCss: svg.customCss || undefined,
          theme: svg.theme || undefined,
          hideTerminalEmojis: svg.hideTerminalEmojis || undefined,
          hideTerminalHeader: svg.hideTerminalHeader || undefined,
          customThemeColors: (svg.pluginsConfig as any)?.customThemeColors || undefined,
          userId: svg.userId, // Passar userId para svg-generator buscar essential configs
          mock: false, // Sempre usar dados reais
        }

        // Gerar SVG via HTTP service (svg-generator busca essential configs)
        const result = await generateSvgViaHttpService(requestConfig)
        const svgContent = result.svg

        // Salvar no Supabase Storage
        const { path, url } = await saveSvgToStorage(svg.id, svgContent)

        // Calcular hash dos dados
        const dataHash = generateDataHash(svg)

        // Calcular próxima geração (ex: daqui a 24 horas)
        const nextGenerationAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        // Atualizar SVG com resultado
        await db
          .update(svgs)
          .set({
            status: "completed",
            storagePath: path,
            storageUrl: url,
            dataHash,
            lastGeneratedAt: now,
            nextGenerationAt,
            forceRegenerate: false,
            updatedAt: now,
          })
          .where(eq(svgs.id, svg.id))

        results.success++
      } catch (error) {
        // Atualizar status para "failed"
        await db
          .update(svgs)
          .set({
            status: "failed",
            updatedAt: now,
          })
          .where(eq(svgs.id, svg.id))

        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        results.failed++
        results.errors.push(`${svg.id}: ${errorMessage}`)
        console.error(`Error generating SVG ${svg.id}:`, error)
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

