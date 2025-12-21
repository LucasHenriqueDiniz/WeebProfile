/**
 * Dados mock para o plugin Codewars
 */

import type { CodewarsData } from '../types'

export function getMockCodewarsData(): CodewarsData {
  return {
    rank: {
      name: '7 kyu',
      color: '#ffffff',
    },
    honor: 83,
    completedKata: [
      { name: 'RGB To Hex Conversion', difficulty: '6 kyu', completedAt: '2024-01-15T10:30:00Z' },
      { name: 'Multiples of 3 or 5', difficulty: '6 kyu', completedAt: '2024-01-14T15:20:00Z' },
      { name: 'Find the odd int', difficulty: '6 kyu', completedAt: '2024-01-13T08:15:00Z' },
      { name: 'Stop gninnipS My sdroW!', difficulty: '6 kyu', completedAt: '2024-01-12T14:45:00Z' },
      { name: 'Sum of Digits / Digital Root', difficulty: '6 kyu', completedAt: '2024-01-11T11:00:00Z' },
    ],
    languages: {
      javascript: { language: 'JavaScript', score: 2 },
      python: { language: 'Python', score: 11 },
      c: { language: 'C', score: 2 },
      csharp: { language: 'C#', score: 34 },
      typescript: { language: 'TypeScript', score: 16 },
    },
    leaderboardPosition: undefined,
  }
}

