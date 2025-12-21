/**
 * Dados mock para o plugin Duolingo
 * Usado em modo desenvolvimento
 */

import type { DuolingoData } from '../types'

export function getMockDuolingoData(): DuolingoData {
  return {
    streak: 123,
    totalXP: 96789,
    languages: [
      { language: 'Japanese', xp: 45230, level: 12 },
      { language: 'French', xp: 28450, level: 8 },
      { language: 'English', xp: 23109, level: 6 },
    ],
  }
}

