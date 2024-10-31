import { faker } from "@faker-js/faker"
import { AnimeFavorites } from "plugins/myanimelist/types/malFavoritesResponse"
import UserData from "plugins/github/types/UserData"

export function createRandomGithubUser(): UserData {
  return {
    login: faker.internet.username(),
    avatarUrl: faker.image.avatarGitHub(),
    name: faker.person.fullName(),
    company: "null",
    location: faker.location.country(),
    bio: faker.lorem.sentence(),
    followers: { totalCount: faker.number.int({ min: 0, max: 10000 }) },
    following: { totalCount: faker.number.int({ min: 0, max: 10000 }) },
    createdAt: faker.date.past().toISOString(),
    email: faker.internet.email(),
    repositoriesContributedTo: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    gists: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    starredRepositories: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    packages: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    repositories: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    sponsorshipsAsMaintainer: { totalCount: faker.number.int({ min: 0, max: 100 }) },
    sponsorshipsAsSponsor: { totalCount: faker.number.int({ min: 0, max: 100 }) },
  }
}

export function createRandomAnimeFavorite(): AnimeFavorites {
  return {
    mal_id: faker.number.int({ min: 0, max: 10000 }),
    url: faker.internet.url(),
    title: faker.lorem.words(),
    images: {
      jpg: {
        image_url: faker.image.urlPicsumPhotos(),
        small_image_url: faker.image.urlPicsumPhotos(),
        large_image_url: faker.image.urlPicsumPhotos(),
      },
    },
    type: "TV",
    start_year: faker.date.past().getFullYear(),
  }
}
