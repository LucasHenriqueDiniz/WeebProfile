import { PluginDataMap, PluginName, PluginsConfig } from "source/plugins/@types/plugins"
import fetchPluginsData from "source/plugins/@utils/fetchPluginsData"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import useStore from "./store"
import { ActionCode } from "./storeTypes"

function getDefaultValue(type: string): string | string[] | boolean | number | undefined {
  switch (type) {
    case "string":
      return ""
    case "stringArray":
      return []
    case "boolean":
      return false
    case "number":
      return 0
  }
}

function generateStartConfig(): PluginsConfig {
  return PluginManager.getInstance().createDefaultConfig()
}

async function generateStartData(): Promise<PluginDataMap> {
  return await fetchPluginsData(true)
}

function GenerateMarkdownCode(pluginsConfig: PluginsConfig) {
  const storeMethod = pluginsConfig.storage_method
  const size = pluginsConfig.size
  const filename = pluginsConfig.filename
  const gistId = pluginsConfig.gist_id
  const { githubUser } = useStore.getState()

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
      return `<img src="${url}" width="${size === "full" ? "100%" : "49%"}"  align="top" alt="🦀 height="100%" />`
    }
    case "repository":
      return "Not implemented yet"
    case "local":
      return "No markdown content for local storage"
    default:
      return `Unknown store method: ${storeMethod}`
  }
}

function GenerateActionCode(storeConfig: PluginsConfig, activePlugins: PluginName[]) {
  const withEntries: Record<string, string | boolean | number> = {}
  const pluginManager = PluginManager.getInstance()

  // Processa configurações globais
  Object.entries(MAIN_ENV_VARIABLES).forEach(([key, env]) => {
    const value = storeConfig[key]
    const entryName = key.toUpperCase()

    if (key === "gh_token" || key === "gist_id") {
      withEntries[entryName] = "${{ secrets." + entryName + " }}"
      return
    }

    if (value !== env.defaultValue && value !== undefined) {
      withEntries[entryName] = value
    }
  })

  // Process the active plugins' configurations
  activePlugins.forEach((pluginName) => {
    const plugin = pluginManager.getPlugin(pluginName)
    if (!plugin) return

    const config = storeConfig[pluginName]
    if (!config) return

    const pluginPrefix = "PLUGIN_" + pluginName.toUpperCase()
    withEntries[pluginPrefix] = true

    // Process the plugin's configuration
    Object.entries(config).forEach(([key, value]) => {
      // Type guard to ensure key exists in envVariables
      if (!(key in plugin.envVariables)) return
      const envVariable = plugin.envVariables[key as keyof typeof plugin.envVariables]
      if (!envVariable) return

      const sections = config.sections as string[]
      if (
        !envVariable.sections?.includes("main") &&
        !envVariable.sections?.some((section: string) => sections.includes(section))
      ) {
        return
      }

      const entryKey = `${pluginPrefix}_${key.toUpperCase()}`
      withEntries[entryKey] = value
    })
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

export { GenerateActionCode, GenerateMarkdownCode, generateStartConfig, generateStartData, getDefaultValue }
