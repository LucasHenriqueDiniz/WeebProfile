import { faker } from "@faker-js/faker"
import { ProcessedLanguage } from "../types/LanguagesData"
import { RepositoriesData } from "../types/RepositoriesData"
import { UserResponse } from "../types/UserResponse"

function githubTestGenerateUserData(): UserResponse {
  return {
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatarGitHub(),
    createdAt: faker.date.past().toISOString(),
    followers: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    following: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    location: faker.location.city(),
    login: faker.internet.displayName(),
    repositoriesContributedTo: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    gists: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    packages: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    repositories: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
      totalDiskUsage: faker.number.int({ min: 0, max: 1000000 }),
    },
    starredRepositories: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    sponsorshipsAsMaintainer: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    sponsorshipsAsSponsor: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    databaseId: faker.number.int({ min: 1, max: 1000000 }),
    watching: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    issueComments: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    organizations: {
      totalCount: faker.number.int({ min: 0, max: 1000000 }),
    },
    contributionsCollection: {
      totalRepositoriesWithContributedCommits: faker.number.int({ min: 0, max: 1000000 }),
      totalCommitContributions: faker.number.int({ min: 0, max: 10000 }),
      restrictedContributionsCount: faker.number.int({ min: 0, max: 1000 }),
      totalIssueContributions: faker.number.int({ min: 0, max: 10000 }),
      totalPullRequestContributions: faker.number.int({ min: 0, max: 10000 }),
      totalPullRequestReviewContributions: faker.number.int({ min: 0, max: 10000 }),
    },
    calendar: {
      contributionCalendar: {
        weeks: faker.helpers.multiple(
          () => ({
            contributionDays: faker.helpers.multiple(
              () => ({
                contributionCount: faker.number.int({ min: 0, max: 10000 }),
                color: faker.color.human(),
              }),
              { count: 7 }
            ),
          }),
          { count: 52 }
        ),
      },
    },
  }
}

function githubTestGenerateRepositoriesData(): RepositoriesData {
  return {
    totalForks: faker.number.int({ min: 0, max: 1000000 }),
    totalWatchers: faker.number.int({ min: 0, max: 1000000 }),
    totalStars: faker.number.int({ min: 0, max: 1000000 }),
    totalReleases: faker.number.int({ min: 0, max: 1000000 }),
    totalDeployments: faker.number.int({ min: 0, max: 1000000 }),
    totalEnvironments: faker.number.int({ min: 0, max: 1000000 }),
    totalLanguages: [
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
      {
        name: faker.lorem.word(),
        color: faker.color.human(),
        size: faker.number.int({ min: 0, max: 1000000 }),
      },
    ],
    favoriteLicense: { name: faker.lorem.word(), count: faker.number.int({ min: 0, max: 1000000 }) },
    totalIssuesOpen: faker.number.int({ min: 0, max: 1000000 }),
    totalIssuesClosed: faker.number.int({ min: 0, max: 1000000 }),
    totalPRsOpen: faker.number.int({ min: 0, max: 1000000 }),
    totalPRsClosed: faker.number.int({ min: 0, max: 1000000 }),
    totalPRsMerged: faker.number.int({ min: 0, max: 1000000 }),
    repositories: [],
  }
}

function githubTestGenerateLanguagesData(): ProcessedLanguage[] {
  return faker.helpers.multiple(
    () => ({
      name: faker.lorem.word(),
      color: faker.color.human(),
      size: faker.number.int({ min: 0, max: 1000000 }),
      percentage: faker.number.int({ min: 0, max: 100 }),
    }),
    { count: 20 }
  )
}

export { githubTestGenerateUserData, githubTestGenerateRepositoriesData, githubTestGenerateLanguagesData }
