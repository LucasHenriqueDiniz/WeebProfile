import { faker } from "@faker-js/faker";
import { MalStatisticsResponse } from "../types/malStatisticsResponse";
import { MalFavoritesResponse, MalFullFavoritesResponse } from "../types/malFavoritesResponse";
import fakeData from "./dummyData";
import { MalLastUpdatesResponse } from "../types/malLastUpdatesResponse";
import { MalProfileResponse } from "../types/malProfileResponse";
import { MalData } from "../types/malTypes";

function generateTestStatisticsData(): MalStatisticsResponse {
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
  };

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
  };

  return {
    anime: animeStatistics,
    manga: mangaStatistics,
  };
}

function generateTestFavoritesFullData(): MalFullFavoritesResponse {
  const animeFavorites = fakeData.animes;
  const mangaFavorites = fakeData.mangas;
  const peopleFavorites = fakeData.people;
  const charactersFavorites = fakeData.characters;

  return {
    anime: animeFavorites,
    manga: mangaFavorites,
    people: peopleFavorites,
    characters: charactersFavorites,
  };
}

function generateTestFavoritesData(): MalFavoritesResponse {
  const animeFavorites = fakeData.animes;
  const mangaFavorites = fakeData.mangas;
  const peopleFavorites = fakeData.people;
  const charactersFavorites = fakeData.characters;

  return {
    anime: animeFavorites,
    manga: mangaFavorites,
    people: peopleFavorites,
    characters: charactersFavorites,
  };
}

function generateTestLastUpdatesData(): MalLastUpdatesResponse {
  const animeLastUpdates = fakeData.updates.anime;
  const mangaLastUpdates = fakeData.updates.manga;
  return {
    anime: animeLastUpdates,
    manga: mangaLastUpdates,
  };
}

function generateTestProfileData(): MalProfileResponse {
  const data = {
    mal_id: faker.number.int({ min: 0, max: 100000 }),
    username: faker.internet.userName(),
    url: faker.internet.url(),
    images: {
      jpg: {
        image_url: faker.image.avatar(),
      },
    },
    last_online: faker.date.recent().toString(),
    gender: faker.person.gender(),
    birthday: faker.date.past().toString(),
    location: faker.location.country(),
    joined: faker.date.past().toString(),
    statistics: generateTestStatisticsData(),
    favorites: generateTestFavoritesData(),
    updates: generateTestLastUpdatesData(),
  };
  const about = faker.lorem.paragraph();
  const external = null;
  const profile = {
    data,
    about,
    external,
  };
  return profile;
}

function generateTestMyAnimeListData(): MalData {
  return {
    // profile: generateTestProfileData(),
    last_updated: generateTestLastUpdatesData(),
    statistics: generateTestStatisticsData(),
    favorites: generateTestFavoritesData(),
    favorites_full: generateTestFavoritesFullData(),
  };
}

export default generateTestMyAnimeListData;
