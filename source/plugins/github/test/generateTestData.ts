import { faker } from "@faker-js/faker"
import { RepositoriesData, UserData } from "../types"

function githubTestGenerateUserData(): UserData {
  return {
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatarGitHub(),
    bio: faker.hacker.phrase(),
    company: faker.company.name(),
    createdAt: faker.date.past().toISOString(),
    email: faker.internet.email(),
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

export { githubTestGenerateUserData, githubTestGenerateRepositoriesData }
