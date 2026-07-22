import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, badRequest, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { templates, templateLikes, svgs } from "../../../lib/db/schema"
import { eq, and, inArray, ne } from "drizzle-orm"

async function withPreviewUrls<T extends { svgId: string | null }>(
  db: ReturnType<typeof getDb>,
  rows: T[]
): Promise<(T & { previewUrl: string | null })[]> {
  const svgIds = rows.map((r) => r.svgId).filter((id): id is string => Boolean(id))
  if (svgIds.length === 0) return rows.map((r) => ({ ...r, previewUrl: null }))

  const svgRows = await db
    .select({ id: svgs.id, storageUrl: svgs.storageUrl })
    .from(svgs)
    .where(inArray(svgs.id, svgIds))
  const urlById = new Map(svgRows.map((s) => [s.id, s.storageUrl]))

  return rows.map((r) => ({ ...r, previewUrl: (r.svgId && urlById.get(r.svgId)) || null }))
}

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
 * GET /api/templates - List templates (user's own + public)
 * Supports ?public=true for unauthenticated public listing
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const { searchParams } = new URL(request.url)
    const publicOnly = searchParams.get("public") === "true"
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? parseInt(limitParam) : undefined

    const userId = await getAuthUserId(request, env)
    const db = getDb(env)

    if (publicOnly) {
      const publicTemplates = await (limit && limit > 0
        ? db.select().from(templates).where(eq(templates.isPublic, true)).limit(limit)
        : db.select().from(templates).where(eq(templates.isPublic, true)))

      const publicTemplateIds = publicTemplates.map((t) => t.id)
      let likesData: Record<string, { count: number; userLiked: boolean }> = {}

      if (publicTemplateIds.length > 0) {
        try {
          const likes = await db
            .select({ templateId: templateLikes.templateId, userId: templateLikes.userId })
            .from(templateLikes)
            .where(inArray(templateLikes.templateId, publicTemplateIds))

          publicTemplateIds.forEach((templateId) => {
            const tl = likes.filter((l) => l.templateId === templateId)
            likesData[templateId] = {
              count: tl.length,
              userLiked: userId ? tl.some((l) => l.userId === userId) : false,
            }
          })
        } catch {
          publicTemplateIds.forEach((templateId) => {
            likesData[templateId] = { count: 0, userLiked: false }
          })
        }
      }

      const publicTemplatesWithPreviews = await withPreviewUrls(db, publicTemplates)

      return Response.json({
        templates: publicTemplatesWithPreviews.map((t) => ({
          ...t,
          likesCount: likesData[t.id]?.count || 0,
          userLiked: likesData[t.id]?.userLiked || false,
        })),
      })
    }

    if (!userId) return unauthorized()

    const userTemplates = await db.select().from(templates).where(eq(templates.userId, userId))
    const publicTemplates = await db
      .select()
      .from(templates)
      .where(and(eq(templates.isPublic, true), ne(templates.userId, userId)))

    const allTemplateIds = [...userTemplates, ...publicTemplates].map((t) => t.id)
    let likesData: Record<string, { count: number; userLiked: boolean }> = {}

    if (allTemplateIds.length > 0) {
      try {
        const likes = await db
          .select({ templateId: templateLikes.templateId, userId: templateLikes.userId })
          .from(templateLikes)
          .where(inArray(templateLikes.templateId, allTemplateIds))

        allTemplateIds.forEach((templateId) => {
          const tl = likes.filter((l) => l.templateId === templateId)
          likesData[templateId] = {
            count: tl.length,
            userLiked: tl.some((l) => l.userId === userId),
          }
        })
      } catch {
        allTemplateIds.forEach((templateId) => {
          likesData[templateId] = { count: 0, userLiked: false }
        })
      }
    }

    const combinedWithPreviews = await withPreviewUrls(db, [...userTemplates, ...publicTemplates])

    return Response.json({
      templates: combinedWithPreviews.map((t) => ({
        ...t,
        likesCount: likesData[t.id]?.count || 0,
        userLiked: likesData[t.id]?.userLiked || false,
      })),
    })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * POST /api/templates - Create a new template
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const body = (await request.json()) as Record<string, any>
    const {
      name,
      description,
      svgId,
      style,
      size,
      theme,
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
      customCss,
      pluginsOrder,
      pluginsConfig,
      uiConfig,
      isPublic = false,
    } = body

    if (!name) return badRequest("Name is required")

    let finalUiConfig = { ...(uiConfig || {}) }
    if (hideTerminalEmojis !== undefined || hideTerminalHeader !== undefined || hideTerminalCommand !== undefined) {
      finalUiConfig = setTerminalConfigs(finalUiConfig, {
        hideTerminalEmojis,
        hideTerminalHeader,
        hideTerminalCommand,
      })
    }

    const db = getDb(env)
    const [newTemplate] = await db
      .insert(templates)
      .values({
        userId,
        name,
        description: description || null,
        svgId: svgId || null,
        style: style || "default",
        size: size || "half",
        theme: theme || "default",
        customCss: customCss || null,
        pluginsOrder: pluginsOrder || null,
        pluginsConfig: pluginsConfig || {},
        uiConfig: finalUiConfig,
        isPublic: isPublic || false,
      })
      .returning()

    return Response.json({ template: newTemplate }, { status: 201 })
  } catch (e) {
    return serverError(e)
  }
}
