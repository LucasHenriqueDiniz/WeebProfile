/**
 * ImageComponent - Componente para exibir imagens
 * 
 * Versão adaptada para source-v2
 */

import React from 'react'

interface ImageComponentProps {
  url64?: string
  alt: string
  className?: string
  width?: number
  height?: number
  dontUseUrl64?: boolean
}

function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && process.versions && process.versions.node !== undefined
}

function getDefaultImg(dev: boolean, width: number, height: number): string {
  // Usar SVG inline como placeholder (funciona em Puppeteer)
  // Encode SVG para base64 de forma compatível com Node.js e browser
  const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#e5e7eb"/>
    <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No Image</text>
  </svg>`
  
  // Usar encodeURIComponent e btoa para compatibilidade
  const encoded = typeof Buffer !== 'undefined' 
    ? Buffer.from(svgContent).toString('base64')
    : btoa(unescape(encodeURIComponent(svgContent)))
  
  return `data:image/svg+xml;base64,${encoded}`
}

export function ImageComponent({
  url64,
  alt,
  className,
  width = 60,
  height = 60,
  dontUseUrl64 = false,
}: ImageComponentProps): React.ReactElement {
  const isNodeEnv = isNodeEnvironment()
  
  // Se não há URL, retorna placeholder
  if (!url64) {
    return (
      <img
        src={getDefaultImg(false, width, height)}
        alt={alt}
        data-name={alt}
        className={className}
        width={width}
        height={height}
      />
    )
  }

  // Verificar se já é um data URI (data:image/...)
  const isDataUri = url64.startsWith('data:')
  
  // Se é uma URL HTTP/HTTPS
  const isHttpUrl = url64.startsWith('http://') || url64.startsWith('https://')
  
  // Se já é data URI, usar diretamente
  if (isDataUri) {
    return (
      <img
        src={url64}
        alt={alt}
        data-name={alt}
        className={className}
        width={width}
        height={height}
      />
    )
  }
  
  // Em Node.js (Puppeteer), URLs HTTP não funcionam em SVGs
  // Se for URL HTTP em Node.js, tenta usar diretamente (Puppeteer pode conseguir carregar)
  // Se não funcionar, o placeholder será usado
  if (isNodeEnv && isHttpUrl && !dontUseUrl64) {
    // Tentar usar a URL diretamente - Puppeteer pode conseguir carregar em alguns casos
    // Se não funcionar, o navegador vai mostrar um erro mas não quebra o SVG
    return (
      <img
        src={url64}
        alt={alt}
        data-name={alt}
        className={className}
        width={width}
        height={height}
        onError={(e) => {
          // Em caso de erro ao carregar, usar placeholder
          const target = e.target as HTMLImageElement
          target.src = getDefaultImg(false, width, height)
        }}
      />
    )
  }
  
  // Se é base64 puro (sem prefixo) em Node.js, adiciona prefixo data:image/jpeg;base64,
  // Se for HTTP em browser, usa diretamente
  // Se for base64 em browser, já deve vir com prefixo ou ser usado diretamente
  const imageUrl = isNodeEnv && !dontUseUrl64 && !isHttpUrl && !isDataUri
    ? `data:image/jpeg;base64,${url64}` 
    : url64

  return (
    <img
      src={imageUrl}
      alt={alt}
      data-name={alt}
      className={className}
      width={width}
      height={height}
    />
  )
}

