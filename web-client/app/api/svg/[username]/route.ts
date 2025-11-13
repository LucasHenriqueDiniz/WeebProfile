import { readFile } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"

export const revalidate = 86400 // Revalidar a cada 24 horas

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const filename = request.nextUrl.searchParams.get("file") || "Profile.svg"

    // Por enquanto, servimos os SVGs de teste do public/test
    // Depois vamos integrar com Supabase
    const testFiles: Record<string, string> = {
      github: "Github.svg",
      lastfm: "LastFM.svg",
      myanimelist: "MyAnimeList.svg",
      profile: "Github.svg", // Default
    }

    // Mapeia username para arquivo de teste
    const testFile: string = testFiles[username.toLowerCase()] || testFiles.profile || "Github.svg"

    try {
      // Lê o arquivo diretamente do sistema de arquivos
      // No Vercel, o diretório public/ está disponível em runtime
      const publicPath = join(process.cwd(), "public", "test", testFile)
      const svgContent = await readFile(publicPath, "utf-8")

      // Retorna com headers corretos para SVG
      return new NextResponse(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, s-maxage=86400", // 1 dia
          "Access-Control-Allow-Origin": "*",
          "CDN-Cache-Control": "public, max-age=86400",
        },
      })
    } catch (fileError) {
      console.error("Error reading SVG file:", fileError)
      return NextResponse.json(
        { error: "SVG not found. Please ensure the file exists in public/test/" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error serving SVG:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

