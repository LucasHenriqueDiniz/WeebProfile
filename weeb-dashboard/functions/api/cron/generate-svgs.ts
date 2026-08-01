import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { saveSvgToR2 } from "../_shared/storage"
import { assertGenerationSucceeded } from "../_shared/svg-generation-validation"
import { svgs } from "../../../lib/db/schema"
import { eq, or, lte, isNull, and, sql, lt } from "drizzle-orm"
import { generateSvgViaService, convertSvgToPluginsConfig, getTerminalConfigs } from "../_shared/svg-generation"

/**
 * POST /api/cron/generate-svgs - Cron job to regenerate SVGs
 *
 * Authenticated via Bearer token in Authorization header (CRON_SECRET env var).
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  // Auth: verify cron secret. Fail closed -- a missing CRON_SECRET must reject
  // every call, not leave mass regeneration open to anyone.
  const authHeader = request.headers.get("authorization")
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const db = getDb(env)

    // Reset SVGs stuck in "generating" for more than 30 minutes
    const STUCK_TIMEOUT_MINUTES = 30
    const stuckTimeout = new Date(now.getTime() - STUCK_TIMEOUT_MINUTES * 60 * 1000)

    const stuckSvgs = await db
      .select({ id: svgs.id, updatedAt: svgs.updatedAt })
      .from(svgs)
      .where(and(eq(svgs.status, "generating"), lt(svgs.updatedAt, stuckTimeout.toISOString())))

    if (stuckSvgs.length > 0) {
      console.log(`[CRON] Found ${stuckSvgs.length} SVG(s) stuck in "generating". Resetting...`)
      for (const stuckSvg of stuckSvgs) {
        const minutesStuck = stuckSvg.updatedAt
          ? Math.ceil((now.getTime() - new Date(stuckSvg.updatedAt).getTime()) / (1000 * 60))
          : 0
        await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Generation interrupted (stuck in generating for ${minutesStuck} minutes)`,
          })
          .where(eq(svgs.id, stuckSvg.id))
      }
    }

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        and(
          eq(svgs.isPaused, false),
          or(
            eq(svgs.status, "pending"),
            eq(svgs.status, "failed"),
            eq(svgs.forceRegenerate, true),
            and(
              or(
                eq(svgs.status, "completed"),
                eq(svgs.status, "failed"),
                eq(svgs.status, "error"),
                eq(svgs.status, "pending")
              ),
              sql`${svgs.nextRegenerationAt} IS NOT NULL`,
              lte(svgs.nextRegenerationAt, now.toISOString())
            ),
            and(
              isNull(svgs.nextRegenerationAt),
              or(isNull(svgs.lastGeneratedAt), lte(svgs.lastGeneratedAt, twentyFourHoursAgo.toISOString()))
            )
          )
        )
      )
      .limit(50)

    if (svgsToGenerate.length === 0) {
      return Response.json({ success: true, message: "No SVGs to generate", processed: 0 })
    }

    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const svg of svgsToGenerate) {
      try {
        console.log(`[CRON] Starting generation for SVG ${svg.id} (${svg.name})`)

        await db.update(svgs).set({ status: "generating" }).where(eq(svgs.id, svg.id))

        const { plugins: pluginsConfig, pluginsOrder } = convertSvgToPluginsConfig(svg as any)

        const uiConfig =
          (typeof (svg as any).uiConfig === "string" ? JSON.parse((svg as any).uiConfig) : (svg as any).uiConfig) || {}
        const terminalConfigs = getTerminalConfigs(uiConfig)

        const requestConfig = {
          style: svg.style || "default",
          size: svg.size || "half",
          plugins: pluginsConfig,
          pluginsOrder,
          customCss: svg.customCss || undefined,
          theme: svg.theme || undefined,
          hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
          hideTerminalHeader: terminalConfigs.hideTerminalHeader,
          hideTerminalCommand: terminalConfigs.hideTerminalCommand,
          fontFamily: terminalConfigs.fontFamily,
          terminalHeaderText: terminalConfigs.terminalHeaderText || undefined,
          customThemeColors: uiConfig.customThemeColors || undefined,
          userId: svg.userId,
          mock: false,
        }

        const result = (await generateSvgViaService(requestConfig, env)) as any
        const svgContent = result.svg

        // Same gate the manual regenerate endpoint uses -- neither trigger may publish a
        // degraded SVG over a previously-valid one. pluginErrors/hasErrors are always present
        // on the generator's response now, not gated behind a `debug` request flag.
        assertGenerationSucceeded(result)

        const { path: storagePath, url: storageUrl } = await saveSvgToR2(env, svg.id, svgContent)

        const nextRegenerationAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        await db
          .update(svgs)
          .set({
            status: "completed",
            storagePath: storagePath || null,
            storageUrl: storageUrl || null,
            lastGeneratedAt: now.toISOString(),
            nextRegenerationAt: nextRegenerationAt.toISOString(),
            forceRegenerate: false,
            failCount: 0,
            lastError: null,
          })
          .where(eq(svgs.id, svg.id))

        results.success++
      } catch (error) {
        let errorMessage = "Unknown error"
        let errorCode: string | undefined
        let errorDetails: any

        if (error instanceof Error) {
          errorMessage = error.message
          errorCode = (error as any).code
          errorDetails = (error as any).details || (error as any).missing
        } else if (typeof error === "string") {
          errorMessage = error
        }

        let fullErrorMessage = errorMessage
        if (errorCode) fullErrorMessage = `[${errorCode}] ${errorMessage}`
        if (errorDetails) fullErrorMessage += ` | Details: ${JSON.stringify(errorDetails)}`

        const [currentSvg] = await db.select().from(svgs).where(eq(svgs.id, svg.id)).limit(1)

        await db
          .update(svgs)
          .set({
            status: "failed",
            lastError: fullErrorMessage,
            failCount: (currentSvg?.failCount || 0) + 1,
          })
          .where(eq(svgs.id, svg.id))

        results.failed++
        results.errors.push(`${svg.id}: ${fullErrorMessage}`)
        console.error(`[CRON] Error generating SVG ${svg.id}:`, errorMessage)
      }
    }

    return Response.json({ success: true, processed: svgsToGenerate.length, results })
  } catch (e) {
    return serverError(e)
  }
}
