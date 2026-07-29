import type { GithubRepoData } from "../types"

// Avatar fake embutido (data URI) - com null aqui, todos os previews/wizard caíam no
// fallback de iniciais e o banner parecia quebrado ("avatar não carrega").
const MOCK_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><rect width="64" height="64" rx="32" fill="url(#g)"/><text x="32" y="41" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">LD</text></svg>`
  )

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
