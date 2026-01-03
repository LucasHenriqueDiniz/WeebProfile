import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { pluginConfig } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getUserPluginConfigs, setPluginConfigs } from "@/lib/config/plugin-config"

/**
 * GET /api/plugin-config - Get all plugin configs for the current user
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

    const configs = await getUserPluginConfigs(user.id)

    return NextResponse.json({ configs })
  } catch (error) {
    console.error("Error fetching plugin configs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/plugin-config - Update plugin configs for the current user
 */
export async function PUT(request: Request) {
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
    const { configs } = body

    if (!configs || typeof configs !== "object") {
      return NextResponse.json({ error: "configs is required" }, { status: 400 })
    }

    await setPluginConfigs(user.id, configs)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating plugin configs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

