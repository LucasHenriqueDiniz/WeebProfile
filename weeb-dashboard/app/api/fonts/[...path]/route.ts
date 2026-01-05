/**
 * Font Assets API Route
 * 
 * Serves font files from @weeb/weeb-plugins/fonts/assets
 * GET /api/fonts/Poppins/poppins-v24-latin_latin-ext-regular.woff2
 */

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, resolve } from 'path'

// Resolve path to weeb-plugins fonts assets
// In development: node_modules/@weeb/weeb-plugins/dist/fonts/assets
// In production: node_modules/@weeb/weeb-plugins/dist/fonts/assets
function getFontsAssetsPath(): string | null {
  // Try to find weeb-plugins package
  const possiblePaths = [
    resolve(process.cwd(), 'node_modules/@weeb/weeb-plugins/dist/fonts/assets'),
    resolve(process.cwd(), 'node_modules/@weeb/weeb-plugins/src/fonts/assets'),
    // For monorepo (workspace)
    resolve(process.cwd(), '../../weeb-plugins/dist/fonts/assets'),
    resolve(process.cwd(), '../../weeb-plugins/src/fonts/assets'),
  ]
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }
  
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params
    const fontPath = pathArray.join('/')
    
    // Security: prevent path traversal
    if (fontPath.includes('..') || fontPath.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    
    // Only allow .woff2 files
    if (!fontPath.endsWith('.woff2')) {
      return NextResponse.json({ error: 'Only .woff2 files are allowed' }, { status: 400 })
    }
    
    const fontsAssetsPath = getFontsAssetsPath()
    if (!fontsAssetsPath) {
      return NextResponse.json(
        { error: 'Fonts assets path not found' },
        { status: 500 }
      )
    }
    
    const fullPath = join(fontsAssetsPath, fontPath)
    
    // Security: ensure path is within fontsAssetsPath
    if (!fullPath.startsWith(fontsAssetsPath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    
    // Read font file
    const fontBuffer = await readFile(fullPath)
    
    // Return with appropriate headers
    return new NextResponse(fontBuffer, {
      headers: {
        'Content-Type': 'font/woff2',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error('Error serving font:', error)
    return NextResponse.json(
      { error: 'Font not found' },
      { status: 404 }
    )
  }
}

