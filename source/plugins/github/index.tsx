import { Plugin } from "../plugins"
import GITHUB_ENV_VARIABLES from "./ENV_VARIABLES"
import RenderGithub from "./RenderGithub"
import fetchGithubData from "./services/fetchGithub"
import { githubResponse } from "./types"
import GithubConfig, { GithubSections } from "./types/envGithub"

const GithubPlugin: Plugin<{ plugin: GithubConfig; data: githubResponse }> = {
  name: "github",
  envVariables: GITHUB_ENV_VARIABLES,
  sections: GithubSections,
  renderer: RenderGithub,
  fetchData: async (plugin: GithubConfig, dev?: boolean) => await fetchGithubData(plugin, dev),
}

export default GithubPlugin
