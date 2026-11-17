import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, badRequest, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { svgs } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { assertPluginsMatchEntityType } from "../_shared/artifact-types"
import { parseBody, svgCreateSchema } from "../_shared/validation"
import { uniqueSvgName } from "../_shared/svg-name"
import { MAX_SVGS_FREE_TIER } from "../../../lib/config/plan"

function setTerminalConfigs(
  uiConfig: Record<string, any>,
  configs: {
    hideTerminalEmojis?: boolean
    hideTerminalHeader?: boolean
    hideTerminalCommand?: boolean
    fontFamily?: string
    terminalHeaderText?: string
  }
): Record<string, any> {
  return {
    ...uiConfig,
    ...(configs.hideTerminalEmojis !== undefined && { hideTerminalEmojis: configs.hideTerminalEmojis }),
    ...(configs.hideTerminalHeader !== undefined && { hideTerminalHeader: configs.hideTerminalHeader }),
    ...(configs.hideTerminalCommand !== undefined && { hideTerminalCommand: configs.hideTerminalCommand }),
    ...(configs.fontFamily !== undefined && { fontFamily: configs.fontFamily }),
    ...(configs.terminalHeaderText !== undefined && { terminalHeaderText: configs.terminalHeaderText }),
  }
}

/**
 * GET /api/svgs - List user SVGs
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const db = getDb(env)
    const userSvgs = await db.select().from(svgs).where(eq(svgs.userId, userId))

    return Response.json({ svgs: userSvgs })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * POST /api/svgs - Create new SVG
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const parsed = await parseBody(request, svgCreateSchema)
    if (!parsed.ok) return parsed.response
    const {
      name,
      entityType,
      artifactType,
      variant,
      pluginsConfig,
      uiConfig,
      style,
      size,
      theme,
      customCss,
      pluginsOrder,
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
      fontFamily,
      terminalHeaderText,
    } = parsed.data

    const entityTypeError = assertPluginsMatchEntityType(entityType, pluginsConfig)
    if (entityTypeError) return badRequest(entityTypeError)

    const db = getDb(env)

    const existing = await db.select({ name: svgs.name }).from(svgs).where(eq(svgs.userId, userId))

    if (existing.length >= MAX_SVGS_FREE_TIER) {
      return Response.json(
        { error: `Maximum of ${MAX_SVGS_FREE_TIER} SVGs per user (free tier limit)` },
        { status: 403 }
      )
    }

    const finalName = uniqueSvgName(
      name,
      existing.map((svg) => svg.name)
    )
    const slugBase = finalName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const slug = `${slugBase}-${Date.now().toString(36)}`

    let finalUiConfig = { ...uiConfig }
    if (
      hideTerminalEmojis !== undefined ||
      hideTerminalHeader !== undefined ||
      hideTerminalCommand !== undefined ||
      fontFamily !== undefined ||
      terminalHeaderText !== undefined
    ) {
      finalUiConfig = setTerminalConfigs(finalUiConfig, {
        hideTerminalEmojis,
        hideTerminalHeader,
        hideTerminalCommand,
        fontFamily,
        terminalHeaderText,
      })
    }

    const [newSvg] = await db
      .insert(svgs)
      .values({
        userId,
        slug,
        name: finalName,
        entityType,
        artifactType,
        variant,
        pluginsConfig,
        uiConfig: finalUiConfig,
        style,
        size,
        theme,
        customCss: customCss || null,
        pluginsOrder: pluginsOrder || null,
        status: "pending",
        forceRegenerate: true,
      })
      .returning()

    return Response.json({ svg: newSvg, created: true }, { status: 201 })
  } catch (e) {
    return serverError(e)
  }
}
