/**
 * Codeforces Plugin Metadata
 *
 * This file defines all sections, configurations and options for the Codeforces plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const codeforcesPluginMetadata = {
  displayName: "Codeforces",
  description: "Show your Codeforces competitive programming statistics",
  category: "coding" as const,
  icon: "Code",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "rating_rank",
      name: "Rating & Rank",
      description: "Display your current rating and rank",
      configOptions: [
        {
          key: "rating_rank_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "rating_rank_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Rating & Rank",
        },
      ],
    },
    {
      id: "contests_participated",
      name: "Contests Participated",
      description: "Display the number of contests you've participated in",
      configOptions: [
        {
          key: "contests_participated_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "contests_participated_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Contests Participated",
        },
      ],
    },
    {
      id: "problems_solved",
      name: "Problems Solved",
      description: "Display the number of problems solved by difficulty",
      configOptions: [
        {
          key: "problems_solved_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "problems_solved_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Problems Solved",
        },
      ],
    },
    {
      id: "recent_submissions",
      name: "Recent Submissions",
      description: "Display your recent problem submissions",
      configOptions: [
        {
          key: "recent_submissions_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_submissions_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Submissions",
        },
        {
          key: "recent_submissions_max",
          label: "Maximum submissions",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 submissions",
          tooltip: "Maximum number of recent submissions to display. Submissions are ordered by most recent.",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["rating_rank", "contests_participated", "problems_solved"],
  },
}
