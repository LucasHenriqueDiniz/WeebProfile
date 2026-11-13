import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { pruneErrorLog } from "../_shared/error-log"
import { getDb } from "../_shared/db"
import { nightsFrom, retryDelayNights } from "../_shared/regeneration-schedule"
import { saveSvgToR2 } from "../_shared/storage"
import { assertGenerationSucceeded } from "../_shared/svg-generation-validation"
import { svgs } from "../../../lib/db/schema"
import { eq, ne, or, lte, isNull, and, lt, asc } from "drizzle-orm"
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

    // Here because this is the one endpoint that runs every day. Never throws.
    await pruneErrorLog(env, now)

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

    // Due: forced, new, or past its next_regeneration_at. A failed SVG is due only when
    // its backoff has passed (see regeneration-schedule.ts); it used to be due always.
    // Healthy SVGs first, then the most overdue, so a pile of broken cards cannot keep
    // the working ones waiting.
    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        and(
          eq(svgs.isPaused, false),
          ne(svgs.status, "generating"),
          or(
            eq(svgs.forceRegenerate, true),
            eq(svgs.status, "pending"),
            lte(svgs.nextRegenerationAt, now.toISOString()),
            and(
              isNull(svgs.nextRegenerationAt),
              or(isNull(svgs.lastGeneratedAt), lte(svgs.lastGeneratedAt, twentyFourHoursAgo.toISOString()))
            )
          )
        )
      )
      .orderBy(asc(svgs.failCount), asc(svgs.nextRegenerationAt))
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

        await db
          .update(svgs)
          .set({
            status: "completed",
            storagePath: storagePath || null,
            storageUrl: storageUrl || null,
            lastGeneratedAt: now.toISOString(),
            nextRegenerationAt: nightsFrom(now, 1),
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

        // Out of tonight's due set, and later each time it fails again. forceRegenerate
        // is cleared too: it asked for one attempt, and a failed manual regenerate used
        // to leave it on, which made the SVG due in every batch.
        const failCount = (svg.failCount || 0) + 1
        await db
          .update(svgs)
          .set({
            status: "failed",
            lastError: fullErrorMessage,
            failCount,
            nextRegenerationAt: nightsFrom(now, retryDelayNights(failCount)),
            forceRegenerate: false,
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
