import { createPlugin } from "../@types/plugins"
import LASTFM_ENV_VARIABLES from "./ENV_VARIABLES"
import RenderLastFm from "./RenderLastFm"
import LastFmApi from "./services/lastFmApi"
import { LastFmSections } from "./types/envLastFM"

const LastFmPlugin = createPlugin({
  name: "lastfm",
  envVariables: LASTFM_ENV_VARIABLES,
  sections: LastFmSections,
  renderer: (plugin, data) => RenderLastFm({ plugin, data }),
  fetchData: async (plugin, dev) => await LastFmApi(plugin, dev),
})

export default LastFmPlugin
