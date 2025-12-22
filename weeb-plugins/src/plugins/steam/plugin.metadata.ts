/**
 * Metadata do Plugin Steam
 * 
 * This file defines all sections, configurations and options for the Steam plugin.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 * 
 * DO NOT edit metadata.ts manually - it is generated automatically from this file.
 */

export const steamPluginMetadata = {
  displayName: "Steam",
  description: "Show your Steam gaming statistics",
  category: "gaming" as const,
  icon: "Gamepad2",
  requiredFields: [],
  essentialConfigKeys: ["apiKey", "steamId"],
  essentialConfigKeysMetadata: [
    {
      key: "apiKey",
      label: "Steam Web API Key",
      type: "password" as const,
      placeholder: "your-api-key",
      description: "API Key from Steam Web API",
      helpUrl: "https://steamcommunity.com/dev/apikey",
      docKey: "steam.apiKey",
    },
    {
      key: "steamId",
      label: "Steam ID64",
      type: "text" as const,
      placeholder: "76561198000000000",
      description: "Your Steam ID64 (17 digits)",
      helpUrl: "https://steamid.io/",
      docKey: "steam.steamId",
    },
  ],
  sections: [
    {
      id: "statistics",
      name: "Statistics",
      description: "General statistics from Steam",
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
          key: "statistics_show_featured",
          label: "Show featured game",
          type: "boolean" as const,
          defaultValue: true,
          description: "Show the 'Destaque recente' card with the most played game in the last 2 weeks",
        },
      ],
    },
    {
      id: "recent_games",
      name: "Recent Games",
      description: "Games played in the last 2 weeks",
      configOptions: [
        {
          key: "recent_games_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_games_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Games",
        },
        {
          key: "recent_games_max",
          label: "Maximum games",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 games",
        },
        {
          key: "recent_games_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "list",
          description: "Choose how games are displayed",
          options: [
            { value: "list", label: "List" },
            { value: "compact", label: "Compact Grid (5 per row)" },
          ],
        },
      ],
    },
    {
      id: "top_games",
      name: "Top Games",
      description: "Most played games by total playtime",
      configOptions: [
        {
          key: "top_games_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "top_games_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Games",
        },
        {
          key: "top_games_max",
          label: "Maximum games",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 games",
        },
        {
          key: "top_games_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "list",
          description: "Choose how games are displayed",
          options: [
            { value: "list", label: "List" },
            { value: "compact", label: "Compact Grid (5 per row)" },
          ],
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["statistics", "recent_games", "top_games"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["statistics"],
    steamId: "",
  },
  fieldDefaults: {
    steamId: "76561198000000000",
  },
}

