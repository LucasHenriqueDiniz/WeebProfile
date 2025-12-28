import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { svgs } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { NextResponse } from "next/server"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

const MAX_SVGS_FREE_TIER = 3

/**
 * GET /api/svgs - Listar SVGs do usuário logado
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

    const userSvgs = await db.select().from(svgs).where(eq(svgs.userId, user.id))

    return NextResponse.json({ svgs: userSvgs })
  } catch (error) {
    console.error("Error fetching SVGs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/svgs - Criar novo SVG
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
          pluginsConfig = {},
          style = "default",
          size = "half",
          theme = "default",
          hideTerminalEmojis = false,
          hideTerminalHeader = false,
          hideTerminalCommand = false,
          customCss,
          customThemeColors,
          pluginsOrder,
        } = body

        if (!name) {
          return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        const [svgCount] = await db
          .select({ count: count() })
          .from(svgs)
          .where(eq(svgs.userId, user.id))

        if (svgCount.count >= MAX_SVGS_FREE_TIER) {
          return NextResponse.json(
            { error: `Maximum of ${MAX_SVGS_FREE_TIER} SVGs per user (free tier limit)` },
            { status: 403 }
          )
        }

        // Gerar slug único baseado no nome + timestamp (ainda necessário para compatibilidade)
        const slugBase = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
        const slug = `${slugBase}-${Date.now().toString(36)}`

        // Incluir customThemeColors e terminal configs no pluginsConfig
        const finalPluginsConfig = setTerminalConfigs(
          {
            ...pluginsConfig,
            ...(customThemeColors && Object.keys(customThemeColors).length > 0 && { customThemeColors }),
          },
          {
            hideTerminalEmojis,
            hideTerminalHeader,
            hideTerminalCommand,
          }
        )

        const [newSvg] = await db
          .insert(svgs)
          .values({
            userId: user.id,
            slug, // Slug ainda é necessário para compatibilidade, mas não será usado na URL
            name,
            pluginsConfig: finalPluginsConfig,
            style,
            size,
            theme,
            customCss: customCss || null,
            pluginsOrder: pluginsOrder || null, // null means use alphabetical order
            status: "pending",
            forceRegenerate: true,
          })
          .returning()

    return NextResponse.json({ svg: newSvg, created: true }, { status: 201 })
  } catch (error) {
    console.error("Error creating SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

