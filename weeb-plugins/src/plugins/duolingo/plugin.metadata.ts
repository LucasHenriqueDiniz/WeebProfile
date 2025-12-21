/**
 * Metadata do Plugin Duolingo
 * 
 * This file defines all sections, configurations and options for the Duolingo plugin.
 * It's used to automatically generate the centralized metadata.ts.
 * 
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 * 
 * WARNING: This plugin uses an unofficial Duolingo API that may break if Duolingo changes their structure.
 */

export const duolingoPluginMetadata = {
  displayName: "Duolingo",
  description: "Show your Duolingo learning statistics",
  category: "coding" as const,
  icon: "BookOpen",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "current_streak",
      name: "Duolingo Streak",
      description: "Display your current streak in days",
      configOptions: [
        {
          key: "current_streak_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "current_streak_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Current Streak",
        },
      ],
    },
    {
      id: "total_xp",
      name: "Total XP",
      description: "Display your total XP accumulated",
      configOptions: [
        {
          key: "total_xp_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "total_xp_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Total XP",
        },
      ],
    },
    {
      id: "languages_learning",
      name: "Languages Learning",
      description: "Display languages you're learning with XP per language",
      configOptions: [
        {
          key: "languages_learning_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "languages_learning_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Languages Learning",
        },
        {
          key: "languages_learning_max",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
        },
        {
          key: "languages_learning_hide_languages",
          label: "Hide languages",
          type: "array" as const,
          defaultValue: [],
          description: "List of language names to hide (e.g., Japanese, French)",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["current_streak", "total_xp", "languages_learning"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["current_streak"],
    username: "",
  },
  fieldDefaults: {
    username: "example",
  },
}

