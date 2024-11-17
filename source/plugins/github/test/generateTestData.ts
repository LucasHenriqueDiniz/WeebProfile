import { faker } from "@faker-js/faker"
import { ActivityData } from "../types/ActivityData"
import { CalendarData } from "../types/CalendarData"
import { CodeHabitsData } from "../types/CodeHabitsData"
import GithubData from "../types/GithubData"
import { ProcessedLanguage } from "../types/LanguagesData"
import { RepositoriesData, RepositoryData } from "../types/RepositoryData"
import { UserResponse } from "../types/UserResponse"

function generateTestRepositoryData(count: number = 10): RepositoryData[] {
  return Array.from({ length: count }, () => ({
    name: faker.internet.domainWord(),
    description: faker.lorem.sentence(),
    url: faker.internet.url(),
    stargazerCount: faker.number.int({ min: 0, max: 1000 }),
    forkCount: faker.number.int({ min: 0, max: 100 }),
    watchers: {
      totalCount: faker.number.int({ min: 0, max: 100 }),
    },
    releases: {
      totalCount: faker.number.int({ min: 0, max: 50 }),
    },
    packages: {
      totalCount: faker.number.int({ min: 0, max: 10 }),
    },
    licenseInfo: faker.helpers.arrayElement([{ name: "MIT" }, { name: "Apache-2.0" }, { name: "GPL-3.0" }, null]),
  }))
}

function generateTestUserData(): UserResponse {
  const weeks = Array.from({ length: 52 }, () => ({
    contributionDays: Array.from({ length: 7 }, () => ({
      color: faker.helpers.arrayElement(["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]),
      contributionCount: faker.number.int({ min: 0, max: 10 }),
      date: faker.date.recent().toISOString(),
    })),
  }))

  return {
    name: faker.person.fullName(),
    login: faker.internet.userName(),
    avatarUrl: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    followers: faker.number.int({ min: 0, max: 1000 }),
    following: faker.number.int({ min: 0, max: 1000 }),
    contributionCalendar: {
      totalContributions: faker.number.int({ min: 0, max: 5000 }),
      weeks,
    },
    repositoriesContributedTo: faker.number.int({ min: 0, max: 100 }),
  }
}

function generateTestCalendarData(): CalendarData {
  const weeks = Array.from({ length: 52 }, () => ({
    contributionDays: Array.from({ length: 7 }, (_, index) => ({
      color: faker.helpers.arrayElement(["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]),
      contributionCount: faker.number.int({ min: 0, max: 10 }),
      date: faker.date.recent().toISOString(),
      weekday: index,
    })),
  }))

  return {
    totalContributions: faker.number.int({ min: 0, max: 5000 }),
    weeks,
  }
}

function generateTestCodeHabitsData(): CodeHabitsData {
  const commitsByHour: Record<number, number> = {}
  const commitsByDay: Record<string, number> = {}
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Generate commits by hour
  for (let hour = 0; hour < 24; hour++) {
    commitsByHour[hour] = faker.number.int({ min: 0, max: 100 })
  }

  // Generate commits by day
  days.forEach((day) => {
    commitsByDay[day] = faker.number.int({ min: 0, max: 200 })
  })

  return {
    commitsByHour,
    commitsByDay,
    totalCommits: faker.number.int({ min: 1000, max: 10000 }),
    languages: generateTestLanguagesData().reduce(
      (acc, lang) => {
        acc[lang.name] = {
          count: lang.size,
          color: lang.color,
        }
        return acc
      },
      {} as Record<string, { count: number; color: string }>
    ),

    fileTypes: Array.from({ length: 10 }, () => ({
      filename: faker.system.fileName(),
      count: faker.number.int({ min: 1, max: 100 }),
    })).reduce(
      (acc, file) => {
        acc[file.filename] = file.count
        return acc
      },
      {} as Record<string, number>
    ),

    commitStats: {
      averageChangesPerCommit: faker.number.int({ min: 1, max: 100 }),
      totalFilesChanged: faker.number.int({ min: 1, max: 1000 }),
      largestCommit: faker.number.int({ min: 1, max: 10000 }),
    },
    analyzedCommits: faker.number.int({ min: 1, max: 1000 }),
    timeRange: {
      start: faker.date.past().toISOString(),
      end: faker.date.recent().toISOString(),
    },
  }
}

function generateTestActivityData(): ActivityData {
  return {
    totalCommitContributions: faker.number.int({ min: 0, max: 5000 }),
    totalPullRequestContributions: faker.number.int({ min: 0, max: 500 }),
    totalPullRequestReviewContributions: faker.number.int({ min: 0, max: 300 }),
    totalIssueContributions: faker.number.int({ min: 0, max: 200 }),
    issueComments: faker.number.int({ min: 0, max: 1000 }),
    organizations: faker.number.int({ min: 0, max: 10 }),
    following: faker.number.int({ min: 0, max: 1000 }),
    sponsorshipsAsSponsor: faker.number.int({ min: 0, max: 50 }),
    starredRepositories: faker.number.int({ min: 0, max: 500 }),
    watching: faker.number.int({ min: 0, max: 100 }),
    pullRequests: faker.number.int({ min: 0, max: 300 }),
    issues: faker.number.int({ min: 0, max: 200 }),
    gists: faker.number.int({ min: 0, max: 100 }),
    projects: faker.number.int({ min: 0, max: 10 }),
    totalRepositoriesWithContributedCommits: faker.number.int({ min: 0, max: 100 }),
    restrictedContributionsCount: faker.number.int({ min: 0, max: 100 }),
    repositoriesContributedTo: faker.number.int({ min: 0, max: 100 }),
  }
}

function generateTestRepositoriesData(): RepositoriesData {
  const repositories = generateTestRepositoryData()
  return {
    repositories,
    totalDiskUsage: faker.number.int({ min: 1000, max: 100000 }),
    favoriteLicense: {
      name: faker.helpers.arrayElement(["MIT", "Apache-2.0", "GPL-3.0"]),
      count: faker.number.int({ min: 1, max: 50 }),
    },
    sponsoringCount: faker.number.int({ min: 0, max: 100 }),
  }
}

function generateTestLanguagesData(): ProcessedLanguage[] {
  const availableLanguages = [
    { name: "JavaScript", color: "#f1e05a" },
    { name: "TypeScript", color: "#2b7489" },
    { name: "Python", color: "#3572A5" },
    { name: "Java", color: "#b07219" },
    { name: "Go", color: "#00ADD8" },
    { name: "Rust", color: "#dea584" },
    { name: "C++", color: "#f34b7d" },
    { name: "Ruby", color: "#701516" },
    { name: "PHP", color: "#4F5D95" },
    { name: "Swift", color: "#ffac45" },
  ]

  return availableLanguages.map((lang) => ({
    name: lang.name,
    color: lang.color,
    size: faker.number.int({ min: 1000, max: 1000000 }),
  }))
}

export default function generateTestData(): GithubData {
  return {
    user: generateTestUserData(),
    repositories: generateTestRepositoriesData(),
    activity: generateTestActivityData(),
    languages: generateTestLanguagesData(),
    calendar: generateTestCalendarData(),
    codeHabits: generateTestCodeHabitsData(),
    favoriteLicense: {
      name: faker.helpers.arrayElement(["MIT", "Apache-2.0", "GPL-3.0"]),
      count: faker.number.int({ min: 1, max: 100 }),
      total: faker.number.int({ min: 100, max: 999 }),
    },
  }
}
