import { Plugin, PluginName } from "./@types/plugins"
import GithubPlugin from "./github"
import GithubConfig from "./github/types/GithubConfig"
import GithubData from "./github/types/GithubData"
import LastFmPlugin from "./lastfm"
import LastFmConfig from "./lastfm/types/envLastFM"
import { LastFmData } from "./lastfm/types/lastFmTypes"
import MyAnimeListPlugin from "./myanimelist"
import { MalData } from "./myanimelist/types/malTypes"
import MyAnimeListConfig from "./myanimelist/types/MyAnimeListConfig"

export interface PluginRegistry {
  github: {
    config: GithubConfig
    data: GithubData
  }
  lastfm: {
    config: LastFmConfig
    data: LastFmData
  }
  myanimelist: {
    config: MyAnimeListConfig
    data: MalData
  }
}

export const availablePlugins: { [K in PluginName]: Plugin<K> } = {
  github: GithubPlugin,
  lastfm: LastFmPlugin,
  myanimelist: MyAnimeListPlugin,
} as const

// Array de plugins para compatibilidade com código existente
const allPlugins = Object.values(availablePlugins) as Plugin<PluginName>[]

export default allPlugins
