/**
 * Utilitário para converter URLs de imagens para base64
 * Converte URLs de imagens para base64 para embed direto no SVG
 * Essencial para compatibilidade com GitHub/GitLab e outros sites que bloqueiam imagens externas
 */

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Tamanhos pré-definidos para otimização de imagens
 */
// Tamanhos padronizados - sempre 200px para máxima qualidade
export const IMAGE_OPTIMIZATION = {
  maxWidth: 200,
  maxHeight: 200,
  quality: 70,
} as const

/**
 * Verifica se estamos no contexto do svg-generator (onde Sharp está disponível)
 */
function isSvgGeneratorContext(): boolean {
  // Verificar se estamos em um ambiente Node.js
  if (typeof process === "undefined" || !process.versions || !process.versions.node) {
    return false
  }

  // Verificar se Sharp está disponível (foi instalado no svg-generator)
  try {
    require("sharp")
    return true
  } catch {
    return false
  }
}

/**
 * Converte uma URL de imagem para base64 usando fetch
 * Funciona tanto em Node.js quanto no browser
 * Suporte opcional a otimização de imagem
 */
export async function urlToBase64(
  imageUrl: string,
  timeout = 15000,
  options?: ImageOptimizationOptions
): Promise<string> {
  try {
    // Criar AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Em Node.js, usar fetch nativo (Node 18+)
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText} (${response.status})`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Se estamos no contexto do svg-generator e temos opções de otimização,
    // tentar usar Sharp para otimizar a imagem
    if (isSvgGeneratorContext() && options) {
      try {
        // Tentar otimizar com Sharp diretamente
        const sharp = require("sharp")
        const optimizedBuffer = await sharp(buffer)
          .resize(options.maxWidth || 200, options.maxHeight || 200, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: options.quality || 70, mozjpeg: true })
          .toBuffer()

        const base64 = optimizedBuffer.toString("base64")
        const contentType = response.headers.get("content-type") || "image/jpeg"
        return `data:${contentType};base64,${base64}`
      } catch (error) {
        console.warn(`⚠️  Falha ao otimizar imagem, usando versão original:`, error)
      }
    }

    // Conversão normal para base64
    const base64 = buffer.toString("base64")
    const contentType = response.headers.get("content-type") || "image/jpeg"
    return `data:${contentType};base64,${base64}`
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn(`    ⏱️  Timeout ao converter imagem: ${imageUrl.substring(0, 50)}...`)
    } else {
      console.warn(`    ❌ Erro ao converter: ${imageUrl.substring(0, 50)}... - ${error.message}`)
    }
    // Retornar string vazia em caso de erro (não URL original para evitar problemas)
    return ""
  }
}

/**
 * Converte múltiplas URLs para base64 em paralelo
 */
export async function urlsToBase64(urls: string[]): Promise<string[]> {
  return Promise.all(urls.map((url) => urlToBase64(url)))
}
