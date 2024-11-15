import { MalBasicFavorites, MalFullFavorites } from "./malFavorites"
import { MalLastUpdates } from "./malLastUpdates"
import { MalStatistics } from "./malStatistics"

interface MalData {
  favorites: MalBasicFavorites
  favorites_full: MalFullFavorites
  last_updated: MalLastUpdates
  statistics: MalStatistics
}

export type { MalData }
