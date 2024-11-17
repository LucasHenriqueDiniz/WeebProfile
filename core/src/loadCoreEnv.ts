import logger from "source/helpers/logger"
import dotenv from "dotenv"
import GITHUB_ENV_VARIABLES from "plugins/github/ENV_VARIABLES"
import LASTFM_ENV_VARIABLES from "plugins/lastfm/ENV_VARIABLES"
import { LastFmConfig } from "plugins/lastfm/types/envLastFM"
import MAL_ENV_VARIABLES from "plugins/myanimelist/ENV_VARIABLES"
import { toBoolean } from "source/helpers/boolean"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import GithubConfig from "source/plugins/github/types/GithubConfig"
import MyAnimeListConfig from "source/plugins/myanimelist/types/MyAnimeListConfig"
import { splitString } from "../../source/helpers/string"
import loadPlugin from "../utils/loadPlugin"
import { PluginsConfig, PluginsRawConfig } from "source/plugins/@types/plugins"
import { terminalThemes } from "source/plugins/@themes/terminal-themes"
import { defaultThemes } from "source/plugins/@themes/default-themes"

function loadCoreEnv(): PluginsConfig {
  logger({ message: "Loading environment variables...", level: "info", __filename })

  // Primeiro tenta carregar do ambiente, depois do .env
  let env: NodeJS.ProcessEnv | dotenv.DotenvParseOutput = process.env

  // Se não encontrar as variáveis necessárias no ambiente, tenta carregar do .env
  if (!env.GH_TOKEN) {
    const dotenvResult = dotenv.config()
    if (dotenvResult.error) {
      logger({
        message: "No .env file found, using environment variables",
        level: "warn",
        __filename,
      })
    } else {
      env = { ...process.env, ...dotenvResult.parsed }
    }
  }

  // Load main configs
  const ghToken = env.GH_TOKEN || env.GITHUB_TOKEN
  if (!ghToken) {
    throw new Error("Missing GH_TOKEN or GITHUB_TOKEN, please add it to your environment variables")
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
  const hideTerminalHeader = toBoolean(env.HIDE_TERMINAL_HEADER)
  let terminalTheme = env.TERMINAL_THEME ?? (MAIN_ENV_VARIABLES.terminal_theme?.defaultValue as string)

  if (terminalTheme && !Object.keys(terminalThemes).includes(terminalTheme)) {
    logger({ message: "Invalid TERMINAL_THEME, defaulting to default", level: "warn", __filename })
    terminalTheme = "default"
  }

  let defaultTheme = env.DEFAULT_THEME ?? (MAIN_ENV_VARIABLES.default_theme?.defaultValue as string)

  if (defaultTheme && !Object.keys(defaultThemes).includes(defaultTheme)) {
    logger({ message: "Invalid DEFAULT_THEME, defaulting to default", level: "warn", __filename })
    defaultTheme = "default"
  }

  const baseEnv: PluginsRawConfig = {
    dev: toBoolean(env.DEV),
    gist_id: gistId,
    gh_token: ghToken,
    filename: filename,
    size: size,
    style: style,
    storage_method: storageMethod,
    custom_css: customCss,
    plugins_order: pluginsOrder,
    custom_path: customPath,
    hide_terminal_emojis: hideTerminalEmojis,
    hide_terminal_header: hideTerminalHeader,
    terminal_theme: terminalTheme,
    default_theme: defaultTheme,
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

export default loadCoreEnv
