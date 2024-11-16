import PluginVariables from "../@types/PluginVariables"
import GithubConfig from "./types/GithubConfig"

export const GithubSections = [
  "favorite_languages",
  "favorite_license",
  "profile",
  "repositories",
  "activity",
  "calendar",
  "code_habits",
]

const GITHUB_ENV_VARIABLES: Record<keyof GithubConfig, PluginVariables> = {
  plugin_enabled: {
    required: true,
    type: "boolean",
    description: "Enable GitHub plugin",
    defaultValue: false,
    sections: ["main"],
  },
  username: {
    required: true,
    type: "string",
    description: "GitHub username",
    sections: ["main"],
  },
  sections: {
    type: "stringArray",
    defaultValue: [],
    description: "Sections to display in the profile",
    options: GithubSections,
    sections: ["main"],
  },
  profile_hide_title: {
    type: "boolean",
    description: "Hide the title of the profile section",
    sections: ["profile"],
  },
  profile_hide_avatar: {
    type: "boolean",
    description: "Hide the avatar of the profile section",
    sections: ["profile"],
  },
  profile_title: {
    type: "string",
    defaultValue: "<username>",
    description: "Title of the profile section (use <username> to display the username)",
    sections: ["profile"],
  },
  favorite_languages_title: {
    type: "string",
    defaultValue: "<qnt> Languages",
    description: "Title of the favorite languages section",
    sections: ["favorite_languages"],
  },
  favorite_languages_max_languages: {
    type: "number",
    defaultValue: 4,
    description: "Maximum number of languages to display in the favorite languages section",
    sections: ["favorite_languages"],
  },
  favorite_languages_ignore_languages: {
    type: "string",
    defaultValue: "",
    description: "Comma separated list of languages to ignore in the favorite languages section",
    sections: ["favorite_languages"],
  },
  favorite_languages_hide_title: {
    type: "boolean",
    description: "Hide the title of the favorite languages section",
    sections: ["favorite_languages"],
  },
  favorite_license_title: {
    type: "string",
    defaultValue: "Favorite License",
    description: "Title of the favorite license section",
    sections: ["favorite_license"],
  },
  favorite_license_hide_title: {
    type: "boolean",
    description: "Hide the title of the favorite license section",
    sections: ["favorite_license"],
  },
  repositories_title: {
    type: "string",
    description: "Title of the repositories section",
    sections: ["repositories"],
  },
  repositories_hide_title: {
    type: "boolean",
    description: "Hide the title of the repositories section",
    sections: ["repositories"],
  },
  repositories_use_private: {
    type: "boolean",
    description: "Show private repositories in the repositories section",
    sections: ["repositories"],
  },
  activity_title: {
    type: "string",
    defaultValue: "Github Activity",
    description: "Title of the activity section",
    sections: ["activity"],
  },
  activity_hide_title: {
    type: "boolean",
    description: "Hide the title of the activity section",
    sections: ["activity"],
  },
  calendar_title: {
    type: "string",
    defaultValue: "Contribution Calendar",
    description: "Title of the calendar section",
    sections: ["calendar"],
  },
  calendar_hide_title: {
    type: "boolean",
    description: "Hide the title of the calendar section",
    sections: ["calendar"],
  },
  code_habits_title: {
    type: "string",
    defaultValue: "Code Habits",
    description: "Title of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_title: {
    type: "boolean",
    description: "Hide the title of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_languages: {
    type: "boolean",
    description: "Hide the languages of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_stats: {
    type: "boolean",
    description: "Hide the stats of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_weekdays: {
    type: "boolean",
    description: "Hide the title of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_hours: {
    type: "boolean",
    description: "Hide the hours of the code habits section",
    sections: ["code_habits"],
  },
  code_habits_hide_footer: {
    type: "boolean",
    description: "Hide the footer of the code habits section",
    sections: ["code_habits"],
  },
}

export default GITHUB_ENV_VARIABLES
