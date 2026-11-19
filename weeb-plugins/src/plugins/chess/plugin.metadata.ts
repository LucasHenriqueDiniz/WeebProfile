/**
 * Chess Plugin Metadata
 *
 * This file defines all sections, configurations and options for the chess plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const chessPluginMetadata = {
  displayName: "Chess",
  description: "Show your Lichess or Chess.com profile, ratings, results and recent games",
  category: "gaming" as const,
  icon: "Crown",
  // Public data on both sites. The site is part of the username: the same name can be two
  // different people on Lichess and Chess.com.
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "profile",
      name: "Profile",
      description: "Avatar, title, name, country, join date and followers or play time",
      configOptions: [
        {
          key: "username",
          label: "Lichess or Chess.com profile",
          type: "string" as const,
          defaultValue: "",
          placeholder: "lichess.org/@/thibault",
          description:
            "Your profile link (lichess.org/@/name or chess.com/member/name), or lichess:name / chess.com:name",
          required: true,
          tooltip:
            "The same username can belong to different people on the two sites, so the card needs to know which one. Copy the link from your profile page.",
        },
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
          defaultValue: "Chess Profile",
        },
      ],
    },
    {
      id: "ratings",
      name: "Ratings",
      description: "Current and best rating per time control, and games played",
      configOptions: [
        {
          key: "ratings_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "ratings_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Chess Ratings",
        },
        {
          key: "ratings_show_best",
          label: "Show best rating",
          type: "boolean" as const,
          defaultValue: true,
          description: "The highest rating reached in each time control",
        },
        {
          key: "ratings_show_puzzles",
          label: "Show puzzles",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Lichess gives the current puzzle rating; Chess.com only the highest.",
        },
        {
          key: "ratings_show_unplayed",
          label: "Show unplayed time controls",
          type: "boolean" as const,
          defaultValue: false,
          description: "Time controls you never played, with a dash",
        },
      ],
    },
    {
      id: "results",
      name: "Results",
      description: "Wins, draws and losses in bullet, blitz, rapid, classical and daily games",
      configOptions: [
        {
          key: "results_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "results_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Chess Results",
        },
      ],
    },
    {
      id: "recent_games",
      name: "Recent Games",
      description: "Your latest games: result, opponent, time control and date",
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
          max: 10,
          step: 1,
          description: "Maximum 10 games",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "lichess.org/@/example",
    sections: ["profile", "ratings"],
  },
}
