/**
 * Metadata do Plugin Codewars
 */

export const codewarsPluginMetadata = {
  displayName: "Codewars",
  description: "Show your Codewars coding statistics",
  category: "coding" as const,
  icon: "Code",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "rank_honor",
      name: "Rank & Honor",
      description: "Display your current rank (kyu/dan) and honor points",
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
      description: "Display completed kata with difficulty",
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
          defaultValue: 5,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 kata",
        },
      ],
    },
    {
      id: "languages_proficiency",
      name: "Languages Proficiency",
      description: "Display proficiency by programming language",
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
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
        },
      ],
    },
    {
      id: "leaderboard_position",
      name: "Leaderboard Position",
      description: "Display your position in the leaderboard",
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
    sections: ["rank_honor", "completed_kata", "languages_proficiency", "leaderboard_position"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["rank_honor"],
    username: "",
  },
  fieldDefaults: {
    username: "example",
  },
}




