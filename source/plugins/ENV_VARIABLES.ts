import { PluginsRawConfig } from "./@types/PluginsConfig"
import pluginVariables from "./@types/PluginVariables"

const MAIN_ENV_VARIABLES: Record<keyof PluginsRawConfig, pluginVariables> = {
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
}

export default MAIN_ENV_VARIABLES
