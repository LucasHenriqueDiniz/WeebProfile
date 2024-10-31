import PluginsConfig, { PluginsRawConfig } from "source/plugins/@types/PluginsConfig"
import fetchPluginsData from "source/plugins/@utils/fetchPluginsData"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import plugins, { PluginsData, pluginsNames } from "source/plugins/plugins"

import { ActionCode } from "./storeTypes"
import useStore from "./store"

function getDefaultValue(type: string): string | string[] | boolean | number | null {
  switch (type) {
    case "string":
      return ""
    case "stringArray":
      return []
    case "boolean":
      return false
    case "number":
      return 0
    default:
      return null
  }
}

function generateStartConfig(): PluginsConfig {
  const currentPluginConfig = Object.entries(MAIN_ENV_VARIABLES).reduce((acc, [key, env]) => {
    ;(acc as PluginsRawConfig)[key] = env.defaultValue !== undefined ? env.defaultValue : getDefaultValue(env.type)
    return acc
  }, {} as PluginsRawConfig)

  // Initialize pluginConfig as an empty object
  const pluginConfig = { ...currentPluginConfig }

  // Create a new empty object for each plugin
  Object.entries(plugins).forEach(([_pluginName, plugin]) => {
    pluginConfig[plugin.name] = {} // Assign an empty object to each plugin name
  })

  return pluginConfig
}

async function generateStartData(): Promise<PluginsData> {
  return await fetchPluginsData(true)
}

function generateMarkdownCode(pluginsConfig: PluginsConfig) {
  const storeMethod = pluginsConfig.storage_method
  const size = pluginsConfig.size
  const filename = pluginsConfig.filename
  const gistId = pluginsConfig.gist_id
  const { githubUser } = useStore()

  switch (storeMethod) {
    case "gist": {
      if (!filename) {
        return "ERROR: Please provide a filename!, it can be any name you want"
      }
      if (!gistId) {
        return "ERROR: Please provide a gist id!, you can find it in the url of your gist\nEX: https://gist.github.com/LucasHenriqueDiniz/28b547c41c7ed3082591d789f1a827ef -> 28b547c41c7ed3082591d789f1a827ef"
      }
      if (!githubUser) {
        return "ERROR: Please provide your github username!"
      }

      const url = `https://gist.githubusercontent.com/${githubUser}/${gistId}/raw/${filename}`
      return `<img src="${url}" width="${size == "full" ? "100%" : "49%"}"  align="top" alt="🦀 height="100%" />`
    }
    case "repository":
      return "Not implemented yet"
    case "local":
      return "No markdown content for local storage"
    default:
      return `Unknown store method: ${storeMethod}`
  }
}

function generateActionCode(storeConfig: PluginsConfig, activePlugins: string[]) {
  const withEntries: Record<string, string | boolean | number> = {}

  Object.keys(storeConfig).map((key) => {
    const value = storeConfig[key]
    const entryName = key.toUpperCase()

    // Process plugin specific config
    if (pluginsNames.includes(key)) {
      if (!activePlugins.includes(key)) {
        return
      }

      const pluginName = "PLUGIN_" + entryName.replace("PLUGIN_", "")
      // Process plugin specific config
      Object.entries(value).forEach(([entryKey, entryValue]) => {
        // Check if the entry is a plugin specific section
        if (pluginName === entryKey.toUpperCase()) {
          withEntries[pluginName] = true
          return
        }

        withEntries[pluginName + "_" + entryKey.toUpperCase()] = entryValue as string | number | boolean
      })

      // remove config that is not in the sections
      const sections = withEntries[pluginName + "_SECTIONS"]

      Object.entries(withEntries).forEach(([entryKey, _entryValue]) => {
        const isPluginRelatedConfig = entryKey.includes(pluginName)

        if (isPluginRelatedConfig) {
          const envVariables = plugins.find((plugin) => plugin.name.toUpperCase() === entryName)?.envVariables

          const relatedSections = envVariables?.[entryKey.replace(pluginName + "_", "").toLowerCase()]?.sections
          if (
            relatedSections &&
            sections &&
            !relatedSections.includes("main") &&
            !relatedSections.some((section) => Array.isArray(sections) && sections.includes(section))
          ) {
            delete withEntries[entryKey]
          }
        }
      })
    } else {
      // Process global config (non-plugin specific)

      if (key === "gh_token" || key === "gist_id") {
        withEntries[entryName] = "${{ secrets." + entryName + " }}"
      }

      const defaultValue = MAIN_ENV_VARIABLES[key]?.defaultValue
      if (value === defaultValue || !value) {
        return
      }

      withEntries[key.toUpperCase()] = value
    }
  })

  const actionCode: ActionCode = {
    name: "WeebProfile",
    on: {
      schedule: '[{ cron: "0 0 * * *" }]',
      workflow_dispatch: true,
    },
    jobs: {
      weeb_profile: {
        runs_on: "ubuntu-latest",
        steps: {
          name: "🦀 Setup 🦀",
          uses: "LucasHenriqueDiniz/WeebProfile@main",
          with: withEntries,
        },
      },
    },
  }

  return actionCode
}

export { getDefaultValue, generateStartConfig, generateStartData, generateMarkdownCode, generateActionCode }
