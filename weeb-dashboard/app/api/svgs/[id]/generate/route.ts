import { auth } from "@clerk/nextjs/server"
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
    const { userId } = await auth()
    if (!userId) {
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
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!svg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    // Verificar se o SVG está preso em "generating" há muito tempo (> 30 minutos)
    // Isso pode acontecer se o servidor foi desligado durante a geração
    let currentSvg = svg
    if (svg.status === "generating" && svg.updatedAt) {
      const updatedAt = new Date(svg.updatedAt)
      const now = new Date()
      const minutesSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60)
      const STUCK_TIMEOUT_MINUTES = 30
      
      if (minutesSinceUpdate > STUCK_TIMEOUT_MINUTES) {
        console.warn(`⚠️  SVG ${id} está preso em "generating" há ${Math.ceil(minutesSinceUpdate)} minutos. Resetando para "pending".`)
        // Resetar para "pending" para permitir nova tentativa
        const [updatedSvg] = await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Geração interrompida (preso em generating há ${Math.ceil(minutesSinceUpdate)} minutos)`,
          })
          .where(eq(svgs.id, id))
          .returning()
        
        if (updatedSvg) {
          currentSvg = updatedSvg
        }
      }
    }

    // Verificar cooldown (20 minutos) - apenas se não for forçado
    const COOLDOWN_MINUTES = 20
    if (!force && currentSvg.lastGeneratedAt) {
      const lastGenerated = new Date(currentSvg.lastGeneratedAt)
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

    // Atualizar status para "generating" e definir force_regenerate se necessário
    await db
      .update(svgs)
      .set({
        status: "generating",
        forceRegenerate: force, // Set force_regenerate if force=true
      })
      .where(eq(svgs.id, id))

    try {
      console.log(`🔍 [GENERATE] Starting generation for SVG ${id} (force: ${force})`)
      console.log(`🔍 [GENERATE] SVG data:`, {
        id: currentSvg.id,
        name: currentSvg.name,
        style: currentSvg.style,
        size: currentSvg.size,
        theme: currentSvg.theme,
        pluginsConfig: currentSvg.pluginsConfig,
        pluginsOrder: currentSvg.pluginsOrder,
      })

      // Converter configuração do Supabase para formato do svg-generator
      const { plugins, pluginsOrder } = await convertSvgToPluginsConfig(currentSvg)
      
      console.log(`🔍 [GENERATE] Converted plugins:`, JSON.stringify(plugins, null, 2))
      console.log(`🔍 [GENERATE] Plugins order:`, pluginsOrder)

      // Preparar request para o svg-generator HTTP service
      // O svg-generator vai buscar apenas essential configs (secrets) do Supabase usando userId
      // pluginsOrder já vem convertido com ordem alfabética se null/empty
      const uiConfig = (currentSvg as any).uiConfig || {}
      const terminalConfigs = getTerminalConfigs(uiConfig)
      const requestConfig = {
        style: currentSvg.style || 'default',
        size: currentSvg.size || 'half',
        plugins,
        pluginsOrder, // Already converted by convertSvgToPluginsConfig (alphabetical if null/empty)
        customCss: currentSvg.customCss || undefined,
        theme: currentSvg.theme || undefined,
        hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
        hideTerminalHeader: terminalConfigs.hideTerminalHeader,
        hideTerminalCommand: terminalConfigs.hideTerminalCommand,
        customThemeColors: uiConfig.customThemeColors || undefined,
        userId: userId, // Passar userId para svg-generator buscar apenas secrets (essential configs)
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
      const dataHash = generateDataHash(currentSvg)

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
    } catch (error: any) {
      // Atualizar status para "failed"
      await db
        .update(svgs)
        .set({
          status: "failed",
          lastError: error?.message || "Unknown error",
        })
        .where(eq(svgs.id, id))

      console.error("Error generating SVG:", error)
      
      // Check if it's a Vercel timeout error (cold start do Railway)
      const errorMessage = error instanceof Error ? error.message : String(error)
      const isVercelTimeout = 
        errorMessage.includes("Vercel Runtime Timeout") ||
        errorMessage.includes("Task timed out after") ||
        errorMessage.includes("Function execution exceeded") ||
        (error?.code === "ETIMEDOUT" && errorMessage.includes("timeout"))
      
      if (isVercelTimeout) {
        return NextResponse.json(
          {
            error: "Service starting up",
            code: "VERCEL_TIMEOUT",
            message: "O serviço de geração está acordando. Por favor, aguarde alguns segundos e tente novamente.",
            retryable: true,
          },
          { status: 503 }
        )
      }
      
      // Check if it's a structured error from svg-generator
      if (error?.code === "MISSING_REQUIRED_SECRETS" || error?.error === "MISSING_REQUIRED_CONFIG") {
        return NextResponse.json(
          {
            error: "MISSING_REQUIRED_CONFIG",
            code: "MISSING_REQUIRED_SECRETS",
            message: error.message || "Missing required secrets or fields for enabled plugins",
            missing: error.missing || [],
          },
          { status: 400 }
        )
      }
      
      // DB unreachable error - not a user error, it's a system/infrastructure issue
      if (error?.code === "DATABASE_UNREACHABLE" || error?.code === "SUPABASE_DB_DNS_FAILED") {
        return NextResponse.json(
          {
            error: "Database unreachable",
            code: error.code,
            message: error.message || "Generator não conseguiu acessar o banco de dados. Verifique DATABASE_URL e conectividade.",
            details: error.details,
          },
          { status: 503 }
        )
      }
      
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

