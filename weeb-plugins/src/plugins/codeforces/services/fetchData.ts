/**
 * Serviço de fetch de dados do Codeforces
 * 
 * API: https://codeforces.com/api
 * Documentação: https://codeforces.com/apiHelp
 * 
 * Rate Limit: ~5 requests per second per IP
 */

import type { CodeforcesConfig, CodeforcesData, CodeforcesSubmission } from '../types'
import { getMockCodeforcesData } from './mock-data'
import { fetchJson } from '../../shared/utils/api'
import { ApiError } from '../../shared/utils/errors'

const CODEFORCES_API_BASE = 'https://codeforces.com/api'

/**
 * Último timestamp de requisição para throttling
 */
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 200 // 200ms = 5 req/s

/**
 * Aguarda o intervalo mínimo entre requisições (throttling)
 */
async function throttleRequest(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
}

/**
 * Resposta genérica da API do Codeforces
 */
interface CodeforcesApiResponse<T> {
  status: 'OK' | 'FAILED'
  result?: T
  comment?: string
}

/**
 * Resposta do endpoint user.info
 */
interface CodeforcesUserInfo {
  handle: string
  rating?: number
  rank?: string
  maxRating?: number
  maxRank?: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  organization?: string
  contribution: number
  friendOfCount: number
  registrationTimeSeconds: number
  lastOnlineTimeSeconds: number
  titlePhoto: string
  avatar: string
}

/**
 * Resposta do endpoint user.rating
 */
interface CodeforcesRatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

/**
 * Resposta do endpoint user.status
 */
interface CodeforcesSubmissionResponse {
  id: number
  contestId?: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: {
    contestId?: number
    index?: string
    name: string
    type: string
    points?: number
    rating?: number
    tags: string[]
  }
  author: {
    contestId?: number
    members: Array<{ handle: string }>
    participantType: string
    ghost: boolean
    room?: number
    startTimeSeconds?: number
  }
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

/**
 * Converte veredicto do Codeforces para formato legível
 */
function formatVerdict(verdict: string): string {
  const verdictMap: Record<string, string> = {
    'OK': 'Accepted',
    'WRONG_ANSWER': 'Wrong Answer',
    'TIME_LIMIT_EXCEEDED': 'Time Limit Exceeded',
    'MEMORY_LIMIT_EXCEEDED': 'Memory Limit Exceeded',
    'RUNTIME_ERROR': 'Runtime Error',
    'COMPILATION_ERROR': 'Compilation Error',
    'CHALLENGED': 'Challenged',
    'FAILED': 'Failed',
    'PARTIAL': 'Partial',
    'REJECTED': 'Rejected',
  }
  return verdictMap[verdict] || verdict
}

/**
 * Busca dados do Codeforces
 */
export async function fetchCodeforcesData(
  config: CodeforcesConfig,
  dev = false
): Promise<CodeforcesData> {
  if (dev) {
    return getMockCodeforcesData()
  }

  if (!config.username || typeof config.username !== 'string' || config.username.trim() === '') {
    throw new Error('Codeforces username (handle) is required. Please configure your username in the plugin settings.')
  }

  const handle = config.username.trim()

  try {
    // Buscar informações do usuário
    await throttleRequest()
    const userInfoUrl = `${CODEFORCES_API_BASE}/user.info?handles=${encodeURIComponent(handle)}`
    const userInfoResponse = await fetchJson<CodeforcesApiResponse<CodeforcesUserInfo[]>>(userInfoUrl)

    if (userInfoResponse.status !== 'OK' || !userInfoResponse.result || userInfoResponse.result.length === 0) {
      throw new ApiError(
        userInfoResponse.comment || 'User not found',
        404,
        'Codeforces'
      )
    }

    const userInfo = userInfoResponse.result?.[0]
    if (!userInfo) {
      throw new ApiError('User info not found in response', 404, 'Codeforces')
    }

    // Buscar rating history
    await throttleRequest()
    const ratingUrl = `${CODEFORCES_API_BASE}/user.rating?handle=${encodeURIComponent(handle)}`
    const ratingResponse = await fetchJson<CodeforcesApiResponse<CodeforcesRatingChange[]>>(ratingUrl)

    const contestsCount = ratingResponse.result?.length || 0

    // Buscar submissões recentes
    await throttleRequest()
    const submissionsUrl = `${CODEFORCES_API_BASE}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=100`
    const submissionsResponse = await fetchJson<CodeforcesApiResponse<CodeforcesSubmissionResponse[]>>(submissionsUrl)

    // Processar submissões
    const recentSubmissions: CodeforcesSubmission[] = []
    const problemsSolvedSet = new Set<string>()
    const problemsSolvedByDifficulty: Record<string, number> = {}

    if (submissionsResponse.result) {
      for (const submission of submissionsResponse.result) {
        // Contar apenas submissões aceitas (OK) como problemas resolvidos
        if (submission.verdict === 'OK' && submission.problem.name) {
          const problemKey = `${submission.problem.contestId || 'unknown'}-${submission.problem.index || 'unknown'}`
          if (!problemsSolvedSet.has(problemKey)) {
            problemsSolvedSet.add(problemKey)
            const difficulty = submission.problem.index?.[0] || 'Unknown'
            problemsSolvedByDifficulty[difficulty] = (problemsSolvedByDifficulty[difficulty] || 0) + 1
          }
        }

        // Adicionar às submissões recentes (limitado)
        if (recentSubmissions.length < 50) {
          const problemName = submission.problem.name
          const contestId = submission.problem.contestId
          const index = submission.problem.index
          const displayName = contestId && index ? `${contestId}${index} - ${problemName}` : problemName

          recentSubmissions.push({
            problem: displayName,
            verdict: formatVerdict(submission.verdict),
            date: new Date(submission.creationTimeSeconds * 1000).toISOString(),
            contestId,
            index,
          })
        }
      }
    }

    return {
      rating: userInfo.rating || 0,
      rank: userInfo.rank || 'Unrated',
      contestsCount,
      problemsSolved: {
        total: problemsSolvedSet.size,
        byDifficulty: problemsSolvedByDifficulty,
      },
      recentSubmissions: recentSubmissions.slice(0, 50),
    }
  } catch (error) {
    console.error('[Codeforces] Error fetching data:', error)
    
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new Error(`Codeforces user "${handle}" not found`)
    }

    // Retornar dados mock em caso de erro
    console.warn('[Codeforces] API error, using mock data as fallback')
    return getMockCodeforcesData()
  }
}

