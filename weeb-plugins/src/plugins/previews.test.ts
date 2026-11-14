import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

// The committed previews are what the landing and the wizard show. An image that fails
// to embed while they are generated (too big for the plugin's maxBytes, gone from its
// CDN) becomes the grey "No Image" box of utils/image.tsx, and nothing else notices:
// two of the five artists on the landing's Last.fm card were that box. The box is an
// SVG data URI, so the text only shows up once decoded.
const PLUGINS_DIR = __dirname

function previewFiles(): string[] {
  return readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((plugin) => {
      const previews = path.join(PLUGINS_DIR, plugin.name, "previews")
      try {
        return readdirSync(previews, { recursive: true, encoding: "utf-8" })
          .filter((file) => file.endsWith(".svg"))
          .map((file) => path.join(previews, file))
      } catch {
        return []
      }
    })
}

function placeholderCount(svg: string): number {
  let count = 0
  for (const match of svg.matchAll(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g)) {
    if (
      Buffer.from(match[1] ?? "", "base64")
        .toString("utf-8")
        .includes("No Image")
    )
      count++
  }
  return count
}

describe("committed previews", () => {
  const files = previewFiles()

  it("exist", () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it("embed every image instead of the No Image placeholder", () => {
    const withPlaceholder = files
      .map((file) => ({ file: path.relative(PLUGINS_DIR, file), count: placeholderCount(readFileSync(file, "utf-8")) }))
      .filter(({ count }) => count > 0)
    expect(withPlaceholder).toEqual([])
  })
})
