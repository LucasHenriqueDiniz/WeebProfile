import PluginVariables from "../@types/PluginVariables"
import { ExamplePluginConfig } from "./types"

export const ExampleSections = ["statistics", "favorites"]

const ENV_VARIABLES: Record<keyof ExamplePluginConfig, PluginVariables> = {
  plugin_enabled: {
    type: "boolean",
    defaultValue: false,
    description: "Enable/disable the example plugin",
  },
  sections: {
    type: "stringArray",
    defaultValue: ["statistics", "favorites"],
    description: "Sections to display",
  },
  username: {
    type: "string",
    required: true,
    description: "Your username",
  },
  hide_title: {
    type: "boolean",
    defaultValue: false,
    description: "Hide section titles",
  },
  hide_header: {
    type: "boolean",
    defaultValue: false,
    description: "Hide plugin header",
  },
}

export default ENV_VARIABLES
