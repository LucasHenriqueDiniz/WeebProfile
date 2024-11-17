import { faker } from "@faker-js/faker"
import logger from "source/helpers/logger"
import { MalBasicFavorites, MalFullFavorites } from "../types/malFavorites"
import { MalLastUpdates } from "../types/malLastUpdates"
import { MalStatistics } from "../types/malStatistics"
import { MalData } from "../types/malTypes"
import { animeData, characterData, mangaData, peopleData } from "./dummyData"

function generateTestStatisticsData(): MalStatistics {
  const animeStatistics = {
    days_watched: faker.number.float({ min: 50, max: 5000, fractionDigits: 1 }),
    mean_score: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    watching: faker.number.int({ min: 0, max: 5000 }),
    completed: faker.number.int({ min: 0, max: 5000 }),
    on_hold: faker.number.int({ min: 0, max: 5000 }),
    dropped: faker.number.int({ min: 0, max: 5000 }),
    plan_to_watch: faker.number.int({ min: 0, max: 5000 }),
    total_entries: faker.number.int({ min: 0, max: 100000 }),
    rewatched: faker.number.int({ min: 0, max: 5000 }),
    episodes_watched: faker.number.int({ min: 0, max: 100000 }),
  }

  const mangaStatistics = {
    days_read: faker.number.float({ min: 50, max: 5000, fractionDigits: 1 }),
    mean_score: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    reading: faker.number.int({ min: 0, max: 5000 }),
    completed: faker.number.int({ min: 0, max: 5000 }),
    on_hold: faker.number.int({ min: 0, max: 5000 }),
    dropped: faker.number.int({ min: 0, max: 5000 }),
    plan_to_read: faker.number.int({ min: 0, max: 5000 }),
    total_entries: faker.number.int({ min: 0, max: 100000 }),
    reread: faker.number.int({ min: 0, max: 5000 }),
    chapters_read: faker.number.int({ min: 0, max: 100000 }),
    volumes_read: faker.number.int({ min: 0, max: 100000 }),
  }

  return {
    anime: animeStatistics,
    manga: mangaStatistics,
  }
}

function generateTestFavoritesFullData(): MalFullFavorites {
  const animeFavorites = faker.helpers.arrayElements(animeData, { min: 10, max: 20 })
  const mangaFavorites = faker.helpers.arrayElements(mangaData, { min: 10, max: 20 })
  const peopleFavorites = faker.helpers.arrayElements(peopleData, { min: 10, max: 20 })
  const charactersFavorites = faker.helpers.arrayElements(characterData, { min: 10, max: 20 })

  return {
    anime: animeFavorites,
    manga: mangaFavorites,
    people: peopleFavorites,
    characters: charactersFavorites,
  }
}

function generateTestFavoritesData(): MalBasicFavorites {
  const animeFavorites = faker.helpers.arrayElements(animeData, { min: 10, max: 20 })
  const mangaFavorites = faker.helpers.arrayElements(mangaData, { min: 10, max: 20 })
  const peopleFavorites = faker.helpers.arrayElements(peopleData, { min: 10, max: 20 })
  const charactersFavorites = faker.helpers.arrayElements(characterData, { min: 10, max: 20 })

  return {
    anime: animeFavorites,
    manga: mangaFavorites,
    people: peopleFavorites,
    characters: charactersFavorites,
  }
}

function generateTestLastUpdatesData(): MalLastUpdates {
  return {
    anime: faker.helpers.arrayElements(animeData, { min: 10, max: 20 }).map((anime) => ({
      title: anime.title,
      image: anime.image,
      episodes_seen: faker.number.int({ min: 0, max: anime.episodes ?? 12 }),
      episodes_total: anime.episodes,
      score: faker.number.int({ min: 0, max: 10 }),
      status: faker.helpers.arrayElement(["Watching", "Completed", "On hold", "Dropped", "Plan to Watch"]),
      entry: anime,
      date: new Date().toISOString(),
    })),
    manga: faker.helpers.arrayElements(mangaData, { min: 10, max: 20 }).map((manga) => ({
      title: manga.title,
      image: manga.image,
      chapters_read: faker.number.int({ min: 0, max: manga.chapters ?? 12 }),
      chapters_total: manga.chapters,
      score: faker.number.int({ min: 0, max: 10 }),
      status: faker.helpers.arrayElement(["Reading", "Completed", "On hold", "Dropped", "Plan to Read"]),
      entry: manga,
      date: new Date().toISOString(),
    })),
  }
}

function generateTestMyAnimeListData(): MalData {
  logger({ message: `Generating test data for MyAnimeList`, level: "debug", __filename })
  return {
    favorites: generateTestFavoritesData(),
    favorites_full: generateTestFavoritesFullData(),
    last_updated: generateTestLastUpdatesData(),
    statistics: generateTestStatisticsData(),
  } as MalData
}

export default generateTestMyAnimeListData
