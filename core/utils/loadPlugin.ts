import PluginVariables, { DefaultValue } from "plugins/@types/PluginVariables"
import splitString from "./splitString"
import toBoolean from "./toBoolean"
import dotenv from "dotenv"
import logger from "./logger"

function loadPlugin<T>(
  env: dotenv.DotenvParseOutput,
  ENV_VARIABLES: Record<string, PluginVariables>,
  pluginName: string
): T | undefined {
  logger({ message: `Loading ${pluginName} environment variables...`, level: "info", __filename })
  const returnConfig: Record<string, DefaultValue> = {}

  // Verify if the plugin is active
  const activePluginKeyName = `PLUGIN_${pluginName.toUpperCase()}`
  const isPluginActive = toBoolean(env[activePluginKeyName])

  if (!isPluginActive) {
    logger({ message: `Plugin ${pluginName} is not active, skipping`, level: "info", __filename })
    return undefined
  }

  // Process the plugin's environment variables
  for (const [key, config] of Object.entries(ENV_VARIABLES)) {
    if (key.toUpperCase() === activePluginKeyName) {
      returnConfig[key] = isPluginActive
      continue
    }

    const envKey = `PLUGIN_${pluginName.toUpperCase()}_${key.toUpperCase()}`
    let value = env[envKey]

    if (!value && config.required) {
      logger({
        message: `Missing required environment variable: ${envKey} for plugin ${pluginName}`,
        level: "warn",
        __filename,
      })
      value = String(config.defaultValue)
    }

    if (!value) continue

    // Verify and convert the variable type
    switch (config.type) {
      case "boolean":
        returnConfig[key] = toBoolean(value)
        break
      case "number":
        returnConfig[key] = parseInt(value, 10)
        break
      case "stringArray":
        returnConfig[key] = splitString(value)
        break
      default:
        returnConfig[key] = value
    }
  }

  return returnConfig as T
}

export default loadPlugin
