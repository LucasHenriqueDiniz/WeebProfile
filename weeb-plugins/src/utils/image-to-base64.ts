/**
 * Embeds the exact bytes fetched from a HTTPS image as a data URI. This is the
 * only image pipeline used by production plugins: no decode, resize, re-encode
 * or format conversion happens here.
 */
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number]

const JPEG_MAGIC = [0xff, 0xd8, 0xff]
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function bytesStartWith(bytes: Uint8Array, signature: number[]): boolean {
  return bytes.length >= signature.length && signature.every((byte, index) => bytes[index] === byte)
}

function isWebp(bytes: Uint8Array): boolean {
  return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
}

function matchesMagicBytes(bytes: Uint8Array, mime: AcceptedMimeType): boolean {
  if (mime === "image/jpeg") return bytesStartWith(bytes, JPEG_MAGIC)
  if (mime === "image/png") return bytesStartWith(bytes, PNG_MAGIC)
  return isWebp(bytes)
}

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidImageError"
  }
}

export class ImageTooLargeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageTooLargeError"
  }
}

export interface DirectImageOptions {
  maxBytes?: number
  allowedMimeTypes?: readonly string[]
  timeout?: number
}

export interface DirectImageResult {
  dataUri: string
  mime: string
  byteLength: number
}

function encodeBase64(bytes: Uint8Array): string {
  const toBase64 = (bytes as Uint8Array & { toBase64?: () => string }).toBase64
  if (typeof toBase64 === "function") return toBase64.call(bytes)
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64")
}

export async function urlToDataUriDirect(url: string, options: DirectImageOptions = {}): Promise<DirectImageResult> {
  const { maxBytes, allowedMimeTypes = ACCEPTED_MIME_TYPES, timeout = 15_000 } = options
  if (!url.startsWith("https://")) throw new InvalidImageError("Only https:// image URLs are allowed")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  let response: Response
  try {
    response = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "WeebProfile/1.0" } })
  } catch (error) {
    throw new InvalidImageError(error instanceof Error && error.name === "AbortError" ? "Image request timed out" : "Image request failed")
  } finally {
    clearTimeout(timeoutId)
  }
  if (!response.ok) throw new InvalidImageError(`HTTP ${response.status}`)

  const headerMime = (response.headers.get("content-type") || "").split(";", 1)[0]!.trim().toLowerCase()
  // MAL CDN legitimately returns the non-standard but common image/jpg alias.
  const mime = headerMime === "image/jpg" ? "image/jpeg" : headerMime
  if (!allowedMimeTypes.includes(mime)) throw new InvalidImageError(`Unsupported MIME type: ${mime || "(missing)"}`)
  const contentLength = Number(response.headers.get("content-length"))
  if (maxBytes !== undefined && Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ImageTooLargeError(`Image exceeds maxBytes (${contentLength} > ${maxBytes})`)
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  if (maxBytes !== undefined && bytes.byteLength > maxBytes) throw new ImageTooLargeError(`Image exceeds maxBytes (${bytes.byteLength} > ${maxBytes})`)
  if (!matchesMagicBytes(bytes, mime as AcceptedMimeType)) throw new InvalidImageError(`Content-Type ${mime} does not match image bytes`)

  return { dataUri: `data:${mime};base64,${encodeBase64(bytes)}`, mime, byteLength: bytes.byteLength }
}
