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
    const testFile = testFiles[username.toLowerCase()] || testFiles.profile

    // No Vercel, arquivos em public/ são servidos diretamente
    // Mas para API routes, precisamos fazer fetch do próprio domínio
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Tenta buscar o SVG do public/test
    const svgUrl = `${baseUrl}/test/${testFile}`

    try {
      const response = await fetch(svgUrl, { cache: "force-cache" })
      
      if (!response.ok) {
        return NextResponse.json(
          { error: "SVG not found. It may still be generating. Please try again later." },
          { status: 404 }
        )
      }

      const svgContent = await response.text()

      // Retorna com headers corretos para SVG
      return new NextResponse(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, s-maxage=86400", // 1 dia
          "Access-Control-Allow-Origin": "*",
          "CDN-Cache-Control": "public, max-age=86400",
        },
      })
    } catch (fetchError) {
      // Fallback: retorna erro amigável
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

