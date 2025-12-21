/**
 * Script to generate Duolingo assets as data URLs
 * This runs at build time to create a browser-compatible assets file
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const assetsDir = join(__dirname, '../src/plugins/duolingo/assets')
const outputFile = join(__dirname, '../src/plugins/duolingo/assets/generated.ts')

function svgToDataUrl(svgContent: string): string {
  // Encode SVG as data URL
  const encoded = Buffer.from(svgContent).toString('base64')
  return `data:image/svg+xml;base64,${encoded}`
}

const assetFiles = [
  'happy-jumping.svg',
  'happy-jumping-2.svg',
  'very-happy-waving-wings.svg',
  'amazed.svg',
  'angry.svg',
  'angry-running.svg',
  'disappointed.svg',
  'default-hi.svg',
  'embarrassed-happy.svg',
  'embarrassed-happy-lying.svg',
  'happy-falling.svg',
  'in-love.svg',
  'sad-sitting.svg',
  'walking-singing.svg',
  'background-image.svg',
]

const assets: Record<string, string> = {}

for (const filename of assetFiles) {
  try {
    const filePath = join(assetsDir, filename)
    const svgContent = readFileSync(filePath, 'utf-8')
    // Convert filename to camelCase, but preserve hyphens for numbered variants
    let key = filename.replace('.svg', '')
    // Convert to camelCase but keep hyphens
    key = key.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
    assets[key] = svgToDataUrl(svgContent)
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error)
  }
}

const output = `/**
 * Duolingo mascot assets
 * Generated at build time - DO NOT EDIT MANUALLY
 * Run: pnpm generate-duolingo-assets
 */

export const duolingoAssets = ${JSON.stringify(assets, null, 2)} as const
`

import { writeFileSync } from 'fs'
writeFileSync(outputFile, output, 'utf-8')

console.log(`✅ Generated ${Object.keys(assets).length} Duolingo assets in ${outputFile}`)

