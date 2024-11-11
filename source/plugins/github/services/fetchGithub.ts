import logger from "source/helpers/logger"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import {
  githubTestGenerateLanguagesData,
  githubTestGenerateRepositoriesData,
  githubTestGenerateUserData,
} from "../test/generateTestData"
import GithubConfig from "../types/GithubConfig"
import fetchUserData from "./fetchUserData"
import fetchRateLimit from "./rateLimit"
import fetchAllRepositoriesData from "./RepositoriesData"
import GithubData from "../types/GithubData"
import fetchPreferredLanguages from "./fetchPreferredLanguages"

async function fetchGithubData(plugin: GithubConfig, dev: boolean = false): Promise<GithubData> {
  if (dev) {
    return {
      userData: githubTestGenerateUserData(),
      repositoriesData: githubTestGenerateRepositoriesData(),
      languagesData: githubTestGenerateLanguagesData(),
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
  let languagesData = null

  if (sections.includes("profile")) {
    userData = await fetchUserData(login, ghToken)
  }

  if (sections.includes("repositories")) {
    repositoriesData = await fetchAllRepositoriesData(login, ghToken)
  }

  if (sections.includes("languages")) {
    languagesData = await fetchPreferredLanguages(login, ghToken)
  }

  const rateLimit = await fetchRateLimit(ghToken)

  logger({
    message: `Rate limit remaining: \n Remaining: ${rateLimit.rate.remaining} Used: ${rateLimit.rate.used}`,
    level: "debug",
    __filename,
  })

  return { userData, repositoriesData, languagesData } as GithubData
}

export default fetchGithubData
