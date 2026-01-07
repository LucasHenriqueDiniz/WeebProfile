/**
 * Markdown Helper
 * 
 * Gera código markdown para incluir imagens SVG no README do GitHub.
 * Considera o tamanho da imagem para usar o formato apropriado:
 * - full: markdown simples
 * - half: formato com <p align="center"> para permitir imagens lado a lado
 */

export interface MarkdownOptions {
  name: string
  url: string
  size: 'half' | 'full'
  lastGeneratedAt?: Date | string | null
}

/**
 * Adiciona cache-busting à URL usando timestamp da última geração
 */
function addCacheBusting(url: string, lastGeneratedAt?: Date | string | null): string {
  if (!lastGeneratedAt) {
    return url
  }

  const timestamp = typeof lastGeneratedAt === 'string' 
    ? new Date(lastGeneratedAt).getTime() 
    : lastGeneratedAt.getTime()

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${timestamp}`
}

/**
 * Gera código markdown para uma imagem SVG
 * 
 * @param options - Opções para gerar o markdown
 * @returns Código markdown formatado
 * 
 * @example
 * // Para imagem full:
 * generateMarkdown({ name: "Profile", url: "https://...", size: "full" })
 * // Retorna: ![Profile](https://...?v=1234567890)
 * 
 * @example
 * // Para imagem half:
 * generateMarkdown({ name: "Profile", url: "https://...", size: "half" })
 * // Retorna:
 * // <p align="center">
 * //   <img align="top" alt="Profile" src="https://...?v=1234567890" />
 * // </p>
 */
export function generateMarkdown(options: MarkdownOptions): string {
  const { name, url, size, lastGeneratedAt } = options
  
  // Adicionar cache-busting à URL
  const urlWithCache = addCacheBusting(url, lastGeneratedAt)

  if (size === 'full') {
    // Para imagens full, usar markdown simples
    return `![${name}](${urlWithCache})`
  } else {
    // Para imagens half, usar formato que permite imagens lado a lado
    return `<p align="center">
  <img align="top" alt="${name}" src="${urlWithCache}" />
</p>`
  }
}

/**
 * Gera código markdown para múltiplas imagens half lado a lado
 * 
 * @param images - Array de imagens half
 * @returns Código markdown formatado com todas as imagens
 * 
 * @example
 * generateMarkdownForMultipleHalf([
 *   { name: "LastFM", url: "https://...", lastGeneratedAt: new Date() },
 *   { name: "MAL", url: "https://...", lastGeneratedAt: new Date() }
 * ])
 */
export function generateMarkdownForMultipleHalf(
  images: Array<{ name: string; url: string; lastGeneratedAt?: Date | string | null }>
): string {
  if (images.length === 0) {
    return ''
  }

  if (images.length === 1) {
    return generateMarkdown({
      name: images[0].name,
      url: images[0].url,
      size: 'half',
      lastGeneratedAt: images[0].lastGeneratedAt,
    })
  }

  const imagesHtml = images
    .map((img) => {
      const urlWithCache = addCacheBusting(img.url, img.lastGeneratedAt)
      return `  <img align="top" alt="${img.name}" src="${urlWithCache}" />`
    })
    .join('\n')

  return `<p align="center">
${imagesHtml}
</p>`
}

