import isNodeEnvironment from "plugins/@utils/isNodeEnv"
import { PluginsConfig } from "plugins/@types/plugins"

function getEnvVariables(): PluginsConfig {
  const isNodeEnv = isNodeEnvironment()

  if (isNodeEnv) {
    const loadCoreEnv = require("core/src/loadCoreEnv")
    return loadCoreEnv()
  } else {
    // This need to be a conditional import because if not it tries to import the store from the server
    const getConfigValuesFromStore = require("web-client/app/store").getConfigValuesFromStore
    return getConfigValuesFromStore()
  }
}

export default getEnvVariables
