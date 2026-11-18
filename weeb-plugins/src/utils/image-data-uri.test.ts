import { describe, expect, it } from "vitest"
import { MAX_EMBEDDED_IMAGE_BYTES, validImageDataUri } from "./image-data-uri"

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const JPEG = [0xff, 0xd8, 0xff, 0xe0]
const dataUri = (mime: string, bytes: number[]) => `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`

describe("validImageDataUri", () => {
  it("takes a PNG, JPEG or WebP whose bytes match its type", () => {
    const png = dataUri("image/png", [...PNG, 1, 2, 3])
    expect(validImageDataUri(png)).toBe(png)
    expect(validImageDataUri(dataUri("image/jpeg", [...JPEG, 1]))).not.toBeNull()
    const webp = [..."RIFF"]
      .map((c) => c.charCodeAt(0))
      .concat(
        [0, 0, 0, 0],
        [..."WEBP"].map((c) => c.charCodeAt(0))
      )
    expect(validImageDataUri(dataUri("image/webp", webp))).not.toBeNull()
  })

  // An SVG data URI can carry script; a mislabeled file is not what it says it is.
  it.each([
    ["an SVG", `data:image/svg+xml;base64,${Buffer.from("<svg onload='alert(1)'/>").toString("base64")}`],
    ["a PNG label on JPEG bytes", dataUri("image/png", [...JPEG, 1, 2])],
    ["a URL", "https://example.com/me.png"],
    ["text", "data:text/html;base64,PHNjcmlwdD4="],
    ["base64 with junk", "data:image/png;base64,iVBORw0KGgo=<script>"],
    ["no payload", "data:image/png;base64,"],
    ["a number", 42],
  ])("refuses %s", (_name, raw) => {
    expect(validImageDataUri(raw)).toBeNull()
  })

  it("refuses an image over the size limit", () => {
    const big = dataUri("image/png", [...PNG, ...new Array(MAX_EMBEDDED_IMAGE_BYTES).fill(0)])
    expect(validImageDataUri(big)).toBeNull()
    expect(validImageDataUri(dataUri("image/png", [...PNG, ...new Array(100).fill(0)]), 50)).toBeNull()
  })
})
