/**
 * Cliente HTTP para API do MyAnimeList (Jikan)
 * Com rate limiting, retry e tratamento de erros
 */
import Bottleneck from 'bottleneck';
declare const limiter: Bottleneck;
/**
 * Faz uma requisição GET para a API Jikan com rate limiting e retry
 */
export declare function jikanGet<T>(endpoint: string, retryCount?: number): Promise<T>;
export { limiter };
