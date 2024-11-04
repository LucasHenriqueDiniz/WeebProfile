import { createPlugin } from "../@types/plugins"
import GITHUB_ENV_VARIABLES from "./ENV_VARIABLES"
import RenderGithub from "./RenderGithub"
import fetchGithubData from "./services/fetchGithub"
import { GithubSections } from "./types/GithubConfig"

const GithubPlugin = createPlugin({
  name: "github",
  envVariables: GITHUB_ENV_VARIABLES,
  sections: GithubSections,
  renderer: (plugin, data) => RenderGithub({ plugin, data }),
  fetchData: async (plugin, dev) => await fetchGithubData(plugin, dev),
})

export default GithubPlugin
