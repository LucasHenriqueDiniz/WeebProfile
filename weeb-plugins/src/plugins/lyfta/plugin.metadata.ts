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
          key: "statistics_period_days",
          label: "Period (days)",
          type: "number" as const,
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days for period stats",
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
    {
      id: "exercises",
      name: "Exercises",
      description: "Most performed exercises",
      configOptions: [
        {
          key: "exercises_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "exercises_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Exercises",
        },
        {
          key: "exercises_max",
          label: "Maximum exercises",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 exercises",
        },
        {
          key: "exercises_show_1rm",
          label: "Show estimated 1RM",
          type: "boolean" as const,
          defaultValue: true,
          description: "Display estimated one-rep max for each exercise",
        },
        {
          key: "exercises_compact",
          label: "Compact mode",
          type: "boolean" as const,
          defaultValue: false,
          description: "Hide avg/1RM, show only sessions count",
        },
        {
          key: "exercises_hide_images",
          label: "Hide exercise images",
          type: "boolean" as const,
          defaultValue: false,
          description: "Hide exercise images in the exercises list",
        },
      ],
    },
    {
      id: "overview",
      name: "Overview",
      description: "General workout summary for a period",
      configOptions: [
        {
          key: "overview_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "overview_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Overview",
        },
        {
          key: "overview_period_days",
          label: "Period (days)",
          type: "number" as const,
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days to include in overview",
        },
        {
          key: "overview_show_volume",
          label: "Show total volume",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "overview_show_duration",
          label: "Show total duration",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "overview_show_weekly_avg",
          label: "Show weekly average",
          type: "boolean" as const,
          defaultValue: true,
        },
      ],
    },
    {
      id: "last_workout",
      name: "Last Workout",
      description: "Detailed view of the most recent workout",
      configOptions: [
        {
          key: "last_workout_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "last_workout_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Last Workout",
        },
        {
          key: "last_workout_show_body_weight",
          label: "Show body weight",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "last_workout_max_exercises",
          label: "Maximum exercises",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 10,
          step: 1,
          description: "Maximum exercises to display",
        },
        {
          key: "last_workout_compact",
          label: "Compact mode",
          type: "boolean" as const,
          defaultValue: false,
          description: "Hide set details, show only volume",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["overview", "last_workout", "exercises", "recent_workouts"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["statistics"],
  },
  fieldDefaults: {},
}

