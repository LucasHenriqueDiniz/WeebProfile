import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { svgs } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { convertSvgToPluginsConfig, generateDataHash, saveSvgToStorage } from "@/lib/svg-generator"
import { generateSvgViaHttpService } from "@/lib/svg-generator-client"
import { getTerminalConfigs } from "@/lib/config/svg-config-helpers"

/**
 * POST /api/svgs/[id]/generate - Gerar SVG
 * 
 * Esta rota gera o SVG usando o core e salva no Supabase Storage.
 * Pode ser chamada manualmente ou por cron job.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Ler body para verificar se é uma geração forçada
    let force = false
    try {
      const body = await request.json().catch(() => ({}))
      force = body.force === true
    } catch {
      // Se não conseguir ler o body, continua com force = false
    }

    // Buscar SVG e perfil
    const [svg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, user.id)))
      .limit(1)

    if (!svg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    // Verificar cooldown (20 minutos) - apenas se não for forçado
    const COOLDOWN_MINUTES = 20
    if (!force && svg.lastGeneratedAt) {
      const lastGenerated = new Date(svg.lastGeneratedAt)
      const now = new Date()
      const minutesSinceLastGeneration = (now.getTime() - lastGenerated.getTime()) / (1000 * 60)
      
      if (minutesSinceLastGeneration < COOLDOWN_MINUTES) {
        const remainingMinutes = Math.ceil(COOLDOWN_MINUTES - minutesSinceLastGeneration)
        return NextResponse.json(
          {
            error: "Cooldown active",
            message: `Você precisa aguardar ${remainingMinutes} minuto(s) antes de gerar novamente. Use "Forçar Geração" para ignorar o cooldown.`,
            remainingMinutes,
            cooldownMinutes: COOLDOWN_MINUTES,
          },
          { status: 429 } // Too Many Requests
        )
      }
    }

    // Atualizar status para "generating"
    await db
      .update(svgs)
      .set({
        status: "generating",
      })
      .where(eq(svgs.id, id))

    try {
      console.log(`🔍 [GENERATE] Starting generation for SVG ${id} (force: ${force})`)
      console.log(`🔍 [GENERATE] SVG data:`, {
        id: svg.id,
        name: svg.name,
        style: svg.style,
        size: svg.size,
        theme: svg.theme,
        pluginsConfig: svg.pluginsConfig,
        pluginsOrder: svg.pluginsOrder,
      })

      // Converter configuração do Supabase para formato do svg-generator
      const { plugins, pluginsOrder } = convertSvgToPluginsConfig(svg)
      
      console.log(`🔍 [GENERATE] Converted plugins:`, JSON.stringify(plugins, null, 2))
      console.log(`🔍 [GENERATE] Plugins order:`, pluginsOrder)

      // Preparar request para o svg-generator HTTP service
      // O svg-generator vai buscar essential configs do Supabase usando userId
      // pluginsOrder já vem convertido com ordem alfabética se null/empty
      const terminalConfigs = getTerminalConfigs(svg.pluginsConfig as Record<string, any>)
      const requestConfig = {
        style: svg.style || 'default',
        size: svg.size || 'half',
        plugins,
        pluginsOrder, // Already converted by convertSvgToPluginsConfig (alphabetical if null/empty)
        customCss: svg.customCss || undefined,
        theme: svg.theme || undefined,
        hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
        hideTerminalHeader: terminalConfigs.hideTerminalHeader,
        hideTerminalCommand: terminalConfigs.hideTerminalCommand,
        customThemeColors: (svg.pluginsConfig as any)?.customThemeColors || undefined,
        userId: user.id, // Passar userId para svg-generator buscar essential configs
        mock: false, // Sempre usar dados reais em produção
      }

      console.log(`🔍 [GENERATE] Request config to svg-generator:`, JSON.stringify(requestConfig, null, 2))

      // Gerar SVG via HTTP service (svg-generator busca essential configs)
      console.log(`🔍 [GENERATE] Calling svg-generator service...`)
      const result = await generateSvgViaHttpService(requestConfig)
      console.log(`🔍 [GENERATE] SVG generated successfully, size: ${result.width}x${result.height}`)
      const svgContent = result.svg

      // Salvar no Supabase Storage
      const { path, url } = await saveSvgToStorage(id, svgContent)

      // Calcular hash dos dados
      const dataHash = generateDataHash(svg)

      // Atualizar SVG com resultado
      // Set next_regeneration_at to 24 hours from now for automatic regeneration
      const nextRegenerationAt = new Date()
      nextRegenerationAt.setHours(nextRegenerationAt.getHours() + 24)

      const [updatedSvg] = await db
        .update(svgs)
        .set({
          status: "completed",
          storagePath: path,
          storageUrl: url,
          dataHash,
          lastGeneratedAt: new Date(),
          nextRegenerationAt,
          forceRegenerate: false,
        })
        .where(eq(svgs.id, id))
        .returning()

      return NextResponse.json({
        success: true,
        svg: updatedSvg,
      })
    } catch (error) {
        // Atualizar status para "failed"
        await db
          .update(svgs)
          .set({
            status: "failed",
          })
          .where(eq(svgs.id, id))

      console.error("Error generating SVG:", error)
      return NextResponse.json(
        {
          error: "Failed to generate SVG",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in generate route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

