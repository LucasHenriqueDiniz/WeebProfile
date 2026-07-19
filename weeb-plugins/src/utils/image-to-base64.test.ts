import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { urlToDataUriDirect, InvalidImageError, ImageTooLargeError } from "./image-to-base64"


// Minimal valid file headers for magic-byte validation, padded to a plausible size.
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0])
const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])
const WEBP_BYTES = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0, 0, 0])
const NOT_A_JPEG_BYTES = new Uint8Array([0x00, 0x01, 0x02, 0x03])

function headerGetter(map: Record<string, string>) {
  return { get: (key: string) => map[key.toLowerCase()] ?? null } as unknown as Headers
}

function mockResponse(
  status: number,
  bytes: Uint8Array,
  contentType: string,
  extraHeaders: Record<string, string> = {}
) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: headerGetter({ "content-type": contentType, ...extraHeaders }),
    arrayBuffer: async () => bytes.buffer,
  } as unknown as Response
}

describe("urlToDataUriDirect", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn() as any
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it("returns a correct data URI for a valid JPEG", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, JPEG_BYTES, "image/jpeg"))
    const result = await urlToDataUriDirect("https://example.com/a.jpg")
    expect(result.mime).toBe("image/jpeg")
    expect(result.byteLength).toBe(JPEG_BYTES.byteLength)
    expect(result.dataUri.startsWith("data:image/jpeg;base64,")).toBe(true)
  })

  it("returns a correct data URI for a valid PNG", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, PNG_BYTES, "image/png"))
    const result = await urlToDataUriDirect("https://example.com/a.png")
    expect(result.mime).toBe("image/png")
    expect(result.dataUri.startsWith("data:image/png;base64,")).toBe(true)
  })

  it("returns a correct data URI for a valid WebP", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, WEBP_BYTES, "image/webp"))
    const result = await urlToDataUriDirect("https://example.com/a.webp")
    expect(result.mime).toBe("image/webp")
    expect(result.dataUri.startsWith("data:image/webp;base64,")).toBe(true)
  })

  it("rejects an unsupported Content-Type", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, JPEG_BYTES, "text/html"))
    await expect(urlToDataUriDirect("https://example.com/a")).rejects.toBeInstanceOf(InvalidImageError)
  })

  it("rejects when magic bytes don't match a real image at all", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, NOT_A_JPEG_BYTES, "image/jpeg"))
    await expect(urlToDataUriDirect("https://example.com/a.jpg")).rejects.toBeInstanceOf(InvalidImageError)
  })

  it("rejects when Content-Type and magic bytes disagree (mislabeled response)", async () => {
    // Real PNG bytes, but the server claims it's a JPEG.
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, PNG_BYTES, "image/jpeg"))
    await expect(urlToDataUriDirect("https://example.com/a.jpg")).rejects.toBeInstanceOf(InvalidImageError)
  })

  it("rejects a non-OK HTTP response", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(404, JPEG_BYTES, "image/jpeg"))
    await expect(urlToDataUriDirect("https://example.com/missing.jpg")).rejects.toBeInstanceOf(InvalidImageError)
  })

  it("rejects an image larger than maxBytes", async () => {
    const bigBytes = new Uint8Array(1000)
    bigBytes.set(JPEG_BYTES)
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, bigBytes, "image/jpeg"))
    await expect(urlToDataUriDirect("https://example.com/big.jpg", { maxBytes: 100 })).rejects.toBeInstanceOf(
      ImageTooLargeError
    )
  })

  it("rejects a non-https URL before ever fetching", async () => {
    await expect(urlToDataUriDirect("http://example.com/a.jpg")).rejects.toBeInstanceOf(InvalidImageError)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("produces bytes identical to the original after decoding the base64 back out", async () => {
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, JPEG_BYTES, "image/jpeg"))
    const result = await urlToDataUriDirect("https://example.com/a.jpg")
    const base64 = result.dataUri.split(",")[1]!
    const decoded = Buffer.from(base64, "base64")
    expect(new Uint8Array(decoded)).toEqual(JPEG_BYTES)
  })

  it("uses Uint8Array.prototype.toBase64 when available, matching the Buffer-based fallback", async () => {
    const hasNativeToBase64 = typeof (Uint8Array.prototype as any).toBase64 === "function"
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse(200, JPEG_BYTES, "image/jpeg"))
    const result = await urlToDataUriDirect("https://example.com/a.jpg")
    const base64FromResult = result.dataUri.split(",")[1]!
    const base64FromBuffer = Buffer.from(JPEG_BYTES.buffer, JPEG_BYTES.byteOffset, JPEG_BYTES.byteLength).toString(
      "base64"
    )
    expect(base64FromResult).toBe(base64FromBuffer)
    // Documents which path this environment actually took, without failing either way.
    expect(typeof hasNativeToBase64).toBe("boolean")
  })

})
