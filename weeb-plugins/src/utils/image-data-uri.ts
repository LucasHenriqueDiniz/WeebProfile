/**
 * Images the user sent through the wizard, kept in the card's config as a data URI.
 *
 * A picture with no address of its own (a pixel-art avatar drawn for the profile, say)
 * has nowhere for the generator to fetch it from. The wizard reads the file, shrinks it
 * when it is large, and stores it as `data:image/...;base64,...`, which the card embeds
 * as it is. Only raster types are taken: an SVG data URI could carry script.
 */

import { matchesMagicBytes, type AcceptedMimeType } from "./image-to-base64"

/** The most an embedded image may weigh, decoded. The wizard shrinks larger files to fit. */
export const MAX_EMBEDDED_IMAGE_BYTES = 150_000

const DATA_URI = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * The data URI when it is a PNG, JPEG or WebP image whose bytes are what its type says,
 * within the size limit; null for anything else (an SVG, a URL, a truncated or forged
 * file). Base64 is checked against its own alphabet before decoding.
 */
export function validImageDataUri(raw: unknown, maxBytes: number = MAX_EMBEDDED_IMAGE_BYTES): string | null {
  if (typeof raw !== "string") return null
  // The base64 of maxBytes is 4/3 of it: anything longer is over the limit without decoding.
  if (raw.length > Math.ceil(maxBytes / 3) * 4 + 40) return null
  const match = DATA_URI.exec(raw.trim())
  if (!match) return null
  let bytes: Uint8Array
  try {
    bytes = decodeBase64(match[2]!)
  } catch {
    return null
  }
  if (bytes.byteLength === 0 || bytes.byteLength > maxBytes) return null
  return matchesMagicBytes(bytes, match[1] as AcceptedMimeType) ? `data:${match[1]};base64,${match[2]}` : null
}
