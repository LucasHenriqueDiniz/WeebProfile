import isNodeEnvironment from "plugins/@utils/isNodeEnv"
import PluginsConfig from "../@types/PluginsConfig"
import loadCoreEnv from "core/src/loadCoreEnv"

let cachedEnvVariables: PluginsConfig | null = null

function getEnvVariables(): PluginsConfig {
  const isNodeEnv = isNodeEnvironment()

  if (isNodeEnv) {
    if (!cachedEnvVariables) {
      cachedEnvVariables = loadCoreEnv()
    }
    return cachedEnvVariables
  } else {
    // This need to be a conditional import because if not it tries to import the store from the server
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const getConfigValuesFromStore = require("web-client/app/store").getConfigValuesFromStore
    return getConfigValuesFromStore()
  }
}

export default getEnvVariables
