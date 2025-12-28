import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { svgs } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { deleteSvgFromStorage } from "@/lib/svg-generator"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

/**
 * GET /api/svgs/[id] - Buscar SVG específico
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const [svg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, user.id)))
      .limit(1)

    if (!svg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    return NextResponse.json({ svg })
  } catch (error) {
    console.error("Error fetching SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/svgs/[id] - Atualizar SVG
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const body = await request.json()

    // Verificar se o SVG pertence ao usuário
    const [existingSvg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, user.id)))
      .limit(1)

    if (!existingSvg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    // Merge terminal configs into pluginsConfig
    const updatedPluginsConfig = body.pluginsConfig || existingSvg.pluginsConfig
    const finalPluginsConfig = setTerminalConfigs(updatedPluginsConfig, {
      hideTerminalEmojis: body.hideTerminalEmojis,
      hideTerminalHeader: body.hideTerminalHeader,
      hideTerminalCommand: body.hideTerminalCommand,
    })

    // Atualizar SVG
    const [updatedSvg] = await db
      .update(svgs)
      .set({
        name: body.name || existingSvg.name,
        style: body.style || existingSvg.style,
        size: body.size || existingSvg.size,
        theme: body.theme !== undefined ? body.theme : existingSvg.theme,
        customCss: body.customCss !== undefined ? body.customCss : existingSvg.customCss,
        pluginsOrder: body.pluginsOrder !== undefined ? (body.pluginsOrder || null) : existingSvg.pluginsOrder, // null means use alphabetical order
        pluginsConfig: finalPluginsConfig,
      })
      .where(eq(svgs.id, id))
      .returning()

    return NextResponse.json({ svg: updatedSvg })
  } catch (error) {
    console.error("Error updating SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/svgs/[id] - Deletar SVG
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Verificar se o SVG pertence ao usuário
    const [existingSvg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, user.id)))
      .limit(1)

    if (!existingSvg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    // Deletar arquivo do storage se existir
    if (existingSvg.storagePath || existingSvg.storageUrl) {
      try {
        await deleteSvgFromStorage(id)
      } catch (error) {
        console.error("Error deleting SVG from storage:", error)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Deletar SVG do banco
    await db.delete(svgs).where(eq(svgs.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
