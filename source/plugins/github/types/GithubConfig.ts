import { BasePluginConfig } from "source/plugins/@types/plugins"

export interface GithubConfig extends BasePluginConfig {
  title?: string
  username?: string
  profile_hide_title?: boolean
  repositories_data_title?: string
  repositories_data_hide_title?: boolean
  repository_title?: string
  repository_hide_title?: boolean
  repository_name?: string
  favorite_languages_title?: string
  favorite_languages_hide_title?: boolean
  favorite_license_title?: string
  favorite_license_hide_title?: boolean
}

export default GithubConfig
