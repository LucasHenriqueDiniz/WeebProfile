/**
 * MyAnimeList Plugin Metadata
 *
 * This file defines all sections, configurations and options for the MyAnimeList plugin.
 * It is used to automatically generate the centralized metadata.ts file.
 *
 * DO NOT edit metadata.ts manually - it is automatically generated from this file.
 */

export const myanimelistPluginMetadata = {
  displayName: "MyAnimeList",
  description: "Display your anime and manga statistics from MyAnimeList",
  category: "anime" as const,
  icon: "BookOpen",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "statistics",
      name: "Statistics",
      description: "General anime and manga statistics",
      configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Statistics",
        },
        {
          key: "statistics_media",
          label: "Media type",
          type: "select" as const,
          defaultValue: "both",
          options: [
            { value: "both", label: "Both" },
            { value: "anime", label: "Anime only" },
            { value: "manga", label: "Manga only" },
          ],
        },
      ],
    },
    {
      id: "last_activity",
      name: "Last Activity",
      description: "Latest anime and manga updates",
      configOptions: [
        {
          key: "last_activity_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "last_activity_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Last Activity",
        },
        {
          key: "last_activity_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 6,
          min: 1,
          max: 6,
          description: "Maximum number of activity items to display",
        },
        {
          key: "last_activity_hide_anime",
          label: "Hide anime",
          type: "boolean" as const,
          defaultValue: false,
          description: "Hide anime updates from last activity",
        },
        {
          key: "last_activity_hide_manga",
          label: "Hide manga",
          type: "boolean" as const,
          defaultValue: false,
          description: "Hide manga updates from last activity",
        },
      ],
    },
    {
      id: "statistics_simple",
      name: "Statistics Simple",
      description: "Simplified statistics",
      configOptions: [
        {
          key: "statistics_simple_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "statistics_simple_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Statistics",
        },
      ],
    },
    {
      id: "anime_bar",
      name: "Anime Bar",
      description: "Horizontal bar chart for anime statistics",
      configOptions: [
        {
          key: "anime_bar_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "anime_bar_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Anime Statistics",
        },
      ],
    },
    {
      id: "manga_bar",
      name: "Manga Bar",
      description: "Horizontal bar chart for manga statistics",
      configOptions: [
        {
          key: "manga_bar_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "manga_bar_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Manga Statistics",
        },
      ],
    },
    {
      id: "anime_favorites",
      name: "Anime Favorites",
      description: "Anime favorites with different list styles",
      configOptions: [
        {
          key: "anime_favorites_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "anime_favorites_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite Anime",
        },
        {
          key: "anime_favorites_list_style",
          label: "List style",
          type: "select" as const,
          defaultValue: "detailed",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
            { value: "detailed", label: "Detailed (Full list with summary)" },
            { value: "minimal", label: "Minimal (List without summary)" },
          ],
          description: "Choose the list display style",
        },
        {
          key: "anime_favorites_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of anime favorites to display",
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "manga_favorites",
      name: "Manga Favorites",
      description: "Manga favorites with different list styles",
      configOptions: [
        {
          key: "manga_favorites_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "manga_favorites_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite Manga",
        },
        {
          key: "manga_favorites_list_style",
          label: "List style",
          type: "select" as const,
          defaultValue: "detailed",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
            { value: "detailed", label: "Detailed (Full list with summary)" },
            { value: "minimal", label: "Minimal (List without summary)" },
          ],
          description: "Choose the list display style",
        },
        {
          key: "manga_favorites_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of manga favorites to display",
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "character_favorites",
      name: "Character Favorites",
      description: "Character favorites with different list styles",
      configOptions: [
        {
          key: "character_favorites_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "character_favorites_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite Characters",
        },
        {
          key: "character_favorites_list_style",
          label: "List style",
          type: "select" as const,
          defaultValue: "simple",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
          ],
          description: "Choose the list display style",
        },
        {
          key: "character_favorites_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of character favorites to display",
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "people_favorites",
      name: "People Favorites",
      description: "People favorites (authors, directors, etc) with different list styles",
      configOptions: [
        {
          key: "people_favorites_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "people_favorites_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite People",
        },
        {
          key: "people_favorites_list_style",
          label: "List style",
          type: "select" as const,
          defaultValue: "simple",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
          ],
          description: "Choose the list display style",
        },
        {
          key: "people_favorites_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of people favorites to display",
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
  ],
  globalConfigOptions: [
    {
      key: "favorites_max",
      label: "Max favorites",
      type: "number" as const,
      defaultValue: 20,
      description: "Maximum number of favorites to display (applies to all favorite sections)",
      min: 1,
      max: 20,
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["statistics", "last_activity"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["statistics"],
    username: "",
  },
  fieldDefaults: {
    username: "example",
  },
}
