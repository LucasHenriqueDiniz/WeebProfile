import GithubPlugin from "plugins/github/types/envGithub"
import LastFmPlugin from "plugins/lastfm/types/envLastFM"
import MyAnimeListPlugin from "plugins/myanimelist/types/envMal"

export interface PluginsRawConfig {
  [key: string]: unknown
  // Main configs
  gist_id: string
  gh_token: string
  filename: string
  storage_method: string
  size: string
  style: string
  custom_css?: string
  plugins_order: string[]
  custom_path?: string
}

interface PluginsConfig extends PluginsRawConfig {
  // Plugins active
  myanimelist?: MyAnimeListPlugin
  lastfm?: LastFmPlugin
  github?: GithubPlugin
}

export default PluginsConfig
