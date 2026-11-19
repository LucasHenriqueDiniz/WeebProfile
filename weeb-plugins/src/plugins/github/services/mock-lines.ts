import type { GithubData } from "../types"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// A Sunday: the last of the 104 weeks
const LAST_WEEK = Date.UTC(2026, 10, 15)

/**
 * The lines section's mock: 104 weeks of a fixed, irregular rhythm (no randomness, so the
 * previews do not change from one run to the next), quiet weeks included.
 */
export function getMockLines(): NonNullable<GithubData["lines"]> {
  const weeks = Array.from({ length: 104 }, (_, i) => {
    const wave = Math.sin(i / 5) + Math.sin(i / 2.3) * 0.6 + Math.cos(i / 11) * 0.8
    const quiet = i % 9 === 4 || i % 13 === 7
    const added = quiet ? 0 : Math.round(Math.max(0, wave + 1.6) * 900 + (i % 7) * 140)
    const deleted = quiet ? 0 : Math.round(added * (0.25 + ((i * 37) % 10) / 25))
    return { date: new Date(LAST_WEEK - (103 - i) * WEEK_MS).toISOString().slice(0, 10), added, deleted }
  })
  const repositories = [
    { name: "weebprofile/weeb-profile", added: 412_380, deleted: 198_442 },
    { name: "weebprofile/anime-tracker", added: 128_905, deleted: 61_220 },
    { name: "weebprofile/dotfiles", added: 48_112, deleted: 31_067 },
    { name: "weebprofile/svg-toolkit", added: 22_640, deleted: 9_812 },
    { name: "weebprofile/discord-bot", added: 9_871, deleted: 4_305 },
    { name: "weebprofile/blog", added: 3_402, deleted: 1_150 },
  ]
  return {
    added: repositories.reduce((sum, repo) => sum + repo.added, 0),
    deleted: repositories.reduce((sum, repo) => sum + repo.deleted, 0),
    weeks,
    repositories,
    queried: 20,
    pending: 0,
    tooLarge: 0,
  }
}
