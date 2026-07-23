import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, badRequest, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { svgs } from "../../../lib/db/schema"
import { eq, count } from "drizzle-orm"
import { assertPluginsMatchEntityType } from "../_shared/artifact-types"

const MAX_SVGS_FREE_TIER = 3

function setTerminalConfigs(
  uiConfig: Record<string, any>,
  configs: {
    hideTerminalEmojis?: boolean
    hideTerminalHeader?: boolean
    hideTerminalCommand?: boolean
  }
): Record<string, any> {
  return {
    ...uiConfig,
    ...(configs.hideTerminalEmojis !== undefined && { hideTerminalEmojis: configs.hideTerminalEmojis }),
    ...(configs.hideTerminalHeader !== undefined && { hideTerminalHeader: configs.hideTerminalHeader }),
    ...(configs.hideTerminalCommand !== undefined && { hideTerminalCommand: configs.hideTerminalCommand }),
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

    const body = (await request.json()) as Record<string, any>
    const {
      name,
      entityType = "profile",
      artifactType = "profile_card",
      variant = "default",
      pluginsConfig = {},
      uiConfig = {},
      style = "default",
      size = "half",
      theme = "default",
      customCss,
      pluginsOrder,
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
    } = body

    if (!name) return badRequest("Name is required")

    const entityTypeError = assertPluginsMatchEntityType(entityType, pluginsConfig)
    if (entityTypeError) return badRequest(entityTypeError)

    const db = getDb(env)

    const [svgCount] = await db.select({ count: count() }).from(svgs).where(eq(svgs.userId, userId))

    if (svgCount.count >= MAX_SVGS_FREE_TIER) {
      return Response.json(
        { error: `Maximum of ${MAX_SVGS_FREE_TIER} SVGs per user (free tier limit)` },
        { status: 403 }
      )
    }

    const slugBase = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const slug = `${slugBase}-${Date.now().toString(36)}`

    let finalUiConfig = { ...uiConfig }
    if (hideTerminalEmojis !== undefined || hideTerminalHeader !== undefined || hideTerminalCommand !== undefined) {
      finalUiConfig = setTerminalConfigs(finalUiConfig, {
        hideTerminalEmojis,
        hideTerminalHeader,
        hideTerminalCommand,
      })
    }

    const [newSvg] = await db
      .insert(svgs)
      .values({
        userId,
        slug,
        name,
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
