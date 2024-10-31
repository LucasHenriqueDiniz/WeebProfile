import { Plugin } from "../plugins";
import LASTFM_ENV_VARIABLES from "./ENV_VARIABLES";
import RenderLastFm from "./RenderLastFm";
import LastFmApi from "./services/lastFmApi";
import LastFmConfig, { LastFmSections } from "./types/envLastFM";
import { LastFmData } from "./types/lastFmTypes";

const LastFmPlugin: Plugin<{ plugin: LastFmConfig; data: LastFmData }> = {
  name: "lastfm",
  envVariables: LASTFM_ENV_VARIABLES,
  sections: LastFmSections,
  renderer: RenderLastFm,
  fetchData: async (plugin: LastFmConfig, dev?: boolean) => await LastFmApi(plugin, dev),
};

export default LastFmPlugin;
