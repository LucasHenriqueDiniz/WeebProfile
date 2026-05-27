/**
 * Utilitário para converter URLs de imagens para base64
 * Converte URLs de imagens para base64 para embed direto no SVG
 * Essencial para compatibilidade com GitHub/GitLab e outros sites que bloqueiam imagens externas
 */

/**
 * Blocks private/loopback/link-local hostnames to prevent SSRF.
 * URLs come from external API responses (GitHub, Spotify, etc.) so
 * a compromised API could inject an internal address.
 */
function isPrivateOrLoopback(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (h === "localhost" || h === "0.0.0.0") return true
  if (/^127\./.test(h)) return true           // 127.0.0.0/8 loopback
  if (/^10\./.test(h)) return true             // 10.0.0.0/8 private
  if (/^192\.168\./.test(h)) return true       // 192.168.0.0/16 private
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true // 172.16-31.x private
  if (/^169\.254\./.test(h)) return true       // 169.254.x.x link-local (AWS metadata)
  if (/^::1$/.test(h)) return true             // IPv6 loopback
  if (/^fc00:/i.test(h)) return true           // IPv6 unique local
  if (/^fe80:/i.test(h)) return true           // IPv6 link-local
  return false
}

function isSafeImageUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url)
    if (protocol !== "https:" && protocol !== "http:") return false
    return !isPrivateOrLoopback(hostname)
  } catch {
    return false
  }
}

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export interface ImageFallbackOptions {
  artistName?: string
  albumName?: string
  trackName?: string
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
 * E carrega o sharp de forma assíncrona usando import dinâmico
 */
async function loadSharp(): Promise<any | null> {
  // Verificar se estamos em um ambiente Node.js
  if (typeof process === "undefined" || !process.versions || !process.versions.node) {
    return null
  }

  // Tentar carregar Sharp usando import dinâmico (ES modules)
  try {
    const sharpModule = await import("sharp")
    // Sharp é exportado como default
    return sharpModule.default || sharpModule
  } catch {
    return null
  }
}

/**
 * Converte uma URL de imagem para base64 usando fetch
 * Funciona tanto em Node.js quanto no browser
 * Suporte opcional a otimização de imagem
 * @param imageUrl - URL da imagem
 * @param timeout - Timeout em ms
 * @param options - Opções de otimização
 * @param fallbackOptions - Opções para fallback (artista/álbum para buscar no Spotify)
 */
export async function urlToBase64(
  imageUrl: string,
  timeout = 15000,
  options?: ImageOptimizationOptions,
  fallbackOptions?: {
    artistName?: string
    albumName?: string
    trackName?: string
  }
): Promise<string> {
  try {
    if (!isSafeImageUrl(imageUrl)) {
      console.warn(`    🚫 Blocked unsafe URL: ${imageUrl.substring(0, 60)}`)
      return ""
    }

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

    // Se a imagem falhou com 404 e temos opções de fallback, tentar Spotify
    if (!response.ok && response.status === 404 && fallbackOptions?.artistName) {
      try {
        // Tentar buscar no Spotify usando fallback
        const { getArtistImageFromSpotify } = await import('../plugins/lastfm/services/artistImageFallback')
        const spotifyImageUrl = await getArtistImageFromSpotify(fallbackOptions.artistName)
        if (spotifyImageUrl) {
          // Tentar novamente com a URL do Spotify
          const spotifyController = new AbortController()
          const spotifyTimeoutId = setTimeout(() => spotifyController.abort(), timeout)
          
          const spotifyResponse = await fetch(spotifyImageUrl, {
            signal: spotifyController.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          })
          
          clearTimeout(spotifyTimeoutId)
          
          if (spotifyResponse.ok) {
            // Usar imagem do Spotify em vez da original
            const arrayBuffer = await spotifyResponse.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            
            // Aplicar otimização se necessário
            if (options) {
              try {
                const sharp = await loadSharp()
                if (sharp && typeof sharp === "function") {
                  const optimizedBuffer = await sharp(buffer)
                    .resize(options.maxWidth || 200, options.maxHeight || 200, {
                      fit: "inside",
                      withoutEnlargement: true,
                    })
                    .jpeg({ quality: options.quality || 70, mozjpeg: true })
                    .toBuffer()

                  const base64 = optimizedBuffer.toString("base64")
                  const contentType = spotifyResponse.headers.get("content-type") || "image/jpeg"
                  return `data:${contentType};base64,${base64}`
                }
              } catch (error) {
                // Usar versão original se Sharp falhar
              }
            }
            
            const base64 = buffer.toString("base64")
            const contentType = spotifyResponse.headers.get("content-type") || "image/jpeg"
            return `data:${contentType};base64,${base64}`
          }
        }
      } catch (fallbackError) {
        // Se fallback falhar, continuar com erro original
        console.warn(`    ⚠️  Fallback para Spotify falhou:`, fallbackError)
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText} (${response.status})`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Se temos opções de otimização, tentar usar Sharp para otimizar a imagem
    if (options) {
      try {
        // Tentar carregar Sharp usando import dinâmico
        const sharp = await loadSharp()
        if (sharp && typeof sharp === "function") {
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
        }
      } catch (error) {
        // Silenciosamente usar versão original se Sharp não estiver disponível ou falhar
        // Só logar se for um erro inesperado (não relacionado a Sharp não estar disponível)
        if (error instanceof Error && !error.message.includes("Cannot find module")) {
          console.warn(`⚠️  Falha ao otimizar imagem, usando versão original:`, error)
        }
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
