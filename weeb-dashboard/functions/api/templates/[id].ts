import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, unauthorized, notFound, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { parseBody, templateUpdateSchema } from "../_shared/validation"
import { templates, svgs } from "../../../lib/db/schema"
import { eq, and } from "drizzle-orm"

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
 * GET /api/templates/[id] - Get a specific template
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)

    const id = params.id as string
    const db = getDb(env)

    const [template] = await db.select().from(templates).where(eq(templates.id, id)).limit(1)

    if (!template) return notFound("Template")
    if (!template.isPublic && template.userId !== userId) {
      return userId ? notFound("Template") : unauthorized()
    }

    let previewUrl: string | null = null
    if (template.svgId) {
      const [svgRow] = await db
        .select({ storageUrl: svgs.storageUrl })
        .from(svgs)
        .where(eq(svgs.id, template.svgId))
        .limit(1)
      previewUrl = svgRow?.storageUrl || null
    }

    return Response.json({ template: { ...template, previewUrl } })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * PUT /api/templates/[id] - Update a template
 */
export const onRequestPut: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, id), eq(templates.userId, userId)))
      .limit(1)

    if (!existingTemplate) return notFound("Template")

    const parsed = await parseBody(request, templateUpdateSchema)
    if (!parsed.ok) return parsed.response
    const {
      name,
      description,
      style,
      size,
      theme,
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
      fontFamily,
      terminalHeaderText,
      customCss,
      pluginsOrder,
      pluginsConfig,
      uiConfig,
      isPublic,
    } = parsed.data

    const existingUiConfig =
      (typeof (existingTemplate as any).uiConfig === "string"
        ? JSON.parse((existingTemplate as any).uiConfig)
        : (existingTemplate as any).uiConfig) || {}
    let finalUiConfig = uiConfig !== undefined ? uiConfig : existingUiConfig
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

    const [updatedTemplate] = await db
      .update(templates)
      .set({
        name: name !== undefined ? name : existingTemplate.name,
        description: description !== undefined ? description : existingTemplate.description,
        style: style !== undefined ? style : existingTemplate.style,
        size: size !== undefined ? size : existingTemplate.size,
        theme: theme !== undefined ? theme : existingTemplate.theme,
        customCss: customCss !== undefined ? customCss : existingTemplate.customCss,
        pluginsOrder: pluginsOrder !== undefined ? pluginsOrder : existingTemplate.pluginsOrder,
        pluginsConfig: pluginsConfig !== undefined ? pluginsConfig : existingTemplate.pluginsConfig,
        uiConfig: finalUiConfig,
        isPublic: isPublic !== undefined ? isPublic : existingTemplate.isPublic,
      })
      .where(eq(templates.id, id))
      .returning()

    return Response.json({ template: updatedTemplate })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * DELETE /api/templates/[id] - Delete a template
 */
export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, id), eq(templates.userId, userId)))
      .limit(1)

    if (!existingTemplate) return notFound("Template")

    await db.delete(templates).where(eq(templates.id, id))

    return Response.json({ success: true })
  } catch (e) {
    return serverError(e)
  }
}
