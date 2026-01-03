/**
 * Codewars Plugin Metadata
 *
 * This file defines all sections, configurations and options for the Codewars plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const codewarsPluginMetadata = {
  displayName: "Codewars",
  description: "Show your Codewars kata solving statistics",
  category: "coding" as const,
  icon: "Swords",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "rank_honor",
      name: "Rank & Honor",
      description: "Display your current rank and honor points",
      configOptions: [
        {
          key: "rank_honor_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "rank_honor_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Rank & Honor",
        },
      ],
    },
    {
      id: "completed_kata",
      name: "Completed Kata",
      description: "Display your recently completed kata",
      configOptions: [
        {
          key: "completed_kata_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "completed_kata_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Completed Kata",
        },
        {
          key: "completed_kata_max",
          label: "Maximum kata",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 kata",
          tooltip: "Maximum number of completed kata to display. Kata are ordered by most recently completed.",
        },
      ],
    },
    {
      id: "languages_proficiency",
      name: "Languages Proficiency",
      description: "Display your proficiency in different programming languages",
      configOptions: [
        {
          key: "languages_proficiency_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "languages_proficiency_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Languages Proficiency",
        },
        {
          key: "languages_proficiency_max",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
          tooltip: "Maximum number of languages to display. Languages are ordered by score (highest score first).",
        },
      ],
    },
    {
      id: "leaderboard_position",
      name: "Leaderboard Position",
      description: "Display your position on the global leaderboard",
      configOptions: [
        {
          key: "leaderboard_position_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "leaderboard_position_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Leaderboard Position",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["rank_honor", "completed_kata", "languages_proficiency"],
  },
}
