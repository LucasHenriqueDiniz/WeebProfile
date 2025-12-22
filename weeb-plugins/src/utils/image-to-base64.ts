/**
 * Utilitário para converter URLs de imagens para base64
 * Usado para dados mock e desenvolvimento
 */

/**
 * Converte uma URL de imagem para base64 usando fetch
 * Funciona tanto em Node.js quanto no browser
 */
export async function urlToBase64(imageUrl: string, timeout = 15000): Promise<string> {
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
    const base64 = buffer.toString("base64")

    // Determinar o tipo MIME da imagem
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
