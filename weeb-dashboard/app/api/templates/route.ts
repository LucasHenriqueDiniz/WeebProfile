import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { templates, templateLikes } from "@/lib/db/schema"
import { eq, and, inArray, ne } from "drizzle-orm"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

/**
 * GET /api/templates
 * List all templates (user's own + public templates)
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's templates + public templates
    const userTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.userId, user.id))

    const publicTemplates = await db
      .select()
      .from(templates)
      .where(and(eq(templates.isPublic, true), ne(templates.userId, user.id)))

    // Get like counts and user liked status separately
    const allTemplateIds = [...userTemplates, ...publicTemplates].map((t) => t.id)
    
    let likesData: Record<string, { count: number; userLiked: boolean }> = {}
    
    if (allTemplateIds.length > 0) {
      try {
        const likes = await db
          .select({
            templateId: templateLikes.templateId,
            userId: templateLikes.userId,
          })
          .from(templateLikes)
          .where(inArray(templateLikes.templateId, allTemplateIds))
        
        // Count likes per template
        allTemplateIds.forEach((templateId) => {
          const templateLikesList = likes.filter((l) => l.templateId === templateId)
          likesData[templateId] = {
            count: templateLikesList.length,
            userLiked: templateLikesList.some((l) => l.userId === user.id),
          }
        })
      } catch (error) {
        // If template_likes table doesn't exist yet, just use empty data
        console.warn("Error fetching likes (table may not exist yet):", error)
        allTemplateIds.forEach((templateId) => {
          likesData[templateId] = { count: 0, userLiked: false }
        })
      }
    }

    // Combine templates with like data
    const templatesWithLikes = [...userTemplates, ...publicTemplates].map((template) => ({
      ...template,
      likesCount: likesData[template.id]?.count || 0,
      userLiked: likesData[template.id]?.userLiked || false,
    }))

    return NextResponse.json({
      templates: templatesWithLikes,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/templates
 * Create a new template from an existing SVG
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
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
      isPublic = false,
    } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Merge terminal configs into pluginsConfig
    const finalPluginsConfig = setTerminalConfigs(pluginsConfig || {}, {
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
    })

    const [newTemplate] = await db
      .insert(templates)
      .values({
        userId: user.id,
        name,
        description: description || null,
        svgId: svgId || null,
        style: style || "default",
        size: size || "half",
        theme: theme || "default",
        customCss: customCss || null,
        pluginsOrder: pluginsOrder || null, // null means use alphabetical order
        pluginsConfig: finalPluginsConfig,
        isPublic: isPublic || false,
      })
      .returning()

    return NextResponse.json({ template: newTemplate }, { status: 201 })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

