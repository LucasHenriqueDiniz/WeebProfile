import dotenv from "dotenv"
import PluginVariables, { DefaultValue } from "plugins/@types/PluginVariables"
import { toBoolean } from "source/helpers/boolean"
import { splitString } from "source/helpers/string"
import logger from "source/helpers/logger"

function loadPlugin<T>(
  env: dotenv.DotenvParseOutput,
  ENV_VARIABLES: Record<string, PluginVariables>,
  pluginName: string
): T | undefined {
  logger({ message: `Loading ${pluginName} environment variables...`, level: "info", __filename })

  const pluginPrefix = `PLUGIN_${pluginName.toUpperCase()}`
  const isPluginActive = toBoolean(env[pluginPrefix])

  // Log the actual value for debugging
  logger({
    message: `Plugin ${pluginName} activation value: ${env[pluginPrefix]}`,
    level: "debug",
    __filename,
  })

  if (!isPluginActive) {
    logger({ message: `Plugin ${pluginName} is not active`, level: "info", __filename })
    return undefined
  }

  const returnConfig: Record<string, DefaultValue> = {
    plugin_enabled: true,
  }

  // Process other environment variables
  for (const [key, config] of Object.entries(ENV_VARIABLES)) {
    if (key === "plugin_enabled") continue

    const envKey = `${pluginPrefix}_${key.toUpperCase()}`
    let value = env[envKey]

    if (!value && config.required) {
      logger({
        message: `Missing required environment variable: ${envKey} for plugin ${pluginName}`,
        level: "warn",
        __filename,
      })
      value = String(config.defaultValue)
    }

    if (!value && config.defaultValue !== undefined) {
      value = String(config.defaultValue)
    }

    if (value !== undefined) {
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
  }

  return returnConfig as T
}

export default loadPlugin
