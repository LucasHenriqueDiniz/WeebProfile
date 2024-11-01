import ENV_VARIABLES_TYPE from "source/plugins/PluginVariables"
import githubPlugin from "./types/envGithub"

const GITHUB_ENV_VARIABLES: Record<keyof githubPlugin, ENV_VARIABLES_TYPE> = {
  plugin_github: {
    required: true,
    type: "boolean",
    description: "Enable GitHub plugin",
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
    defaultValue: ["favorite_languages"],
    description: "Sections to display in the profile",
    sections: ["main"],
  },
  hide_header: {
    type: "boolean",
    description: "Hide the header of the profile",
    sections: ["main"],
  },
  title: {
    type: "string",
    defaultValue: "GitHub",
    description: "Title of the profile",
    sections: ["main"],
  },
  profile_hide_title: {
    type: "boolean",
    description: "Hide the title of the profile section",
    sections: ["main"],
  },
  repository_title: {
    type: "string",
    defaultValue: "<qnt> Repositories",
    description: "Title of the repositories section",
    sections: ["repositories"],
  },
  repository_hide_title: {
    type: "boolean",
    description: "Hide the title of the repositories section",
    sections: ["repositories"],
  },
  favorite_languages_title: {
    type: "string",
    defaultValue: "<qnt> Languages",
    description: "Title of the favorite languages section",
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
  repositories_data_title: {
    type: "string",
    description: "Title of the repositories data section",
    sections: ["repositories_data"],
  },
  repositories_data_hide_title: {
    type: "boolean",
    description: "Hide the title of the repositories data section",
    sections: ["repositories_data"],
  },
  repository_name: {
    required: true,
    type: "string",
    description: "Name of the repository",
    sections: ["repositories_data"],
  },
}

export default GITHUB_ENV_VARIABLES
