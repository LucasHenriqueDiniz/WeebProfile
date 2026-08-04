/**
 * Dev.to Plugin Metadata
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 * Run: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

export const devtoPluginMetadata = {
  displayName: "Dev.to",
  description: "Show your Dev.to profile and recent articles",
  category: "coding" as const,
  icon: "PenLine",
  requiredFields: ["username"],
  // A API REST do Dev.to é pública para perfil e artigos: username basta, e nenhuma
  // credencial é pedida ao usuário.
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "profile",
      name: "Profile",
      description: "Name, avatar, location and join date",
      configOptions: [
        {
          key: "profile_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Dev.to",
        },
      ],
    },
    {
      id: "recent_articles",
      name: "Recent Articles",
      description: "Latest posts with reactions and comments",
      configOptions: [
        {
          key: "recent_articles_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_articles_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Articles",
        },
        {
          key: "recent_articles_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 5,
        },
      ],
    },
    {
      id: "top_tags",
      name: "Top Tags",
      description: "Most used tags across your recent posts. Counts that window, not your whole history.",
      configOptions: [
        {
          key: "top_tags_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "top_tags_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Tags (recent posts)",
        },
        {
          key: "top_tags_max",
          label: "Max tags",
          type: "number" as const,
          defaultValue: 8,
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "weebprofile",
    sections: ["profile", "recent_articles"],
  },
}
