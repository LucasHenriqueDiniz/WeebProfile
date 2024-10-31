import loadPlugin from "../utils/loadPlugin"
import splitString from "../utils/splitString"
import GITHUB_ENV_VARIABLES from "plugins/github/ENV_VARIABLES"
import GithubPlugin from "plugins/github/types/envGithub"
import LASTFM_ENV_VARIABLES from "plugins/lastfm/ENV_VARIABLES"
import LastFmPlugin from "plugins/lastfm/types/envLastFM"
import MAL_ENV_VARIABLES from "plugins/myanimelist/ENV_VARIABLES"
import MyAnimeListPlugin from "plugins/myanimelist/types/envMal"
import PluginsConfig, { PluginsRawConfig } from "source/plugins/@types/PluginsConfig"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import dotenv from "dotenv"
import logger from "core/utils/logger"

function loadEnv(): PluginsConfig {
  logger({ message: "Loading environment variables...", level: "info", __filename })
  const env = dotenv.config().parsed

  if (!env) {
    throw new Error("No .env file found")
  }

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

  const baseEnv: PluginsRawConfig = {
    gist_id: gistId,
    gh_token: ghToken,
    filename: filename,
    size: size,
    style: style,
    storage_method: storageMethod,
    custom_css: customCss,
    plugins_order: pluginsOrder,
  }

  // Load plugin configs
  const malPluginConfig = loadPlugin<MyAnimeListPlugin>(env, MAL_ENV_VARIABLES, "myanimelist")
  const lastfmPluginConfig = loadPlugin<LastFmPlugin>(env, LASTFM_ENV_VARIABLES, "lastfm")
  const githubPluginConfig = loadPlugin<GithubPlugin>(env, GITHUB_ENV_VARIABLES, "github")

  return {
    ...baseEnv,
    myanimelist: malPluginConfig,
    lastfm: lastfmPluginConfig,
    github: githubPluginConfig,
  }
}

export default loadEnv
