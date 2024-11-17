import { BasePluginConfig } from "source/plugins/@types/plugins"

export interface GithubConfig extends BasePluginConfig {
  username?: string
  profile_hide_title?: boolean
  profile_title?: string
  profile_hide_avatar?: boolean
  favorite_languages_title?: string
  favorite_languages_hide_title?: boolean
  favorite_license_title?: string
  favorite_license_hide_title?: boolean
  favorite_languages_max_languages?: number
  favorite_languages_ignore_languages?: string
  repositories_title?: string
  repositories_hide_title?: boolean
  repositories_use_private?: boolean
  activity_title?: string
  activity_hide_title?: boolean
  calendar_title?: string
  calendar_hide_title?: boolean
  code_habits_title?: string
  code_habits_hide_title?: boolean
  code_habits_hide_languages?: boolean
  code_habits_hide_stats?: boolean
  code_habits_hide_weekdays?: boolean
  code_habits_hide_hours?: boolean
  code_habits_hide_footer?: boolean
}

export default GithubConfig
