import logger from "source/helpers/logger"
import dotenv from "dotenv"
import GITHUB_ENV_VARIABLES from "plugins/github/ENV_VARIABLES"
import LASTFM_ENV_VARIABLES from "plugins/lastfm/ENV_VARIABLES"
import { LastFmConfig } from "plugins/lastfm/types/envLastFM"
import MAL_ENV_VARIABLES from "plugins/myanimelist/ENV_VARIABLES"
import { toBoolean } from "source/helpers/boolean"
import { PluginsConfig, PluginsRawConfig } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import GithubConfig from "source/plugins/github/types/GithubConfig"
import MyAnimeListConfig from "source/plugins/myanimelist/types/MyAnimeListConfig"
import { splitString } from "../../source/helpers/string"
import loadPlugin from "../utils/loadPlugin"

function loadEnv(): PluginsConfig {
  logger({ message: "Loading environment variables...", level: "info", __filename })
  const env = dotenv.config().parsed

  if (!env) {
    throw new Error("No .env file found")
  }

  // Create a copy of the env for logging, removing sensitive data
  const sanitizedEnv = { ...env }
  const sensitiveKeys = ["GH_TOKEN", "API_KEY", "API_SECRET"]

  // Remove sensitive data for logging
  sensitiveKeys.forEach((key) => {
    if (sanitizedEnv[key]) {
      sanitizedEnv[key] = "**** SENSITIVE DATA ****"
    }
  })

  // Log environment variables for debugging with sanitized data
  logger({
    message: `Environment variables: ${JSON.stringify(sanitizedEnv, null, 2)}`,
    level: "debug",
    __filename,
  })

  // Load main configs
  const ghToken = env.GH_TOKEN
  if (!ghToken) {
    throw new Error("Missing GH_TOKEN, please add it to your environment variables")
  }

  let storageMethod = env.STORAGE_METHOD?.toLowerCase() ?? (MAIN_ENV_VARIABLES.storage_method?.defaultValue as string)
  if (
    MAIN_ENV_VARIABLES.storage_method?.options &&
    !MAIN_ENV_VARIABLES.storage_method.options.includes(storageMethod)
  ) {
    logger({ message: "Invalid STORAGE_METHOD, defaulting to gist", level: "warn", __filename })
    storageMethod = "gist"
  }

  const gistId = env.GIST_ID as string
  if (!gistId && storageMethod === "gist") {
    throw new Error("Missing GIST_ID, please add it to your environment variables")
  }

  let size = env.SIZE?.toLowerCase() ?? (MAIN_ENV_VARIABLES.size?.defaultValue as string)
  if (size !== "half" && size !== "full") {
    logger({ message: "Invalid SIZE, defaulting to half", level: "warn", __filename })
    size = "half"
  }

  const filename = env.FILENAME ?? (MAIN_ENV_VARIABLES.filename?.defaultValue as string)
  const pluginsOrder = env.PLUGINS_ORDER
    ? splitString(env.PLUGINS_ORDER)
    : (MAIN_ENV_VARIABLES.plugins_order?.defaultValue as string[])
  const style = env.STYLE ?? (MAIN_ENV_VARIABLES.style?.defaultValue as string)
  const customCss = env.CUSTOM_CSS as string
  const customPath = env.CUSTOM_PATH as string
  const hideTerminalEmojis = toBoolean(env.HIDE_TERMINAL_EMOJIS)

  const baseEnv: PluginsRawConfig = {
    gist_id: gistId,
    gh_token: "***********", // Ocultar token nos logs
    filename: filename,
    size: size,
    style: style,
    storage_method: storageMethod,
    custom_css: customCss,
    plugins_order: pluginsOrder,
    custom_path: customPath,
    hide_terminal_emojis: hideTerminalEmojis,
  }

  // Load plugin configs
  const malPluginConfig = loadPlugin<MyAnimeListConfig>(env, MAL_ENV_VARIABLES, "myanimelist")
  const lastfmPluginConfig = loadPlugin<LastFmConfig>(env, LASTFM_ENV_VARIABLES, "lastfm")
  const githubPluginConfig = loadPlugin<GithubConfig>(env, GITHUB_ENV_VARIABLES, "github")

  const config = {
    ...baseEnv,
    myanimelist: malPluginConfig,
    lastfm: lastfmPluginConfig,
    github: githubPluginConfig,
  }

  // Initialize plugin manager with processed configs
  const pluginManager = PluginManager.getInstance()
  pluginManager.initializeActivePlugins(config)

  return config
}

export default loadEnv
