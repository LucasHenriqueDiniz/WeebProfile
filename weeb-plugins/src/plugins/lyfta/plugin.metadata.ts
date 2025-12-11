/**
 * Metadata do Plugin Lyfta
 * 
 * This file defines all sections, configurations and options for the Lyfta plugin.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 * 
 * DO NOT edit metadata.ts manually - it is generated automatically from this file.
 */

export const lyftaPluginMetadata = {
  displayName: "Lyfta",
  description: "Show your workout statistics from Lyfta",
  category: "gaming" as const,
  icon: "Dumbbell",
  requiredFields: [],
  essentialConfigKeys: ["apiKey"],
  essentialConfigKeysMetadata: [
    {
      key: "apiKey",
      label: "Lyfta API Key",
      type: "password" as const,
      placeholder: "your-api-key",
      description: "API Key from Lyfta (generate at https://my.lyfta.app/community/api)",
      helpUrl: "https://my.lyfta.app/community/api",
      docKey: "lyfta.apiKey",
    },
  ],
  sections: [
    {
      id: "statistics",
      name: "Statistics",
      description: "General workout statistics",
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
          key: "weight_unit",
          label: "Weight unit",
          type: "select" as const,
          defaultValue: "kg",
          options: [
            { value: "kg", label: "Kilograms (kg)" },
            { value: "lbs", label: "Pounds (lbs)" },
          ],
          description: "Unit to display weight values",
        },
      ],
    },
    {
      id: "recent_workouts",
      name: "Recent Workouts",
      description: "Recently performed workouts",
      configOptions: [
        {
          key: "recent_workouts_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_workouts_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Workouts",
        },
        {
          key: "workouts_max",
          label: "Maximum workouts",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 workouts",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["statistics", "recent_workouts"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["statistics"],
  },
  fieldDefaults: {},
}

