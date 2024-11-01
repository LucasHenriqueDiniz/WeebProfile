import { Plugin } from "../plugins"
import MAL_ENV_VARIABLES from "./ENV_VARIABLES"
import RenderMyAnimeList from "./RenderMyAnimeList"
import { fetchMalData } from "./services/malApi"
import MyAnimeListConfig, { MyAnimeListSections } from "./types/envMal"
import { MalData } from "./types/malTypes"

const MyAnimeListPlugin: Plugin<{ plugin: MyAnimeListConfig; data: MalData }> = {
  name: "myanimelist",
  envVariables: MAL_ENV_VARIABLES,
  sections: MyAnimeListSections,
  renderer: RenderMyAnimeList,
  fetchData: async (plugin: MyAnimeListConfig, dev?: boolean) => await fetchMalData(plugin, dev),
}

export default MyAnimeListPlugin
