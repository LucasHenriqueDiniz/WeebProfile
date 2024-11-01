import GithubPlugin from "plugins/github"
import LastFmPlugin from "plugins/lastfm"
import LastFmConfig from "plugins/lastfm/types/envLastFM"
import MyAnimeListConfig from "plugins/myanimelist/types/envMal"
import { githubResponse } from "./github/types"
import { LastFmData } from "./lastfm/types/lastFmTypes"
import MyAnimeListPlugin from "./myanimelist"
import { MalData } from "./myanimelist/types/malTypes"
import pluginVariables from "./@types/PluginVariables"
import GithubConfig from "./github/types/envGithub"

export interface PluginsData {
  [key: string]: MalData | LastFmData | githubResponse | null
  myanimelist: MalData | null
  lastfm: LastFmData | null
  github: githubResponse | null
}

// how to make this more modular?
export type anyPluginConfig = MyAnimeListConfig | LastFmConfig | GithubConfig
export type anyPluginData = MalData | LastFmData | githubResponse | null

type FetchDataFunction<T> = (plugin: PluginType, dev: boolean) => Promise<T>

export interface PluginProps {
  plugin: PluginType // Config of the plugin
  data: anyPluginData // Data fetched by `fetchData` (optional)
}

export interface Plugin<T> {
  name: string
  envVariables: Record<string, pluginVariables>
  sections: string[]
  renderer: React.FC<T>
  fetchData: FetchDataFunction<anyPluginData>
}

// plugins is an array of all the plugins that exist in the project, each plugin is an object with the following properties:
// name: the name of the plugin, it should be unique
// envVariables: the environment variables of the plugin (config)
// sections: the sections that the plugin can have
// renderer: the component that will render the plugin
// fetchData: the function that will fetch the data of the plugin

const plugins = [MyAnimeListPlugin, LastFmPlugin, GithubPlugin]

export const pluginsNames = plugins.map((plugin) => plugin.name)

export const pluginsDataStructure = plugins.reduce((acc, plugin) => {
  acc[plugin.name] = null
  return acc
}, {} as PluginsData)

export type PluginsType = typeof plugins
export type PluginType =
  | Plugin<{ plugin: MyAnimeListConfig; data: MalData }>
  | Plugin<{ plugin: LastFmConfig; data: LastFmData }>
  | Plugin<{ plugin: GithubConfig; data: githubResponse }>

export default plugins
