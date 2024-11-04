import { githubResponse } from "../types"
import fetchUserData from "./fetchUserData"
import fetchAllRepositoriesData from "./RepositoriesData"
import fetchRateLimit from "./rateLimit"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import GithubConfig from "../types/GithubConfig"
import logger from "source/helpers/logger"

async function fetchGithubData(plugin: GithubConfig, dev: boolean = false): Promise<githubResponse> {
  if (dev) {
    return {
      userData: null,
      repositoriesData: null,
    }
  }

  if (!plugin) {
    throw new Error("Plugin not found")
  }

  const { ghToken } = getEnvVariables()

  if (!ghToken) {
    throw new Error("GitHub token not found")
  }

  const sections = plugin.sections
  const login = plugin.username

  if (!login) {
    throw new Error("GitHub username not found")
  }

  let userData = null
  let repositoriesData = null

  if (sections.includes("profile")) {
    userData = await fetchUserData(login, ghToken)
  }

  repositoriesData = await fetchAllRepositoriesData(login, ghToken)

  const rateLimit = await fetchRateLimit(ghToken)

  logger({
    message: `Rate limit remaining: \n Remaining: ${rateLimit.rate.remaining} Used: ${rateLimit.rate.used}`,
    level: "debug",
    __filename,
  })

  return { userData, repositoriesData } as githubResponse
}

export default fetchGithubData
