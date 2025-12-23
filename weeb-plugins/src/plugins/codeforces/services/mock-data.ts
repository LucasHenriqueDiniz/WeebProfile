/**
 * Dados mock para o plugin Codeforces
 */

import type { CodeforcesData } from '../types.js'

export function getMockCodeforcesData(): CodeforcesData {
  return {
    rating: 3096,
    rank: 'legendary grandmaster',
    contestsCount: 150,
    problemsSolved: {
      total: 842,
      byDifficulty: {
        'A': 156,
        'B': 198,
        'C': 187,
        'D': 142,
        'E': 98,
        'F': 61,
      },
    },
    recentSubmissions: [
      { problem: '1234A - Problem Name', verdict: 'Accepted', date: '2024-01-15T10:30:00Z' },
      { problem: '1234B - Another Problem', verdict: 'Accepted', date: '2024-01-14T15:20:00Z' },
      { problem: '1234C - Third Problem', verdict: 'Wrong Answer', date: '2024-01-13T08:15:00Z' },
    ],
  }
}

