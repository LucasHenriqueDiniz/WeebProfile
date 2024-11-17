import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import storeInGist from "./methods/gist/storeInGist"
import storeLocally from "./methods/local/storeLocally"
import RenderBody from "./RenderBody"

async function main() {
  logger({ message: "Starting Weeb Profile...", level: "info", __filename, header: true })
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const { gist_id, gh_token, filename, storage_method } = env
  //render body
  const htmlString = await RenderBody()

  if (!htmlString || typeof htmlString !== "string") {
    logger({ message: "Something went wrong while rendering body", level: "error", __filename })
    throw new Error(
      `Something went wrong while rendering body, make sure the function returns a string ${typeof htmlString}`
    )
  }

  //store data
  switch (storage_method) {
    case "gist":
      logger({ message: "Storing in Gist", level: "info", __filename })
      await storeInGist(gist_id, gh_token, htmlString, filename)
      break
    case "local":
      await storeLocally(htmlString, filename)
      break
    case "repository":
      logger({ message: "Repository storage method not implemented yet", level: "error", __filename })
      break
    default:
      throw new Error("Invalid STORE_METHOD")
  }
}

main()
