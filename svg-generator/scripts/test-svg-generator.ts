/**
 * Test script for SVG generator height calculation
 *
 * Tests the complete SVG generation pipeline with mock data
 * to ensure per-plugin height calculation works correctly.
 *
 * Usage: pnpm --filter @weeb/svg-generator test:generator
 */

import { generateSvg } from "../src/index.js"
import fs from "node:fs/promises"
import path from "node:path"

/**
 * Mock plugin data for testing
 */
function createMockPluginData() {
  return {
    "16personalities": {
      enabled: true,
      sections: ["personality"],
      personality_url: "https://www.16personalities.com/br/resultados/enfj-t/m/example",
      personality_hide_title: false,
      personality_title: "Personality",
      personality_show_description: true,
      personality_show_link: true,
      data: {
        personality: {
          type: "ENFJ-T",
          emoji: "🎭",
          description: "Extraverted Intuitive Feeling Judging Turbulent",
          link: "https://www.16personalities.com/personality-types/enfj-t",
        },
      },
    },
  }
}

/**
 * Create test configuration
 */
function createTestConfig(size: "half" | "full" = "half") {
  return {
    size,
    style: "default" as const,
    plugins: createMockPluginData(),
    background: {
      type: "solid" as const,
      color: "#ffffff",
    },
    border: {
      enabled: true,
      color: "#e5e7eb",
      width: 2,
    },
  }
}

/**
 * Validate SVG generation result
 */
function validateResult(result: any) {
  if (!result.svg) {
    throw new Error("No SVG generated")
  }

  if (!result.width || result.width <= 0) {
    throw new Error(`Invalid width: ${result.width}`)
  }

  if (!result.height || result.height <= 0) {
    throw new Error(`Invalid height: ${result.height}`)
  }

  if (result.height < 50) {
    console.warn(`⚠️ WARNING: Height seems too small (${result.height}px)`)
  }

  if (result.height > 2000) {
    console.warn(`⚠️ WARNING: Height seems too large (${result.height}px)`)
  }

  return true
}

/**
 * Save result for debugging
 */
async function saveDebugInfo(result: any, config: any) {
  if (process.env.SAVE_DEBUG === "1") {
    const debugDir = path.resolve(process.cwd(), "debug")
    await fs.mkdir(debugDir, { recursive: true })

    // Save SVG
    const svgPath = path.join(debugDir, `test-${config.size}.svg`)
    await fs.writeFile(svgPath, result.svg, "utf-8")

    // Save metadata
    const metadataPath = path.join(debugDir, `test-${config.size}.json`)
    await fs.writeFile(
      metadataPath,
      JSON.stringify(
        {
          config,
          result: {
            width: result.width,
            height: result.height,
            svgLength: result.svg.length,
          },
        },
        null,
        2
      )
    )

    console.log(`📁 Debug files saved: ${debugDir}`)
  }
}

async function main() {
  console.log("🧪 Testing SVG Generator with per-plugin height calculation...\n")

  const testSizes: Array<"half" | "full"> = ["half", "full"]
  const results = []

  for (const size of testSizes) {
    console.log(`\n📐 Testing ${size} size...`)

    try {
      const config = createTestConfig(size)
      console.log(`  Width: ${size === "half" ? 415 : 830}px`)

      // Generate SVG with height measurement
      const startTime = Date.now()
      const result = await generateSvg(config)
      const duration = Date.now() - startTime

      console.log(`  ⏱️  Generation time: ${duration}ms`)
      console.log(`  📏 Calculated height: ${result.height}px`)
      console.log(`  📐 Generated width: ${result.width}px`)
      console.log(`  📄 SVG size: ${result.svg.length} characters`)

      // Validate result
      validateResult(result)

      // Save debug info if requested
      await saveDebugInfo(result, config)

      results.push({
        size,
        width: result.width,
        height: result.height,
        duration,
        svgLength: result.svg.length,
      })

      console.log(`  ✅ ${size} test passed!`)
    } catch (error: any) {
      console.error(`  ❌ ${size} test failed:`, error.message)
      process.exit(1)
    }
  }

  // Summary
  console.log("\n📊 Test Summary:")
  results.forEach((result) => {
    console.log(`  ${result.size.toUpperCase()}: ${result.height}px (${result.duration}ms)`)
  })

  // Validate consistency
  const heightDiff = Math.abs(results[0].height - results[1].height)
  if (heightDiff > 50) {
    console.warn(`\n⚠️ WARNING: Large height difference between sizes (${heightDiff}px)`)
  }

  console.log("\n✅ All tests passed!")
  console.log("\n💡 Tips:")
  console.log("  - Set SAVE_DEBUG=1 to save debug files")
  console.log("  - Heights should be consistent between runs")
  console.log("  - Generation should complete within 5 seconds")
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
