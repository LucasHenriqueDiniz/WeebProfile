import PluginVariables from "source/plugins/@types/PluginVariables"
import LastFmPlugin from "./types/envLastFM"

const LASTFM_ENV_VARIABLES: Record<keyof LastFmPlugin, PluginVariables> = {
  plugin_enabled: {
    required: true,
    type: "boolean",
    description: "Enable LastFM plugin",
    defaultValue: false,
    sections: ["main"],
  },
  username: {
    required: true,
    type: "string",
    description: "LastFM username",
    sections: ["main"],
  },
  sections: {
    type: "stringArray",
    defaultValue: [],
    description: "Sections to display in the profile",
    sections: ["main"],
  },
  hide_intervals: {
    type: "boolean",
    description: "Hide the intervals of the profile",
    sections: ["main"],
    defaultValue: false,
  },
  recent_tracks_hide_title: {
    type: "boolean",
    description: "Hide the title of the recent tracks section",
    sections: ["recent_tracks"],
    defaultValue: false,
  },
  recent_tracks_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of recent tracks to display",
    sections: ["recent_tracks"],
  },
  top_artists_hide_title: {
    type: "boolean",
    description: "Hide the title of the top artists section",
    sections: ["top_artists_default", "top_artists_grid", "top_artists_list"],
    defaultValue: false,
  },
  top_artists_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of top artists to display",
    sections: ["top_artists_default", "top_artists_grid", "top_artists_list"],
  },
  top_albums_hide_title: {
    type: "boolean",
    description: "Hide the title of the top albums section",
    sections: ["top_albums_default", "top_albums_grid", "top_albums_list"],
    defaultValue: false,
  },
  top_albums_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of top albums to display",
    sections: ["top_albums_default", "top_albums_grid", "top_albums_list"],
  },
  top_tracks_hide_title: {
    type: "boolean",
    description: "Hide the title of the top tracks section",
    sections: ["top_tracks_default", "top_tracks_grid", "top_tracks_list"],
    defaultValue: false,
  },
  top_tracks_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of top tracks to display",
    sections: ["top_tracks_default", "top_tracks_grid", "top_tracks_list"],
  },
  statistics_hide_title: {
    type: "boolean",
    description: "Hide the title of the statistics section",
    sections: ["statistics"],
    defaultValue: false,
  },
  top_tracks_title: {
    type: "string",
    defaultValue: "Top Tracks",
    description: "Title of the top tracks section",
    sections: ["top_tracks_default", "top_tracks_grid", "top_tracks_list"],
  },
  top_artists_title: {
    type: "string",
    defaultValue: "Top Artists",
    description: "Title of the top artists section",
    sections: ["top_artists_default", "top_artists_grid", "top_artists_list"],
  },
  top_albums_title: {
    type: "string",
    defaultValue: "Top Albums",
    description: "Title of the top albums section",
    sections: ["top_albums_default", "top_albums_grid", "top_albums_list"],
  },
  recent_tracks_title: {
    type: "string",
    defaultValue: "Recent Tracks",
    description: "Title of the recent tracks section",
    sections: ["recent_tracks"],
  },
  statistics_title: {
    type: "string",
    defaultValue: "Statistics",
    description: "Title of the statistics section",
    sections: ["statistics"],
  },
  top_artists_interval_text: {
    type: "string",
    description: "Interval text for the top artists section",
    sections: ["top_artists_default", "top_artists_grid", "top_artists_list"],
  },
  top_albums_interval_text: {
    type: "string",
    description: "Interval text for the top albums section",
    sections: ["top_albums_default", "top_albums_grid", "top_albums_list"],
  },
  top_tracks_interval_text: {
    type: "string",
    description: "Interval text for the top tracks section",
    sections: ["top_tracks_default", "top_tracks_grid", "top_tracks_list"],
  },
}

export default LASTFM_ENV_VARIABLES
