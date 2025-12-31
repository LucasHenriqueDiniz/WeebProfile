import { NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

/**
 * GET /api/preview/[...path] - Serve preview images from weeb-plugins
 * 
 * Esta rota serve os arquivos SVG de preview diretamente do weeb-plugins,
 * evitando duplicação de arquivos.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "Path required" }, { status: 400 })
    }

    // Path format: plugin/default/section.svg
    // Join all segments to get the full path
    const previewPath = pathSegments.join("/")
    
    // Resolve to weeb-plugins/src/plugins/{plugin}/previews/{plugin}_{section}.svg
    const pathParts = previewPath.split("/")
    if (pathParts.length !== 3 || pathParts[1] !== "default") {
      return NextResponse.json({ error: "Invalid path format" }, { status: 400 })
    }

    const [pluginName, , sectionName] = pathParts
    
    // Remove .svg extension if present
    const sectionId = sectionName.replace(/\.svg$/, "")
    
    // Path to preview in weeb-plugins
    // From weeb-dashboard root, go up one level to monorepo root, then into weeb-plugins
    const pluginsDir = path.join(process.cwd(), "../weeb-plugins/src/plugins")
    const previewFile = path.join(pluginsDir, pluginName, "previews", `${pluginName}_${sectionId}.svg`)

    // Security: ensure the path is within plugins directory
    const normalizedPreview = path.normalize(previewFile)
    const normalizedPluginsDir = path.normalize(pluginsDir)
    
    if (!normalizedPreview.startsWith(normalizedPluginsDir)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 })
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPreview)) {
      return NextResponse.json({ error: "Preview not found" }, { status: 404 })
    }

    // Read and serve the SVG file
    const svgContent = fs.readFileSync(normalizedPreview, "utf-8")

    return new NextResponse(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache por 1 hora
        "CDN-Cache-Control": "public, max-age=86400", // Cache no CDN por 1 dia
      },
    })
  } catch (error) {
    console.error("Error serving preview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

