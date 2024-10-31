import loadEnv from "./loadCoreEnv"
import storeInGist from "./methods/gist/storeInGist"
import storeLocally from "./methods/local/storeLocally"
import RenderBody from "./RenderBody"
import logger from "core/utils/logger"

async function main() {
  logger({ message: "Starting Weeb Profile...", level: "info", __filename, header: true })
  //load env
  const loadedEnv = loadEnv()
  //destructure env
  const { gist_id, gh_token, filename, storage_method } = loadedEnv
  //render body
  const htmlString = await RenderBody({ env: loadedEnv })

  if (!htmlString || typeof htmlString !== "string") {
    throw new Error(
      `Something went wrong while rendering body, make sure the function returns a string ${typeof htmlString}`
    )
  }

  //store data
  switch (storage_method) {
    case "gist":
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
