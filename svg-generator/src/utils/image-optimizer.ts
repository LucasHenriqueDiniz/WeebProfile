/**
 * Utilitário para otimização de imagens usando Sharp
 * Processa imagens antes de converter para base64
 */

import sharp from 'sharp'

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  fit?: keyof sharp.FitEnum
}

/**
 * Otimiza uma imagem usando Sharp e retorna como base64
 */
export async function optimizeImageToBase64(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  try {
    const {
      maxWidth = 200,
      maxHeight = 200,
      quality = 70,
      fit = 'inside'
    } = options

    // Processar imagem com Sharp
    let sharpInstance = sharp(imageBuffer)

    // Obter metadados para detectar tipo
    const metadata = await sharpInstance.metadata()

    // Redimensionar mantendo proporção
    sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
      fit,
      withoutEnlargement: true, // Não aumentar imagens menores que o tamanho máximo
    })

    // Comprimir baseado no tipo de imagem
    let optimizedBuffer: Buffer
    const format = metadata.format

    if (format === 'jpeg' || format === 'jpg') {
      optimizedBuffer = await sharpInstance
        .jpeg({ quality, mozjpeg: true })
        .toBuffer()
    } else if (format === 'png') {
      // PNG usa compressão diferente, manter qualidade alta mas reduzir tamanho
      optimizedBuffer = await sharpInstance
        .png({ compressionLevel: 6, quality })
        .toBuffer()
    } else if (format === 'webp') {
      optimizedBuffer = await sharpInstance
        .webp({ quality })
        .toBuffer()
    } else {
      // Para outros formatos, converter para JPEG
      optimizedBuffer = await sharpInstance
        .jpeg({ quality, mozjpeg: true })
        .toBuffer()
    }

    // Verificar se a otimização reduziu significativamente o tamanho
    const originalSize = imageBuffer.length
    const optimizedSize = optimizedBuffer.length
    const compressionRatio = optimizedSize / originalSize

    if (compressionRatio < 0.5) {
      console.log(`🔄 Imagem otimizada: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${(compressionRatio * 100).toFixed(1)}% do original)`)
    }

    // Converter para base64
    const base64 = optimizedBuffer.toString('base64')
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`

    return `data:${mimeType};base64,${base64}`

  } catch (error) {
    console.warn('⚠️  Falha ao otimizar imagem com Sharp, usando buffer original:', error)

    // Fallback: retornar imagem original como base64
    try {
      const base64 = imageBuffer.toString('base64')
      const mimeType = 'image/jpeg' // fallback
      return `data:${mimeType};base64,${base64}`
    } catch (fallbackError) {
      console.error('❌ Falha no fallback de otimização:', fallbackError)
      return ''
    }
  }
}

/**
 * Verifica se Sharp está disponível
 */
export function isSharpAvailable(): boolean {
  try {
    return typeof sharp !== 'undefined'
  } catch {
    return false
  }
}

/**
 * Tamanhos pré-definidos para otimização
 */
export const IMAGE_OPTIMIZATION_SIZES = {
  THUMBNAIL: { maxWidth: 60, maxHeight: 60, quality: 75 },
  SMALL: { maxWidth: 100, maxHeight: 100, quality: 75 },
  MEDIUM: { maxWidth: 150, maxHeight: 150, quality: 70 },
  LARGE: { maxWidth: 200, maxHeight: 200, quality: 70 },
  EXTRA_LARGE: { maxWidth: 300, maxHeight: 300, quality: 65 },
} as const









