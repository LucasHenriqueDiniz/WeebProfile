import { createPlugin } from "../@types/plugins"
import ENV_VARIABLES, { ExampleSections } from "./ENV_VARIABLES"
import RenderPluginExample from "./RenderPluginExample"
import { fetchData } from "./services/fetchData"

// This is an example plugin to demonstrate how to create a new plugin
// When creating a real plugin, make sure to:
// 1. Add your plugin to the PluginRegistry in /plugins.ts
// 2. Add your plugin to availablePlugins in /plugins.ts
// 3. Create all necessary types and interfaces
// 4. Implement the required components and services

const ExamplePlugin = createPlugin({
  // The plugin name should match the one in PluginRegistry
  // @ts-expect-error - This is just an example plugin, in a real plugin you would add it to the PluginRegistry
  name: "example",

  // Environment variables configuration
  envVariables: ENV_VARIABLES,

  // Available sections for this plugin
  sections: ExampleSections,

  // Main renderer function - receives plugin config and data
  renderer: (plugin, data) => RenderPluginExample({ plugin, data }),

  // Data fetching function - can receive a dev flag for testing
  // @ts-expect-error - This is just an example plugin, in a real plugin you would add it to the PluginRegistry
  fetchData: async (plugin, dev) => await fetchData(plugin, dev),
})

export default ExamplePlugin
