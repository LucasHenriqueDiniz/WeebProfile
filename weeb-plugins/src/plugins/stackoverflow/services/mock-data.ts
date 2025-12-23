/**
 * Dados mock para o plugin Stack Overflow
 */

import type { StackOverflowData } from '../types.js'

export function getMockStackOverflowData(): StackOverflowData {
  return {
    reputation: 5927,
    reputationChange: 0,
    badges: {
      gold: 0,
      silver: 1,
      bronze: 135,
    },
    answers: 234,
    questions: 156,
    topTags: [
      { name: 'bison', score: 79 },
      { name: 'flex-lexer', score: 83 },
      { name: 'c', score: 41 },
      { name: 'c++', score: 36 },
      { name: 'lex', score: 64 },
    ],
  }
}

