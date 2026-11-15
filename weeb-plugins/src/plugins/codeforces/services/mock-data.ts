/**
 * Dados mock para o plugin Codeforces
 */

import type { CodeforcesData } from "../types"

export function getMockCodeforcesData(): CodeforcesData {
  return {
    rating: 3096,
    rank: "legendary grandmaster",
    contestsCount: 150,
    // A whole history: letters past H grouped under I+, and the groups sum to the total.
    problemsSolved: {
      total: 1842,
      byDifficulty: {
        A: 312,
        B: 305,
        C: 291,
        D: 268,
        E: 224,
        F: 181,
        G: 122,
        H: 81,
        "I+": 58,
      },
    },
    recentSubmissions: [
      { problem: "1234A - Problem Name", verdict: "Accepted", date: "2024-01-15T10:30:00Z" },
      { problem: "1234B - Another Problem", verdict: "Accepted", date: "2024-01-14T15:20:00Z" },
      { problem: "1234C - Third Problem", verdict: "Wrong Answer", date: "2024-01-13T08:15:00Z" },
    ],
  }
}
