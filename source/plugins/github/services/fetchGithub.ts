import { githubResponse } from "../types"
import githubPlugin from "../types/envGithub"
import fetchUserData from "./UserData"
import fetchAllRepositoriesData from "./RepositoriesData"
import fetchRateLimit from "./rateLimit"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"

async function fetchGithubData(plugin: githubPlugin, dev: boolean = false): Promise<githubResponse> {
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

  const sections = plugin.sections
  const login = plugin.username

  let userData = null
  let repositoriesData = null

  if (sections.includes("profile")) {
    userData = await fetchUserData(login, ghToken)
  }

  repositoriesData = await fetchAllRepositoriesData(login, ghToken)

  const rateLimit = await fetchRateLimit(ghToken)

  console.log("Rate limit remaining: \n", "Remaining: ", rateLimit.rate.remaining, "Used: ", rateLimit.rate.used)

  return { userData, repositoriesData } as githubResponse
}

export default fetchGithubData
