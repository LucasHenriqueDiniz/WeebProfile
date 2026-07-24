import type { GithubRepoData } from "../types"

export async function getMockGithubRepoData(): Promise<GithubRepoData> {
  return {
    name: "WeebProfile",
    nameWithOwner: "LucasHenriqueDiniz/WeebProfile",
    description: "Generate SVG stat cards for your GitHub profile — code, anime, music and gaming stats.",
    url: "https://github.com/LucasHenriqueDiniz/WeebProfile",
    owner: {
      login: "LucasHenriqueDiniz",
      avatarUrl: null,
    },
    primaryLanguage: {
      name: "TypeScript",
      color: "#3178c6",
    },
    stargazerCount: 128,
    forkCount: 24,
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
