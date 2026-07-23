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
  }
}
