import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { templateLikes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * POST /api/templates/[id]/like
 * Like a template
 */
export async function POST(
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
    const templateId = id

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(templateLikes)
      .where(and(eq(templateLikes.userId, user.id), eq(templateLikes.templateId, templateId)))
      .limit(1)

    if (existingLike) {
      return NextResponse.json({ error: "Template already liked" }, { status: 400 })
    }

    // Create like
    const [newLike] = await db
      .insert(templateLikes)
      .values({
        userId: user.id,
        templateId,
      })
      .returning()

    return NextResponse.json({ like: newLike }, { status: 201 })
  } catch (error) {
    console.error("Error liking template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/templates/[id]/like
 * Unlike a template
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
    const templateId = id

    // Delete like
    await db
      .delete(templateLikes)
      .where(and(eq(templateLikes.userId, user.id), eq(templateLikes.templateId, templateId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unliking template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

