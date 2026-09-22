import {
  GitHubRepository,
  GitHubStats,
  GitHubLanguage,
  GitHubContributor,
  StarBucket,
  GitHubProjectConfig,
} from "../types"

export function getMockData(config: GitHubProjectConfig): {
  repository: GitHubRepository
  stats: GitHubStats
  languages: GitHubLanguage[]
  contributors: GitHubContributor[]
  starHistory: StarBucket[]
  sections_config: any
} {
  // Repository mock data
  const repository: GitHubRepository = {
    name: "WeebProfile",
    full_name: "LucasHenriqueDiniz/WeebProfile",
    description: "A simple and customizable way to display code, anime, and music stats on your GitHub profile README.",
    language: "TypeScript",
    stargazers_count: 457,
    forks_count: 153,
    open_issues_count: 17,
    watchers_count: 153,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
    },
    updated_at: "2026-01-15T10:30:00Z",
    created_at: "2024-01-15T10:30:00Z",
    homepage: "https://weeb-profile-web-client.vercel.app",
    topics: [
      "svg",
      "readme",
      "automation",
      "generator",
      "lastfm",
      "weeb",
      "myanimelist",
      "profile-generator",
      "github-actions",
      "readme-generator",
      "github-config",
      "profile-readme",
      "readme-profile",
    ],
    owner: {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
    },
    default_branch: "main",
  }

  // Stats mock data
  const stats: GitHubStats = {
    open_issues: 17,
    forks: 153,
    watchers: 457,
    stars: 730,
    pull_requests: 153,
    releases: 17,
    contributors: 153,
  }

  // Languages mock data
  const languages: GitHubLanguage[] = [
    { language: "TypeScript", bytes: 15000000, percentage: 65.2 },
    { language: "JavaScript", bytes: 5500000, percentage: 23.9 },
    { language: "CSS", bytes: 1200000, percentage: 5.2 },
    { language: "HTML", bytes: 800000, percentage: 3.5 },
    { language: "Other", bytes: 500000, percentage: 2.2 },
  ]

  // Contributors mock data
  const contributors: GitHubContributor[] = [
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 850,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 720,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 650,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 580,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 520,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 480,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 420,
      type: "User",
    },
    {
      login: "LucasHenriqueDiniz",
      avatar_url: "https://github.com/LucasHenriqueDiniz.png",
      html_url: "https://github.com/LucasHenriqueDiniz",
      contributions: 380,
      type: "User",
    },
  ]

  // Star History mock data (last 2 years for better chart testing)
  const starHistory: StarBucket[] = []
  const today = new Date()
  let totalStars = 457 // Start with current star count

  // Generate data for the last 2 years (730 days)
  for (let i = 729; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]!

    // Simulate realistic star growth with seasonal patterns
    const ageInDays = i
    let dailyStars: number

    if (ageInDays < 30) {
      // Recent: higher activity
      dailyStars = Math.floor(Math.random() * 50) + 20
    } else if (ageInDays < 180) {
      // 1-6 months: moderate growth
      dailyStars = Math.floor(Math.random() * 30) + 5
    } else if (ageInDays < 365) {
      // 6-12 months: steady growth
      dailyStars = Math.floor(Math.random() * 15) + 2
    } else {
      // 1-2 years: slow but steady
      dailyStars = Math.floor(Math.random() * 8) + 1
    }

    // Add some random spikes for realism
    if (Math.random() < 0.1) {
      dailyStars *= 2
    }

    totalStars += dailyStars

    starHistory.push({
      date: dateStr,
      stars_new: dailyStars,
      stars_total: totalStars,
    })
  }

  return {
    repository,
    stats,
    languages,
    contributors,
    starHistory,
    sections_config: config.sections_config || {
      banner: {
        enabled: true,
        style: "hero",
        background: "default",
        custom_avatar: "",
        hide_stars: false,
        hide_forks: false,
        hide_description: false,
        hide_watchers: true,
        show_contributors: false,
        contributors_limit: 5,
        terminal_font: "standard",
        custom_name: "",
        hide_ascii_box: false,
        hide_git_commands: false,
        custom_width: 0,
        hide_background: false,
      },
      stats: { enabled: true },
      languages: { enabled: true, top: 5 },
      contributors: { enabled: true, limit: 8 },
      starHistory: { enabled: false, chart_type: "line", show_grid: true, show_dots: false },
    },
  }
}
