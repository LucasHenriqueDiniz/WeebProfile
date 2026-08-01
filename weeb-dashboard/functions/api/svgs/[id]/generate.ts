import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, notFound, serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { saveSvgToR2 } from "../../_shared/storage"
import { assertGenerationSucceeded } from "../../_shared/svg-generation-validation"
import { svgs } from "../../../../lib/db/schema"
import { eq, and } from "drizzle-orm"
import { generateSvgViaService, convertSvgToPluginsConfig, getTerminalConfigs } from "../../_shared/svg-generation"

/**
 * POST /api/svgs/[id]/generate - Trigger SVG generation
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    let force = false
    try {
      const body = (await request.clone().json()) as any
      force = body.force === true
    } catch {
      // ignore â€” force remains false
    }

    const [svg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!svg) return notFound("SVG")

    // Reset SVGs stuck in "generating" for more than 30 minutes
    let currentSvg: typeof svg = svg
    if (svg.status === "generating" && svg.updatedAt) {
      const minutesSinceUpdate = (Date.now() - new Date(svg.updatedAt).getTime()) / (1000 * 60)
      const STUCK_TIMEOUT_MINUTES = 30
      if (minutesSinceUpdate > STUCK_TIMEOUT_MINUTES) {
        const [updatedSvg] = await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Generation interrupted (stuck in generating for ${Math.ceil(minutesSinceUpdate)} minutes)`,
          })
          .where(eq(svgs.id, id))
          .returning()
        if (updatedSvg) currentSvg = updatedSvg
      }
    }

    // Cooldown check (20 minutes), unless forced
    const COOLDOWN_MINUTES = 20
    if (!force && currentSvg.lastGeneratedAt) {
      const minutesSinceLastGeneration = (Date.now() - new Date(currentSvg.lastGeneratedAt).getTime()) / (1000 * 60)
      if (minutesSinceLastGeneration < COOLDOWN_MINUTES) {
        const remainingMinutes = Math.ceil(COOLDOWN_MINUTES - minutesSinceLastGeneration)
        return Response.json(
          {
            error: "Cooldown active",
            message: `Please wait ${remainingMinutes} minute(s) before generating again. Use "Force Generate" to skip the cooldown.`,
            remainingMinutes,
            cooldownMinutes: COOLDOWN_MINUTES,
          },
          { status: 429 }
        )
      }
    }

    await db.update(svgs).set({ status: "generating", forceRegenerate: force }).where(eq(svgs.id, id))

    try {
      const { plugins, pluginsOrder } = convertSvgToPluginsConfig(currentSvg as any)

      const uiConfig =
        (typeof (currentSvg as any).uiConfig === "string"
          ? JSON.parse((currentSvg as any).uiConfig)
          : (currentSvg as any).uiConfig) || {}
      const terminalConfigs = getTerminalConfigs(uiConfig)

      const requestConfig = {
        style: currentSvg.style || "default",
        size: currentSvg.size || "half",
        plugins,
        pluginsOrder,
        customCss: currentSvg.customCss || undefined,
        theme: currentSvg.theme || undefined,
        hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
        hideTerminalHeader: terminalConfigs.hideTerminalHeader,
        hideTerminalCommand: terminalConfigs.hideTerminalCommand,
        fontFamily: terminalConfigs.fontFamily,
        terminalHeaderText: terminalConfigs.terminalHeaderText || undefined,
        customThemeColors: uiConfig.customThemeColors || undefined,
        userId,
        mock: false,
      }

      const result = (await generateSvgViaService(requestConfig, env)) as any
      const svgContent = result.svg

      // Same gate the cron uses -- a manual click must not publish a degraded SVG
      // (one with a <PluginError> section) over a previously-valid stored version.
      assertGenerationSucceeded(result)

      // Save to R2
      const { path: storagePath, url: storageUrl } = await saveSvgToR2(env, id, svgContent)

      const nextRegenerationAt = new Date()
      nextRegenerationAt.setHours(nextRegenerationAt.getHours() + 24)

      const [updatedSvg] = await db
        .update(svgs)
        .set({
          status: "completed",
          storagePath: storagePath || null,
          storageUrl: storageUrl || null,
          lastGeneratedAt: new Date().toISOString(),
          nextRegenerationAt: nextRegenerationAt.toISOString(),
          forceRegenerate: false,
        })
        .where(eq(svgs.id, id))
        .returning()

      return Response.json({ success: true, svg: updatedSvg })
    } catch (error: any) {
      await db
        .update(svgs)
        .set({ status: "failed", lastError: error?.message || "Unknown error" })
        .where(eq(svgs.id, id))

      const errorMessage = error instanceof Error ? error.message : String(error)
      const isTimeout =
        errorMessage.includes("Vercel Runtime Timeout") ||
        errorMessage.includes("Task timed out after") ||
        errorMessage.includes("Function execution exceeded") ||
        (error?.code === "ETIMEDOUT" && errorMessage.includes("timeout"))

      if (isTimeout) {
        return Response.json(
          {
            error: "Service starting up",
            code: "TIMEOUT",
            message: "The generation service is waking up. Please wait a few seconds and try again.",
            retryable: true,
          },
          { status: 503 }
        )
      }

      if (error?.code === "MISSING_REQUIRED_SECRETS" || error?.error === "MISSING_REQUIRED_CONFIG") {
        return Response.json(
          {
            error: "MISSING_REQUIRED_CONFIG",
            code: "MISSING_REQUIRED_SECRETS",
            message: error.message || "Missing required secrets or fields for enabled plugins",
            missing: error.missing || [],
          },
          { status: 400 }
        )
      }

      if (error?.code === "DATABASE_UNREACHABLE" || error?.code === "D1_API_UNREACHABLE") {
        return Response.json(
          {
            error: "Database unreachable",
            code: error.code,
            message: error.message || "Generator could not reach the database.",
            details: error.details,
          },
          { status: 503 }
        )
      }

      return Response.json({ error: "Failed to generate SVG", message: errorMessage }, { status: 500 })
    }
  } catch (e) {
    return serverError(e)
  }
}
