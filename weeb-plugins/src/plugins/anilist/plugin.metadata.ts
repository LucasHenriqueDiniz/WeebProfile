/**
 * AniList Plugin Metadata
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 * Run: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

export const anilistPluginMetadata = {
  displayName: "AniList",
  description: "Show your AniList anime and manga statistics",
  category: "anime" as const,
  icon: "Tv",
  requiredFields: ["username"],
  // A API GraphQL do AniList é pública para perfis públicos: username basta, e
  // nenhuma credencial é pedida ao usuário.
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "statistics",
      name: "Statistics",
      description: "Anime and manga counts, time watched and mean scores",
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
          defaultValue: "AniList Statistics",
        },
        {
          key: "statistics_media",
          label: "Media",
          type: "select" as const,
          defaultValue: "both",
          options: [
            { value: "both", label: "Anime and manga" },
            { value: "anime", label: "Anime only" },
            { value: "manga", label: "Manga only" },
          ],
        },
      ],
    },
    {
      id: "favorites_anime",
      name: "Favorite Anime",
      description: "Cover grid of your favourited anime",
      configOptions: [
        {
          key: "favorites_anime_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "favorites_anime_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite Anime",
        },
        {
          key: "favorites_anime_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 10,
        },
      ],
    },
    {
      id: "currently_watching",
      name: "Currently Watching",
      description: "In-progress anime with episode progress. Requires a public list.",
      configOptions: [
        {
          key: "currently_watching_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "currently_watching_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Currently Watching",
        },
        {
          key: "currently_watching_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 5,
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "weebprofile",
    sections: ["statistics", "favorites_anime"],
  },
}
