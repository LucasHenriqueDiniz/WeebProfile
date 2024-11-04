import PluginVariables from "source/plugins/@types/PluginVariables"
import MyAnimeListPlugin, { MyAnimeListSections } from "./types/MyAnimeListConfig"

const MAL_ENV_VARIABLES: Record<keyof MyAnimeListPlugin, PluginVariables> = {
  plugin_enabled: {
    required: true,
    type: "boolean",
    description: "Enable MyAnimeList plugin",
    sections: ["main"],
  },
  username: {
    required: true,
    type: "string",
    description: "MyAnimeList username",
    sections: ["main"],
  },
  sections: {
    type: "stringArray",
    defaultValue: [],
    description: "Sections to display in the profile",
    sections: ["main"],
    options: MyAnimeListSections,
  },
  hide_header: {
    type: "boolean",
    description: "Hide the header of the profile",
    sections: ["main"],
  },
  anime_favorites_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of anime favorites to display",
    sections: ["anime_favorites", "anime_simple_favorites"],
  },
  anime_favorites_hide_title: {
    type: "boolean",
    description: "Hide the title of the anime favorites section",
    sections: ["anime_favorites", "anime_simple_favorites"],
  },
  anime_favorites_title: {
    type: "string",
    defaultValue: "Anime Favorites",
    description: "Title of the anime favorites section",
    sections: ["anime_favorites", "anime_simple_favorites"],
  },
  character_favorites_title: {
    type: "string",
    defaultValue: "Character Favorites",
    description: "Title of the character favorites section",
    sections: ["character_favorites", "character_simple_favorites"],
  },
  character_favorites_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of character favorites to display",
    sections: ["character_favorites", "character_simple_favorites"],
  },
  character_favorites_hide_title: {
    type: "boolean",
    description: "Hide the title of the character favorites section",
    sections: ["character_favorites", "character_simple_favorites"],
  },
  people_favorites_hide_title: {
    type: "boolean",
    description: "Hide the title of the people favorites section",
    sections: ["people_favorites", "people_simple_favorites"],
  },
  people_favorites_title: {
    type: "string",
    defaultValue: "People Favorites",
    description: "Title of the people favorites section",
    sections: ["people_favorites", "people_simple_favorites"],
  },
  people_favorites_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of people favorites to display",
    sections: ["people_favorites", "people_simple_favorites"],
  },
  manga_favorites_title: {
    type: "string",
    defaultValue: "Manga Favorites",
    description: "Title of the manga favorites section",
    sections: ["manga_favorites", "manga_simple_favorites"],
  },
  manga_favorites_max: {
    type: "number",
    defaultValue: "5",
    description: "Number of manga favorites to display",
    sections: ["manga_favorites", "manga_simple_favorites"],
  },
  manga_favorites_hide_title: {
    type: "boolean",
    description: "Hide the title of the manga favorites section",
    sections: ["manga_favorites", "manga_simple_favorites"],
  },
  statistics_anime_title: {
    type: "string",
    defaultValue: "Anime Statistics",
    description: "Title of the anime statistics section",
    sections: ["statistics"],
  },
  statistics_manga_title: {
    type: "string",
    defaultValue: "Manga Statistics",
    description: "Title of the manga statistics section",
    sections: ["statistics"],
  },
  statistics_media: {
    type: "stringRadio",
    defaultValue: "both",
    description: "Media to display statistics for",
    sections: ["statistics"],
    options: ["anime", "manga", "both"],
  },
  statistics_hide_title: {
    type: "boolean",
    description: "Hide the title of the statistics section",
    sections: ["statistics"],
  },
  anime_bar_title: {
    defaultValue: "Anime Statistics",
    description: "Title of the anime statistics section",
    sections: ["anime_bar"],
    type: "string",
  },
  anime_bar_hide_title: {
    type: "boolean",
    description: "Hide the title of the anime statistics section",
    sections: ["anime_bar"],
  },
  manga_bar_title: {
    type: "string",
    defaultValue: "Manga Statistics",
    description: "Title of the manga statistics section",
    sections: ["manga_bar"],
  },
  manga_bar_hide_title: {
    type: "boolean",
    description: "Hide the title of the manga statistics section",
    sections: ["manga_bar"],
  },
  statistics_simple_title: {
    type: "string",
    defaultValue: "Simple Statistics",
    description: "Title of the simple statistics section",
    sections: ["statistics_simple"],
  },
  statistics_simple_hide_title: {
    type: "boolean",
    description: "Hide the title of the simple statistics section",
    sections: ["statistics_simple"],
  },
  last_activity_title: {
    type: "string",
    defaultValue: "Last Activity",
    description: "Title of the last activity section",
    sections: ["last_activity"],
  },
  last_activity_max: {
    type: "number",
    defaultValue: "6",
    description: "Number of activities to display",
    sections: ["last_activity"],
  },
  last_activity_hide_title: {
    type: "boolean",
    description: "Hide the title of the last activity section",
    sections: ["last_activity"],
  },
  last_activity_media: {
    type: "stringRadio",
    defaultValue: "both",
    description: "Media to display last activity for",
    sections: ["last_activity"],
    options: ["anime", "manga", "both"],
  },
  favorites_hide_overlay: {
    type: "boolean",
    description: "Hide the overlay in the image with the name or title of the favorites section",
    sections: [
      "anime_simple_favorites",
      "manga_simple_favorites",
      "people_simple_favorites",
      "character_simple_favorites",
    ],
  },
}

export default MAL_ENV_VARIABLES
