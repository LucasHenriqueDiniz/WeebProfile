import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

/**
 * API route para servir imagens de preview das seções
 * Rota: /api/section-preview/github/default/repositories.svg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params
    const filePath = pathArray.join("/")
    
    // Validar caminho para evitar path traversal
    if (filePath.includes("..") || filePath.includes("~")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    // Tentar encontrar a imagem em múltiplos locais
    // Formato esperado: github/default/repositories.svg
    const [plugin, style, ...sectionParts] = filePath.split("/")
    const sectionFile = sectionParts.join("/")
    
    const possiblePaths = [
      // No projeto atual (public)
      join(process.cwd(), "public", "section-previews", filePath),
      // No source antigo: source/plugins/{plugin}/assets/{style}/{section}
      join(process.cwd(), "..", "source", "plugins", plugin, "assets", style, sectionFile),
      // No weeb-plugins
      join(process.cwd(), "..", "weeb-plugins", "src", "plugins", plugin, "assets", style, sectionFile),
    ]

    let imageBuffer: Buffer | null = null
    let contentType = "image/svg+xml"

    for (const possiblePath of possiblePaths) {
      try {
        imageBuffer = await readFile(possiblePath)
        break
      } catch (error) {
        // Continuar tentando outros caminhos
        continue
      }
    }

    if (!imageBuffer) {
      // Retornar SVG placeholder se não encontrar a imagem
      const placeholderSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#f3f4f6"/>
  <text x="300" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">
    Preview não disponível
  </text>
</svg>`
      return new NextResponse(placeholderSvg, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    return new NextResponse(imageBuffer as any, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error serving section preview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

