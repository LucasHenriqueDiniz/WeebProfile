import { describe, expect, it } from "vitest"
import { validImageDataUri } from "@weeb/weeb-plugins"
import { bytesToDataUri, dataUriBytes, fitWithin, needsShrinking, PICTURE_MAX_BYTES } from "./picture"

describe("picture", () => {
  // The pixel-art avatar of the profile header: 348px, 5 KB. Re-encoding it would blur it.
  it("keeps a small file as it is", () => {
    expect(needsShrinking({ bytes: 5_164, width: 348, height: 348 })).toBe(false)
    expect(needsShrinking({ bytes: PICTURE_MAX_BYTES + 1, width: 300, height: 300 })).toBe(true)
    expect(needsShrinking({ bytes: 20_000, width: 1024, height: 768 })).toBe(true)
  })

  it("shrinks to 384px on the longest side, keeping the proportions, and never enlarges", () => {
    expect(fitWithin(1024, 768)).toEqual({ width: 384, height: 288 })
    expect(fitWithin(600, 2400)).toEqual({ width: 96, height: 384 })
    expect(fitWithin(200, 100)).toEqual({ width: 200, height: 100 })
  })

  // What the wizard stores must be what the generator embeds.
  it("writes a data URI the generator takes, with its decoded size", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...new Array(70_000).fill(7)])
    const uri = bytesToDataUri(png, "image/png")
    expect(validImageDataUri(uri)).toBe(uri)
    expect(dataUriBytes(uri)).toBe(png.length)
  })
})
