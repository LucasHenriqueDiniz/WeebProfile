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
  // No apiKey. The Steam Web API key identifies the caller, not the account being
  // read -- any valid key can fetch any public profile -- so the generator uses its
  // own (see svg-generator/src/db/app-credentials.ts) instead of asking each user
  // for a credential that also administers their game server tokens.
  essentialConfigKeys: ["steamId"],
  essentialConfigKeysMetadata: [
    {
      key: "steamId",
      label: "Steam ID64",
      // "oauth" renders a connect button; the wizard still shows the text field
      // underneath, so signing in is the easy path and pasting the id stays a
      // working one. Strictly this is OpenID 2.0, which returns only the SteamID64
      // -- no token, no scope -- but the UI flow is the same.
      type: "oauth" as const,
      oauthProvider: "steam" as const,
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
          tooltip: "Maximum number of recent games to display. Games are ordered by most recently played.",
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
          tooltip: "Maximum number of top games to display. Games are ordered by total playtime (most played first).",
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
}
