/**
 * Image optimization utility using Sharp
 * Processes images before converting to base64
 */

import sharp from "sharp"

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  fit?: keyof sharp.FitEnum
}

/**
 * Optimizes an image using Sharp and returns as base64
 */
export async function optimizeImageToBase64(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  try {
    const { maxWidth = 200, maxHeight = 200, quality = 70, fit = "inside" } = options

    // Process image with Sharp
    let sharpInstance = sharp(imageBuffer)

    // Get metadata to detect type
    const metadata = await sharpInstance.metadata()

    // Resize maintaining aspect ratio
    sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
      fit,
      withoutEnlargement: true, // Don't enlarge images smaller than max size
    })

    // Compress based on image type
    let optimizedBuffer: Buffer
    const format = metadata.format

    if (format === "jpeg" || format === "jpg") {
      optimizedBuffer = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer()
    } else if (format === "png") {
      // PNG uses different compression, maintain high quality but reduce size
      optimizedBuffer = await sharpInstance.png({ compressionLevel: 6, quality }).toBuffer()
    } else if (format === "webp") {
      optimizedBuffer = await sharpInstance.webp({ quality }).toBuffer()
    } else {
      // For other formats, convert to JPEG
      optimizedBuffer = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer()
    }

    // Check if optimization significantly reduced size
    const originalSize = imageBuffer.length
    const optimizedSize = optimizedBuffer.length
    const compressionRatio = optimizedSize / originalSize

    if (compressionRatio < 0.5) {
      console.log(
        `🔄 Image optimized: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${(compressionRatio * 100).toFixed(1)}% of original)`
      )
    }

    // Convert to base64
    const base64 = optimizedBuffer.toString("base64")
    const mimeType = `image/${format === "jpg" ? "jpeg" : format}`

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.warn("⚠️ Failed to optimize image with Sharp, using original buffer:", error)

    // Fallback: return original image as base64
    try {
      const base64 = imageBuffer.toString("base64")
      const mimeType = "image/jpeg" // fallback
      return `data:${mimeType};base64,${base64}`
    } catch (fallbackError) {
      console.error("❌ Optimization fallback failed:", fallbackError)
      return ""
    }
  }
}

/**
 * Check if Sharp is available
 */
export function isSharpAvailable(): boolean {
  try {
    return typeof sharp !== "undefined"
  } catch {
    return false
  }
}

/**
 * Predefined sizes for optimization
 */
export const IMAGE_OPTIMIZATION_SIZES = {
  THUMBNAIL: { maxWidth: 60, maxHeight: 60, quality: 75 },
  SMALL: { maxWidth: 100, maxHeight: 100, quality: 75 },
  MEDIUM: { maxWidth: 150, maxHeight: 150, quality: 70 },
  LARGE: { maxWidth: 200, maxHeight: 200, quality: 70 },
  EXTRA_LARGE: { maxWidth: 300, maxHeight: 300, quality: 65 },
} as const

