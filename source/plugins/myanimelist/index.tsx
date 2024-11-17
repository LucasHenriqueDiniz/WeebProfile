import { createPlugin } from "../@types/plugins"
import MAL_ENV_VARIABLES from "./ENV_VARIABLES"
import RenderMyAnimeList from "./RenderMyAnimeList"
import { fetchMalData } from "./services/fetchMyAnimeList"
import { MyAnimeListSections } from "./types/MyAnimeListConfig"

const MyAnimeListPlugin = createPlugin({
  name: "myanimelist",
  envVariables: MAL_ENV_VARIABLES,
  sections: MyAnimeListSections,
  renderer: (plugin, data) => RenderMyAnimeList({ plugin, data }),
  fetchData: async (plugin, dev) => await fetchMalData(plugin, dev),
})

export default MyAnimeListPlugin
