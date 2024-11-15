import isNodeEnvironment from "plugins/@utils/isNodeEnv"
import { PluginsConfig } from "plugins/@types/plugins"
import logger from "source/helpers/logger"

function getEnvVariables(): PluginsConfig {
  logger({ message: "Getting environment variables...", level: "info", __filename })
  const isNodeEnv = isNodeEnvironment()

  if (isNodeEnv) {
    const coreEnv = require("core/src/loadCoreEnv").default()
    return coreEnv
  } else {
    // This need to be a conditional import because if not it tries to import the store from the server
    const getConfigValuesFromStore = require("web-client/app/store").getConfigValuesFromStore
    return getConfigValuesFromStore()
  }
}

export default getEnvVariables
