import { BasePluginConfig } from "../../@types/plugins"

// A plugin config should extend BasePluginConfig (defined in plugins.ts)
export interface ExamplePluginConfig extends BasePluginConfig {
  username: string
  hide_title?: boolean
  hide_header?: boolean
}

export interface ExamplePluginData {
  statistics: StatisticsData
  favorites: FavoritesData
}

export interface StatisticsData {
  totalItems: number
  completedItems: number
  inProgressItems: number
}

export interface FavoritesData {
  items: Array<{
    id: number
    name: string
    score: number
  }>
}
