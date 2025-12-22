import { db } from "@/lib/db"
import { svgs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * GET /api/svg/[id] - Servir SVG gerado
 * 
 * Esta rota serve o SVG gerado do Supabase Storage.
 * Pode ser usada diretamente em markdown do GitHub.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Buscar SVG
    const [svg] = await db.select().from(svgs).where(eq(svgs.id, id)).limit(1)

    if (!svg) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 })
    }

    // Se não foi gerado ainda, retornar 404 ou redirecionar para gerar
    if (svg.status !== "completed" || !svg.storageUrl) {
      return NextResponse.json(
        { error: "SVG not generated yet", status: svg.status },
        { status: 404 }
      )
    }

    // Buscar SVG do storage
    const supabase = createAdminClient()
    const fileName = `${id}.svg`
    const { data, error } = await supabase.storage.from("svgs").download(fileName)

    if (error || !data) {
      return NextResponse.json({ error: "SVG file not found in storage" }, { status: 404 })
    }

    // Converter blob para string
    const svgContent = await data.text()

    // Retornar SVG com headers apropriados
    return new NextResponse(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache por 1 hora
        "CDN-Cache-Control": "public, max-age=86400", // Cache no CDN por 1 dia
      },
    })
  } catch (error) {
    console.error("Error serving SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
