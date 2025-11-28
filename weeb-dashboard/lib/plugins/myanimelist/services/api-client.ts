/**
 * Cliente HTTP para API do MyAnimeList (Jikan)
 * Com rate limiting, retry e tratamento de erros
 */

import Bottleneck from 'bottleneck'

// Setup rate limiting: 2 requests por segundo, reservatório de 60 requests
// Limite da API Jikan: 3 requests por segundo, 60 por minuto
// Vamos usar 2 por segundo para ter margem de segurança
const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 500, // 500ms entre requests (2 por segundo)
  reservoir: 60,
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000, // Recarrega a cada 60 segundos
})

const BASE_URL = 'https://api.jikan.moe/v4'
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 segundos base

/**
 * Aguarda um tempo específico
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Faz uma requisição GET para a API Jikan com rate limiting e retry
 */
export async function jikanGet<T>(endpoint: string, retryCount = 0): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  
  try {
    const response = await limiter.schedule(async () => {
      // Timeout de 30 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'WeebProfile/1.0',
          },
        })
        
        clearTimeout(timeoutId)
        
        // Rate limit exceeded - aguardar e tentar novamente
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After')
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (retryCount + 1)
          throw new Error(`RATE_LIMIT:${waitTime}`)
        }
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        
        return res.json()
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('TIMEOUT')
        }
        throw error
      }
    })
    
    return response as T
  } catch (error: any) {
    // Tratar rate limit com retry
    if (error.message?.startsWith('RATE_LIMIT:')) {
      const waitTime = parseInt(error.message.split(':')[1]) || RETRY_DELAY * (retryCount + 1)
      
      if (retryCount < MAX_RETRIES) {
        console.log(`  ⏳ Rate limit atingido. Aguardando ${waitTime / 1000}s antes de tentar novamente... (tentativa ${retryCount + 1}/${MAX_RETRIES})`)
        await sleep(waitTime)
        return jikanGet<T>(endpoint, retryCount + 1)
      } else {
        throw new Error(`Rate limit exceeded após ${MAX_RETRIES} tentativas`)
      }
    }
    
    // Tratar timeout com retry
    if (error.message === 'TIMEOUT' && retryCount < MAX_RETRIES) {
      console.log(`  ⏳ Timeout na requisição. Tentando novamente... (tentativa ${retryCount + 1}/${MAX_RETRIES})`)
      await sleep(RETRY_DELAY * (retryCount + 1))
      return jikanGet<T>(endpoint, retryCount + 1)
    }
    
    // Outros erros - tentar retry se ainda houver tentativas
    if (retryCount < MAX_RETRIES && !error.message?.includes('HTTP 4')) {
      console.log(`  ⚠️  Erro na requisição: ${error.message}. Tentando novamente... (tentativa ${retryCount + 1}/${MAX_RETRIES})`)
      await sleep(RETRY_DELAY * (retryCount + 1))
      return jikanGet<T>(endpoint, retryCount + 1)
    }
    
    throw error
  }
}

export { limiter }


