import { ExamplePluginData } from "../types"
import logger from "source/helpers/logger"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchData(_plugin: any, _dev: boolean): Promise<ExamplePluginData> {
  logger({ message: "Fetching example plugin data", level: "info", __filename })

  try {
    // Example mock data
    const data: ExamplePluginData = {
      statistics: {
        totalItems: 100,
        completedItems: 50,
        inProgressItems: 25,
      },
      favorites: {
        items: [
          { id: 1, name: "Example Item 1", score: 10 },
          { id: 2, name: "Example Item 2", score: 9 },
          { id: 3, name: "Example Item 3", score: 8 },
        ],
      },
    }

    return data
  } catch (error) {
    logger({ message: `Error fetching example data: ${error}`, level: "error", __filename })
    throw error
  }
}
