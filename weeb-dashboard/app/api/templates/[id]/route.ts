import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { templates } from "@/lib/db/schema"
import { eq, and, or } from "drizzle-orm"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

/**
 * GET /api/templates/[id]
 * Get a specific template
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const [template] = await db
      .select()
      .from(templates)
      .where(
        and(
          eq(templates.id, id),
          // User can only access their own templates or public templates
          or(eq(templates.userId, user.id), eq(templates.isPublic, true))
        )
      )
      .limit(1)

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Error fetching template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/templates/[id]
 * Update a template
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Verify template belongs to user
    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))
      .limit(1)

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const body = await request.json()
    const {
      name,
      description,
      style,
      size,
      theme,
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
      customCss,
      pluginsOrder,
      pluginsConfig,
      isPublic,
    } = body

    // Merge terminal configs into pluginsConfig
    const updatedPluginsConfig = pluginsConfig !== undefined ? pluginsConfig : existingTemplate.pluginsConfig
    const finalPluginsConfig = setTerminalConfigs(updatedPluginsConfig, {
      hideTerminalEmojis,
      hideTerminalHeader,
      hideTerminalCommand,
    })

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
        pluginsConfig: finalPluginsConfig,
        isPublic: isPublic !== undefined ? isPublic : existingTemplate.isPublic,
      })
      .where(eq(templates.id, id))
      .returning()

    return NextResponse.json({ template: updatedTemplate })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a template
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    // Verify template belongs to user
    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))
      .limit(1)

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    await db.delete(templates).where(eq(templates.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

