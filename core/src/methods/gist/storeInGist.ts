import logger from "core/utils/logger"
import updateGithubGist from "../../requests/updateGist"

async function storeInGist(gistId: string, token: string, data: string, filename: string) {
  if (!gistId || !token) {
    logger({ message: "Gist ID or Github Token not provided", level: "error", __filename })
    return
  }

  await updateGithubGist(gistId, token, data, "Github Profile Charts", filename)
}

export default storeInGist
