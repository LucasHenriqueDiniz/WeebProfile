/**
 * The browser half of lib/utils/picture.ts: reads an uploaded file and turns it into the
 * data URI the card keeps. Needs createImageBitmap and a canvas, so it runs in the
 * wizard only.
 */

import {
  PICTURE_MAX_BYTES,
  PICTURE_MAX_SIDE,
  bytesToDataUri,
  fitWithin,
  isPictureType,
  needsShrinking,
} from "./picture"

/**
 * Encodes the canvas in the first type that fits, WebP first: Safari before 17 cannot
 * write it. The lower qualities are for a photo-like screenshot that a smaller limit
 * (a website thumbnail's) does not take at the higher ones.
 */
async function encodeCanvas(canvas: HTMLCanvasElement, maxBytes: number): Promise<Blob | null> {
  const attempts: Array<[string, number | undefined]> = [
    ["image/webp", 0.9],
    ["image/png", undefined],
    ["image/jpeg", 0.85],
    ["image/webp", 0.75],
    ["image/jpeg", 0.7],
  ]
  for (const [type, quality] of attempts) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
    if (blob && blob.type === type && blob.size <= maxBytes) return blob
  }
  return null
}

/**
 * The file as a data URI the card can embed: as it is when it is small, shrunk to
 * `maxSide` (384px by default) otherwise. Throws a message key when it cannot be used.
 */
export async function prepareImage(
  file: File,
  { maxSide = PICTURE_MAX_SIDE, maxBytes = PICTURE_MAX_BYTES }: { maxSide?: number; maxBytes?: number } = {}
): Promise<string> {
  if (!isPictureType(file.type)) throw new Error("errorType")
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("errorRead")
  }
  try {
    if (!needsShrinking({ bytes: file.size, width: bitmap.width, height: bitmap.height }, { maxBytes, maxSide })) {
      return bytesToDataUri(new Uint8Array(await file.arrayBuffer()), file.type)
    }
    const size = fitWithin(bitmap.width, bitmap.height, maxSide)
    const canvas = document.createElement("canvas")
    canvas.width = size.width
    canvas.height = size.height
    const context = canvas.getContext("2d")
    if (!context) throw new Error("errorRead")
    context.imageSmoothingQuality = "high"
    context.drawImage(bitmap, 0, 0, size.width, size.height)
    const blob = await encodeCanvas(canvas, maxBytes)
    if (!blob) throw new Error("errorTooBig")
    return bytesToDataUri(new Uint8Array(await blob.arrayBuffer()), blob.type)
  } finally {
    bitmap.close()
  }
}
