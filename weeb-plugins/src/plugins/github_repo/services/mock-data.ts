import type { GithubRepoData } from "../types"

// Avatar real do owner do repo mock, embutido em base64 (96px JPEG, ~3KB) - com
// null aqui os previews caíam no fallback de iniciais e o banner parecia quebrado.
const MOCK_AVATAR =
  "data:image/jpeg;base64,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"

export async function getMockGithubRepoData(): Promise<GithubRepoData> {
  return {
    name: "WeebProfile",
    nameWithOwner: "LucasHenriqueDiniz/WeebProfile",
    description: "Generate SVG stat cards for your GitHub profile — code, anime, music and gaming stats.",
    url: "https://github.com/LucasHenriqueDiniz/WeebProfile",
    owner: {
      login: "LucasHenriqueDiniz",
      avatarUrl: MOCK_AVATAR,
    },
    primaryLanguage: {
      name: "TypeScript",
      color: "#3178c6",
    },
    stargazerCount: 128,
    forkCount: 24,
    openIssuesCount: 12,
    watcherCount: 9,
    licenseInfo: {
      name: "MIT License",
      spdxId: "MIT",
    },
    topics: ["github-profile", "svg", "readme", "cloudflare-workers", "react"],
    languages: [
      { name: "TypeScript", color: "#3178c6", percentage: 68.4 },
      { name: "React", color: "#61dafb", percentage: 18.2 },
      { name: "CSS", color: "#563d7c", percentage: 9.1 },
      { name: "JavaScript", color: "#f1e05a", percentage: 4.3 },
    ],
    starHistory: [
      { date: "2023-01-15T00:00:00Z", count: 4 },
      { date: "2023-04-02T00:00:00Z", count: 18 },
      { date: "2023-07-20T00:00:00Z", count: 35 },
      { date: "2023-10-11T00:00:00Z", count: 52 },
      { date: "2024-01-05T00:00:00Z", count: 71 },
      { date: "2024-04-18T00:00:00Z", count: 89 },
      { date: "2024-08-02T00:00:00Z", count: 103 },
      { date: "2024-11-14T00:00:00Z", count: 116 },
      { date: "2025-03-01T00:00:00Z", count: 128 },
    ],
  }
}
