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
 * Verifica se estamos rodando dentro de um Cloudflare Worker
 * (svg-generator e weeb-dashboard Pages Functions)
 */
function isCloudflareWorker(): boolean {
  return typeof globalThis.navigator !== "undefined" && globalThis.navigator.userAgent === "Cloudflare-Workers"
}

/**
 * Otimiza uma imagem usando @cf-wasm/photon (WASM, disponível em Cloudflare Workers)
 * Retorna null se a otimização falhar (chamador deve usar o buffer original)
 */
async function optimizeWithPhoton(
  buffer: Buffer,
  options: ImageOptimizationOptions,
  contentType: string,
  debugLabel?: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    // subpath export types aren't resolved with moduleResolution=node (weeb-plugins),
    // but are resolved with moduleResolution=bundler (svg-generator); @ts-ignore avoids
    // "unused directive" errors in the latter.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { PhotonImage, SamplingFilter, resize } = await import("@cf-wasm/photon/workerd")

    const inputImage = PhotonImage.new_from_byteslice(new Uint8Array(buffer))
    const maxWidth = options.maxWidth || 200
    const maxHeight = options.maxHeight || 200

    const width = inputImage.get_width()
    const height = inputImage.get_height()
    const scale = Math.min(maxWidth / width, maxHeight / height, 1)
    const targetWidth = Math.max(1, Math.round(width * scale))
    const targetHeight = Math.max(1, Math.round(height * scale))

    const outputImage = scale < 1 ? resize(inputImage, targetWidth, targetHeight, SamplingFilter.Lanczos3) : inputImage

    const isPng = contentType.includes("png")
    const outputBytes = isPng ? outputImage.get_bytes() : outputImage.get_bytes_jpeg(options.quality || 70)

    inputImage.free()
    if (outputImage !== inputImage) outputImage.free()

    return {
      buffer: Buffer.from(outputBytes),
      contentType: isPng ? "image/png" : "image/jpeg",
    }
  } catch (error) {
    // Not fully silent anymore: a WASM decode trap here is a real, actionable failure
    // (e.g. a source image Photon can't decode at all), not routine control flow.
    console.warn(
      `⚠️  Photon failed to decode/encode image${debugLabel ? ` (${debugLabel})` : ""}:`,
      error instanceof Error ? error.message : error
    )
    return null
  }
}

/**
 * Carrega o sharp de forma assíncrona usando import dinâmico (apenas Node.js)
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
 * Otimiza um buffer de imagem usando Photon (Workers) ou Sharp (Node), com
 * fallback gracioso para o buffer original caso nenhum esteja disponível.
 */
async function optimizeBuffer(
  buffer: Buffer,
  options: ImageOptimizationOptions,
  contentType: string
): Promise<{ buffer: Buffer; contentType: string }> {
  if (isCloudflareWorker()) {
    const photonResult = await optimizeWithPhoton(buffer, options, contentType)
    if (photonResult) return photonResult
    return { buffer, contentType }
  }

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

      return { buffer: optimizedBuffer, contentType: "image/jpeg" }
    }
  } catch (error) {
    if (error instanceof Error && !error.message.includes("Cannot find module")) {
      console.warn(`⚠️  Falha ao otimizar imagem, usando versão original:`, error)
    }
  }

  return { buffer, contentType }
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
        const { getArtistImageFromSpotify } = await import("../plugins/lastfm/services/artistImageFallback")
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
            const spotifyContentType = spotifyResponse.headers.get("content-type") || "image/jpeg"
            const { buffer: optimizedBuffer, contentType: optimizedContentType } = options
              ? await optimizeBuffer(buffer, options, spotifyContentType)
              : { buffer, contentType: spotifyContentType }

            const base64 = optimizedBuffer.toString("base64")
            return `data:${optimizedContentType};base64,${base64}`
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
    const responseContentType = response.headers.get("content-type") || "image/jpeg"

    // Se temos opções de otimização, otimizar via Photon (Workers) ou Sharp (Node)
    const { buffer: finalBuffer, contentType } = options
      ? await optimizeBuffer(buffer, options, responseContentType)
      : { buffer, contentType: responseContentType }

    const base64 = finalBuffer.toString("base64")
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

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number]

// Magic-byte signatures, checked independently of the upstream Content-Type header
// (a mislabeled or spoofed header must not make it into the SVG unnoticed).
const JPEG_MAGIC = [0xff, 0xd8, 0xff]
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function bytesStartWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false
  return signature.every((byte, i) => bytes[i] === byte)
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false
  const riff = String.fromCharCode(bytes[0]!, bytes[1]!, bytes[2]!, bytes[3]!)
  const webp = String.fromCharCode(bytes[8]!, bytes[9]!, bytes[10]!, bytes[11]!)
  return riff === "RIFF" && webp === "WEBP"
}

function matchesMagicBytes(bytes: Uint8Array, mime: AcceptedMimeType): boolean {
  if (mime === "image/jpeg") return bytesStartWith(bytes, JPEG_MAGIC)
  if (mime === "image/png") return bytesStartWith(bytes, PNG_MAGIC)
  if (mime === "image/webp") return isWebp(bytes)
  return false
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
  /** Hard cap on the downloaded response size. Centralized, not a universal constant --
   * callers pick the value that fits their own display context (see MyAnimeList's
   * COVER_MAX_BYTES/AVATAR_MAX_BYTES). Exceeding it throws ImageTooLargeError; this
   * function never resizes, recompresses, or fetches a different (larger) URL instead. */
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
  // Uint8Array.prototype.toBase64 (confirmed available in the real Cloudflare Workers
  // runtime, see docs/tests/direct-base64-passthrough/). Buffer fallback covers Node
  // (weeb-debug-tool, preview scripts) and any older runtime without it -- no manual
  // byte-by-byte loop, no String.fromCharCode(...bytes) on a whole image, no Photon/Sharp.
  const maybeToBase64 = (bytes as unknown as { toBase64?: () => string }).toBase64
  if (typeof maybeToBase64 === "function") return maybeToBase64.call(bytes)
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64")
}

/**
 * Minimal, no-transformation image embedding: fetch -> ArrayBuffer -> base64 of the
 * exact same bytes -> data URI. No decode, no resize, no re-encode, no format
 * conversion, no cache/R2/KV. Validated end-to-end (byte-identity + real GitHub
 * Markdown rendering, including the cover that a previous, more complex Photon-based
 * pipeline believed was incompatible) in docs/tests/direct-base64-passthrough/.
 */
export async function urlToDataUriDirect(url: string, options: DirectImageOptions = {}): Promise<DirectImageResult> {
  const { maxBytes, allowedMimeTypes = ACCEPTED_MIME_TYPES, timeout = 15000 } = options

  if (!url.startsWith("https://")) {
    throw new InvalidImageError("Only https:// image URLs are allowed")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  let response: Response
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    })
  } finally {
    clearTimeout(timeoutId)
  }
  if (!response.ok) {
    throw new InvalidImageError(`HTTP ${response.status}`)
  }

  const mime = (response.headers.get("content-type") || "").split(";")[0]!.trim().toLowerCase()
  if (!allowedMimeTypes.includes(mime)) {
    throw new InvalidImageError(`Unsupported MIME type: ${mime || "(missing)"}`)
  }

  const contentLength = response.headers.get("content-length")
  if (maxBytes !== undefined && contentLength && Number(contentLength) > maxBytes) {
    throw new ImageTooLargeError(`Image exceeds maxBytes (${contentLength} > ${maxBytes})`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  if (maxBytes !== undefined && bytes.byteLength > maxBytes) {
    throw new ImageTooLargeError(`Image exceeds maxBytes (${bytes.byteLength} > ${maxBytes})`)
  }

  if (!matchesMagicBytes(bytes, mime as AcceptedMimeType)) {
    throw new InvalidImageError(`Content-Type "${mime}" does not match the file's magic bytes`)
  }

  return {
    dataUri: `data:${mime};base64,${encodeBase64(bytes)}`,
    mime,
    byteLength: bytes.byteLength,
  }
}
