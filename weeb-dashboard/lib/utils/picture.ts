/**
 * An image the user uploads in the wizard, made ready to live inside the card's config.
 *
 * A picture with no address of its own (a pixel-art avatar drawn for the profile) has
 * nowhere for the generator to fetch it from, so the wizard keeps the image itself, as a
 * data URI, in the option. The card embeds it as it is. A small file is kept byte for
 * byte; a large one is shrunk first, since the card draws it at 174px at most.
 */

import { MAX_EMBEDDED_IMAGE_BYTES } from "@weeb/weeb-plugins"

/** The types the generator embeds (validImageDataUri in weeb-plugins). */
export const PICTURE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const

/** The longest side a shrunk picture gets: over twice the 174px it is drawn at. */
export const PICTURE_MAX_SIDE = 384

/** A file this size or under, on both counts, is kept as it is: no re-encoding, no blur. */
const KEEP_MAX_SIDE = 512

export const PICTURE_MAX_BYTES = MAX_EMBEDDED_IMAGE_BYTES

export function isPictureType(type: string): type is (typeof PICTURE_TYPES)[number] {
  return (PICTURE_TYPES as readonly string[]).includes(type)
}

/** Whether the file must be shrunk before it goes into the card. */
export function needsShrinking({ bytes, width, height }: { bytes: number; width: number; height: number }): boolean {
  return bytes > PICTURE_MAX_BYTES || Math.max(width, height) > KEEP_MAX_SIDE
}

/** The size that fits the longest side in `max`, keeping the proportions. Never larger. */
export function fitWithin(
  width: number,
  height: number,
  max: number = PICTURE_MAX_SIDE
): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

export function bytesToDataUri(bytes: Uint8Array, type: string): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return `data:${type};base64,${btoa(binary)}`
}

/** Decoded size of a data URI's payload, in bytes. */
export function dataUriBytes(dataUri: string): number {
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1)
  return Math.floor((base64.length * 3) / 4) - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0)
}
