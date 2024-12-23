import { PluginsRawConfig } from "source/plugins/@types/plugins"
import pluginVariables from "./@types/PluginVariables"
import { terminalThemes } from "./@themes/terminal-themes"
import { defaultThemes } from "./@themes/default-themes"

const MAIN_ENV_VARIABLES: Record<keyof PluginsRawConfig, pluginVariables> = {
  dev: {
    type: "boolean",
    description: "If the plugin is running in dev mode",
    sections: ["none"],
    defaultValue: false,
  },
  filename: {
    defaultValue: "WeeboProfile.svg",
    type: "string",
    description: "The name of the SVG file that will be generated",
    sections: ["none"],
  },
  gist_id: {
    required: true,
    type: "string",
    description: "The Gist ID where the SVG will be saved",
    sections: ["none"],
  },
  gh_token: {
    required: true,
    type: "string",
    description: "The GitHub Token used to save the SVG",
    sections: ["none"],
  },
  size: {
    defaultValue: "half",
    type: "stringRadio",
    description: "The size of the SVG",
    sections: ["none"],
    options: ["half", "full"],
  },
  style: {
    defaultValue: "default",
    type: "stringRadio",
    description: "The style of the SVG (default or terminal)",
    sections: ["none"],
    options: ["default", "terminal"],
  },
  storage_method: {
    defaultValue: "gist",
    type: "stringRadio",
    description: "The storage method of the SVG",
    sections: ["none"],
    options: ["gist", "local", "repository"],
  },
  custom_css: {
    type: "string",
    description: "The custom CSS that will be applied to the SVG",
    sections: ["none"],
  },
  plugins_order: {
    defaultValue: ["github", "lastfm", "myanimelist"],
    type: "stringArray",
    description: "The order of the plugins that will be generated",
    options: ["github", "lastfm", "myanimelist"],
    sections: ["none"],
  },
  hide_terminal_emojis: {
    defaultValue: false,
    type: "boolean",
    description: "Hide the terminal emojis",
    sections: ["main"],
  },
  hide_terminal_header: {
    defaultValue: false,
    type: "boolean",
    description: "Hide the terminal header",
    sections: ["main"],
  },
  custom_path: {
    type: "string",
    description: "The custom path of the SVG",
    sections: ["main"],
  },
  terminal_theme: {
    defaultValue: "default",
    type: "stringRadio",
    description: "The theme of the terminal",
    sections: ["main"],
    options: Object.keys(terminalThemes),
  },
  default_theme: {
    defaultValue: "default",
    type: "stringRadio",
    description: "The default theme of the SVG",
    sections: ["main"],
    options: Object.keys(defaultThemes),
  },
}

export default MAIN_ENV_VARIABLES
