import { faker } from "@faker-js/faker"
import { ExamplePluginData } from "../types"

function generateTestStatisticsData() {
  return {
    totalItems: faker.number.int({ min: 0, max: 100 }),
    completedItems: faker.number.int({ min: 0, max: 100 }),
    inProgressItems: faker.number.int({ min: 0, max: 100 }),
  }
}

function generateTestFavoritesData() {
  return {
    items: Array.from({ length: 10 }, (_, id) => ({
      id,
      name: faker.word.words(3),
      score: faker.number.int({ min: 1, max: 10 }),
    })),
  }
}

function generateTestExamplePluginData(): ExamplePluginData {
  return {
    statistics: generateTestStatisticsData(),
    favorites: generateTestFavoritesData(),
  }
}

export default generateTestExamplePluginData
